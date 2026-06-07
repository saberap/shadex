# راهنمای رفع خطای SSR در Zustand

## مشکل

در Next.js 13+ با App Router، ممکن است این خطا را مشاهده کنید:

```
The result of getServerSnapshot should be cached to avoid an infinite loop
```

## راه‌حل

برای رفع این مشکل، دو تغییر انجام شد:

### 1. اضافه کردن `skipHydration` به store

در `store.ts`، گزینه `skipHydration: true` به persist middleware اضافه شد:

```typescript
persist(
  (...args) => ({
    ...createAuthSlice(...args),
    ...createUserSlice(...args),
    ...createCustomerInfoSlice(...args),
  }),
  {
    name: "neon-store",
    storage: createStorage("local"),
    partialize: (state) => ({
      // ... state fields
    }),
    skipHydration: true, // ✅ این خط اضافه شد
  },
),
```

### 2. اضافه کردن StoreProvider

یک `StoreProvider` ایجاد شد که store را در client-side hydrate می‌کند:

```tsx
// src/core/store/StoreProvider.tsx
"use client";

import { useEffect, type ReactNode } from "react";
import { useStore } from "./store";

export function StoreProvider({ children }: StoreProviderProps) {
  useEffect(() => {
    // Hydrate store from localStorage on client-side
    useStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
```

## نحوه استفاده

### در Root Layout

فایل `app/layout.tsx` را ویرایش کنید و `StoreProvider` را اضافه کنید:

```tsx
import { StoreProvider } from "@/core/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <StoreProvider>
          {/* سایر Provider ها */}
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
```

### مثال کامل

```tsx
// app/layout.tsx
import { StoreProvider } from "@/core/store";
import { QueryClientProvider } from "@/shared/providers/QueryClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-iranyekan">
        <StoreProvider>
          <QueryClientProvider>
            {children}
          </QueryClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
```

## چرا این کار لازم است؟

### مشکل اصلی

Next.js 13+ از Server Components استفاده می‌کند. وقتی Zustand با persist middleware در server render می‌شود، نمی‌تواند به `localStorage` دسترسی داشته باشد (چون localStorage فقط در browser وجود دارد).

### راه‌حل

1. **skipHydration: true**: به Zustand می‌گوید که در server-side از localStorage استفاده نکند
2. **StoreProvider**: در client-side (بعد از mount شدن)، store را از localStorage بارگذاری می‌کند

## تفاوت با قبل

### ❌ قبل (با خطا)

```typescript
// store فقط در client hydrate می‌شد
persist(
  (set) => ({...}),
  {
    name: "neon-store",
    storage: createStorage("local"),
  }
)
```

### ✅ بعد (بدون خطا)

```typescript
// با skipHydration
persist(
  (set) => ({...}),
  {
    name: "neon-store",
    storage: createStorage("local"),
    skipHydration: true,
  }
)

// + استفاده از StoreProvider در layout
```

## بررسی عملکرد

برای اطمینان از عملکرد صحیح:

1. Store را در یک کامپوننت استفاده کنید
2. مقداری را set کنید
3. صفحه را refresh کنید
4. مقدار باید حفظ شود (از localStorage بارگذاری شود)

### مثال تست

```tsx
"use client";

import { useAuth } from "@/core/store";

export function TestComponent() {
  const { setUser, user } = useAuth();

  return (
    <div>
      <p>User: {user.data?.username || "None"}</p>
      <button
        onClick={() =>
          setUser({ id: "1", username: "test" })
        }
      >
        Set User
      </button>
    </div>
  );
}
```

## نکات مهم

1. ✅ `StoreProvider` باید در root layout قرار گیرد
2. ✅ `StoreProvider` باید `"use client"` داشته باشد
3. ✅ `skipHydration: true` در تمام persist middleware ها ضروری است
4. ✅ بعد از اضافه کردن، صفحه را refresh کنید
5. ✅ در production build هم تست کنید

## منابع

- [Zustand SSR Guide](https://docs.pmnd.rs/zustand/integrations/persisting-store-data#usage-in-next.js)
- [Next.js 13+ App Router](https://nextjs.org/docs/app)
- [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot)

---

**✨ خطای SSR با موفقیت رفع شد!**
