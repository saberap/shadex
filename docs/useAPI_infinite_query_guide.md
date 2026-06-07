# useAPI Infinite Query Usage Guide

این راهنما نحوه استفاده از قابلیت **Infinite Query** در hook `useAPI` را توضیح می‌دهد.

## نیازمندی‌ها

- TanStack Query v5
- Hook `useAPI` با پشتیبانی از `isInfinity`

## استفاده پایه

برای فعال‌سازی Infinite Query، کافیست `isInfinity: true` را در options پاس دهید:

```typescript
import { useAPI } from "@/core/hooks/useAPI";

function TransactionList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useAPI(["account", "statement"], {
    isInfinity: true,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // اگر lastPage دارای hasMore یا nextPage بود
      if (lastPage?.hasMore) {
        return allPages.length; // صفحه بعدی
      }
      return undefined; // دیگه صفحه‌ای نیست
    },
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.items?.map((item) => (
            <div key={item.id}>{item.title}</div>
          ))}
        </div>
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "در حال بارگذاری..." : "بارگذاری بیشتر"}
        </button>
      )}
    </div>
  );
}
```

## پارامترهای Infinite Query

### `initialPageParam`

مقدار اولیه برای pageParam (معمولاً 0 یا 1):

```typescript
{
  isInfinity: true,
  initialPageParam: 0,
}
```

### `getNextPageParam`

تابعی که مشخص می‌کند صفحه بعدی چیست. اگر `undefined` یا `null` برگرداند، به معنای نبود صفحه بعدی است:

```typescript
{
  getNextPageParam: (lastPage, allPages) => {
    // روش 1: بر اساس hasMore
    if (lastPage?.hasMore) {
      return allPages.length;
    }

    // روش 2: بر اساس nextCursor
    return lastPage?.nextCursor;

    // روش 3: بر اساس pagination
    const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
    return allPages.length < totalPages ? allPages.length : undefined;
  },
}
```

### `getPreviousPageParam` (اختیاری)

برای دریافت صفحات قبلی (برای scroll کردن به بالا):

```typescript
{
  getPreviousPageParam: (firstPage, allPages) => {
    if (firstPage?.prevCursor) {
      return firstPage.prevCursor;
    }
    return undefined;
  },
}
```

## مثال‌های کاربردی

### 1. Pagination با شماره صفحه

```typescript
const { data, fetchNextPage, hasNextPage } = useAPI(
  ["products", "list"],
  {
    isInfinity: true,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    params: {
      pageSize: 20,
    },
  }
);
```

### 2. Cursor-based Pagination

```typescript
const { data, fetchNextPage, hasNextPage } = useAPI(
  ["messages", "list"],
  {
    isInfinity: true,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? undefined;
    },
  }
);
```

### 3. استفاده با pathParams و params

```typescript
const { data, fetchNextPage, hasNextPage } = useAPI(
  ["user", "transactions"],
  {
    isInfinity: true,
    pathParams: { userId: "123" },
    params: {
      type: "deposit",
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasNext ? allPages.length : undefined;
    },
  }
);
```

## ساختار داده برگشتی

وقتی از `isInfinity: true` استفاده می‌کنید، ساختار `data` به شکل زیر است:

```typescript
{
  pages: [
    // صفحه اول
    { items: [...], hasMore: true, nextCursor: "abc" },
    // صفحه دوم
    { items: [...], hasMore: true, nextCursor: "def" },
    // صفحه سوم
    { items: [...], hasMore: false, nextCursor: null },
  ],
  pageParams: [0, 1, 2] // مقادیر pageParam برای هر صفحه
}
```

برای نمایش همه آیتم‌ها:

```typescript
const allItems = data?.pages.flatMap((page) => page.items) ?? [];
```

## متدها و ویژگی‌های در دسترس

- `data`: شامل `pages` و `pageParams`
- `fetchNextPage()`: برای دریافت صفحه بعدی
- `fetchPreviousPage()`: برای دریافت صفحه قبلی
- `hasNextPage`: آیا صفحه بعدی وجود دارد؟
- `hasPreviousPage`: آیا صفحه قبلی وجود دارد؟
- `isFetchingNextPage`: در حال دریافت صفحه بعدی
- `isFetchingPreviousPage`: در حال دریافت صفحه قبلی
- `isFetching`: در حال دریافت اطلاعات (query یا صفحه جدید)
- `isLoading`: در حال بارگذاری اولیه
- `refetch()`: برای refetch کردن دستی
- `invalidate()`: برای invalidate کردن query

## Type Safety

این پیاده‌سازی کاملاً type-safe است:

```typescript
// ✅ TypeScript به درستی تشخیص می‌دهد که data.pages وجود دارد
const { data } = useAPI(["account", "statement"], {
  isInfinity: true,
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage?.nextPage,
});

// data.pages دارای تایپ صحیح است
data?.pages.forEach((page) => {
  // page دارای تایپ ApiResponseBody است
  console.log(page);
});

// ✅ بدون isInfinity، data ساختار معمولی دارد
const { data: normalData } = useAPI(["account", "statement"]);
// normalData به صورت مستقیم ApiResponseBody است
```

## Infinite Scroll با Intersection Observer

```typescript
import { useRef, useEffect } from "react";
import { useAPI } from "@/core/hooks/useAPI";

function InfiniteScrollList() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useAPI(
    ["products", "list"],
    {
      isInfinity: true,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage?.hasMore ? allPages.length : undefined;
      },
    }
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.items?.map((item) => (
            <div key={item.id}>{item.title}</div>
          ))}
        </div>
      ))}

      <div ref={loadMoreRef} className="h-20">
        {isFetchingNextPage && <p>در حال بارگذاری...</p>}
      </div>
    </div>
  );
}
```

## نکات مهم

1. **فقط برای GET کار می‌کند**: `isInfinity` فقط برای endpoint‌های GET قابل استفاده است.

2. **initialPageParam الزامی نیست**: اگر ندهید، به صورت `undefined` در نظر گرفته می‌شود.

3. **getNextPageParam**: حتماً باید `undefined` یا `null` برگرداند وقتی صفحه بعدی نیست.

4. **ساختار data متفاوت است**: به جای `data.items`، باید از `data.pages` استفاده کنید.

5. **Refetch**: متد `refetch` همچنان کار می‌کند و همه صفحات را مجدداً fetch می‌کند.

6. **Invalidate**: متد `invalidate` برای invalidate کردن query در دسترس است.

## خطاهای متداول

### ❌ فراموش کردن return undefined

```typescript
getNextPageParam: (lastPage) => {
  if (lastPage.hasMore) {
    return lastPage.nextPage;
  }
  // ❌ اگر else نباشه، ممکنه undefined برنگرده
};
```

### ✅ درست

```typescript
getNextPageParam: (lastPage) => {
  return lastPage.hasMore ? lastPage.nextPage : undefined;
};
```

### ❌ استفاده نادرست از data

```typescript
// ❌ data.items وجود نداره در infinite query
const items = data?.items;
```

### ✅ درست

```typescript
// ✅ باید از pages استفاده کنید
const allItems = data?.pages.flatMap((page) => page.items) ?? [];
```

## منابع

- [TanStack Query - Infinite Queries](https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries)
- [useAPI Usage Guide](./useAPI_usage_guide.md)
