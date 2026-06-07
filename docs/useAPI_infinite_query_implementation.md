# قابلیت Infinite Query در useAPI

قابلیت **Infinite Query** با موفقیت به hook `useAPI` اضافه شد. این قابلیت امکان بارگذاری صفحه‌بندی شده داده‌ها (pagination) را با استفاده از TanStack Query's `useInfiniteQuery` فراهم می‌کند.

## تغییرات اعمال شده

### 1. فایل `useAPI.ts`
- اضافه شدن `useInfiniteQuery` و `InfiniteData` از TanStack Query
- تعریف type های جدید:
  - `TIsInfinity`: برای مشخص کردن استفاده از infinite query
  - `TInfiniteQueryConfig`: برای پارامترهای مربوط به infinite query
  - `InfiniteApiReturnType`: برای تایپ بازگشتی infinite query
- اضافه شدن overload signatures برای type safety کامل
- پیاده‌سازی logic برای تشخیص و استفاده از `useInfiniteQuery` زمانی که `isInfinity: true`
- پشتیبانی از:
  - `initialPageParam`: مقدار اولیه pageParam
  - `getNextPageParam`: تابع برای تعیین صفحه بعدی
  - `getPreviousPageParam`: تابع برای تعیین صفحه قبلی

### 2. داکیومنت
- فایل `docs/useAPI_infinite_query_guide.md`: راهنمای کامل استفاده از infinite query
- مثال‌های عملی در `src/core/examples/useAPI-infinite-example.tsx`

## نحوه استفاده

### مثال ساده

\`\`\`tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useAPI(
  ["account", "statement"],
  {
    isInfinity: true,
    params: {
      accountNumber: "123",
      pageSize: 20,
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length : undefined;
    },
  }
);

// دسترسی به داده‌ها
const allItems = data?.pages.flatMap(page => page) ?? [];
\`\`\`

### Type Safety

\`\`\`tsx
// ✅ با isInfinity: true
const result1 = useAPI(["account", "statement"], { isInfinity: true, ... });
// result1.data: InfiniteData<IStatement[]> | undefined
// result1.data.pages: IStatement[][]
// result1.fetchNextPage: () => void ✅
// result1.hasNextPage: boolean ✅

// ✅ بدون isInfinity (یا isInfinity: false)
const result2 = useAPI(["account", "statement"], { params: {...} });
// result2.data: IStatement[] | undefined
// result2.data.pages ❌ Property 'pages' does not exist
// result2.fetchNextPage ❌ Property does not exist
\`\`\`

## ویژگی‌های پشتیبانی شده

وقتی `isInfinity: true` استفاده می‌کنید، دسترسی به موارد زیر دارید:

- `data.pages`: آرایه‌ای از صفحات (هر صفحه یک آرایه از داده‌ها)
- `data.pageParams`: آرایه‌ای از pageParam های استفاده شده
- `fetchNextPage()`: برای دریافت صفحه بعدی
- `fetchPreviousPage()`: برای دریافت صفحه قبلی
- `hasNextPage`: آیا صفحه بعدی وجود دارد
- `hasPreviousPage`: آیا صفحه قبلی وجود دارد
- `isFetchingNextPage`: در حال دریافت صفحه بعدی
- `isFetchingPreviousPage`: در حال دریافت صفحه قبلی
- `refetch()`: برای refetch کردن همه صفحات
- `invalidate()`: برای invalidate کردن query

## مثال‌های بیشتر

برای مثال‌های کامل‌تر و کاربردی‌تر، به فایل‌های زیر مراجعه کنید:

- **راهنمای کامل**: `docs/useAPI_infinite_query_guide.md`
- **مثال‌های عملی**: `src/core/examples/useAPI-infinite-example.tsx`
- **تست Type Safety**: `src/core/examples/useAPI-type-safety-test.tsx`

## نکات مهم

1. ✅ **فقط برای GET**: `isInfinity` فقط برای endpoint های GET کار می‌کند
2. ✅ **Type Safety کامل**: تایپ‌ها به صورت خودکار استنباط می‌شوند
3. ✅ **سازگار با API موجود**: تغییری در استفاده معمولی `useAPI` ایجاد نشده
4. ✅ **پشتیبانی از TanStack Query v5**: بر اساس آخرین ورژن پیاده‌سازی شده

## تست

برای تست کردن، می‌توانید از component های موجود در `examples` استفاده کنید:

\`\`\`tsx
import { InfiniteStatementExample } from "@/core/examples/useAPI-infinite-example";

function TestPage() {
  return <InfiniteStatementExample />;
}
\`\`\`
