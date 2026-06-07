# راهنمای استفاده از Zustand در پروژه Neon

## فهرست مطالب

1. [معرفی](#معرفی)
2. [ساختار Store](#ساختار-store)
3. [نحوه استفاده](#نحوه-استفاده)
4. [Best Practices](#best-practices)
5. [مثال‌های کاربردی](#مثالهای-کاربردی)
6. [Middleware ها](#middleware-ها)
7. [TypeScript Types](#typescript-types)

---

## معرفی

Zustand یک کتابخانه سبک و قدرتمند برای مدیریت state در React است. در این پروژه از Zustand به صورت حرفه‌ای و با رعایت Best Practices استفاده شده است.

### ویژگی‌های پیاده‌سازی:

- ✅ **Slice Pattern**: تفکیک state به بخش‌های منطقی
- ✅ **TypeScript**: Type Safety کامل
- ✅ **Persist**: ذخیره‌سازی خودکار در localStorage
- ✅ **Devtools**: یکپارچگی با Redux DevTools
- ✅ **Selectors**: دسترسی بهینه به state
- ✅ **Middleware**: Logger و دیگر middleware ها
- ✅ **Performance**: بهینه‌سازی re-render ها

---

## ساختار Store

```
src/core/store/
├── index.ts                    # Export های مرکزی
├── types.ts                    # Type های مشترک
├── store.ts                    # Store اصلی
├── slices/                     # Slice های مختلف
│   ├── auth-slice.ts          # مدیریت احراز هویت
│   └── user-slice.ts          # مدیریت اطلاعات کاربر
├── utils/                      # ابزارهای کمکی
│   ├── create-store.ts        # Helper برای ساخت store
│   ├── persist-config.ts      # کانفیگ persist
│   └── devtools-config.ts     # کانفیگ devtools
└── middleware/                 # Middleware های سفارشی
    └── logger.ts              # Logger middleware
```

---

## نحوه استفاده

### 1. استفاده از Store اصلی

```tsx
"use client";
import { useStore } from "@/core/store";

export default function MyComponent() {
  // دسترسی به کل state (توصیه نمی‌شود)
  const state = useStore();

  return <div>User: {state.user.data?.username}</div>;
}
```

### 2. استفاده با Selector (توصیه می‌شود)

```tsx
"use client";
import { useStore } from "@/core/store";

export default function MyComponent() {
  // فقط بخش مورد نیاز را subscribe می‌کنیم
  const username = useStore((state) => state.user.data?.username);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return (
    <div>
      {isAuthenticated ? `خوش آمدید ${username}` : "لطفا وارد شوید"}
    </div>
  );
}
```

### 3. استفاده از Custom Hooks

```tsx
"use client";
import { useAuth, useUserProfile } from "@/core/store";

export default function ProfilePage() {
  // استفاده از selector های از پیش ساخته شده
  const { user, isAuthenticated, logout } = useAuth();
  const { profile, updateProfile } = useUserProfile();

  const handleLogout = () => {
    logout();
  };

  const handleUpdateProfile = () => {
    updateProfile({
      firstName: "علی",
      lastName: "احمدی",
    });
  };

  return (
    <div>
      <h1>پروفایل کاربر</h1>
      <p>نام: {profile?.firstName}</p>
      <p>نام خانوادگی: {profile?.lastName}</p>
      <button onClick={handleUpdateProfile}>ویرایش پروفایل</button>
      <button onClick={handleLogout}>خروج</button>
    </div>
  );
}
```

### 4. دسترسی به State خارج از Component

```tsx
import { useStore } from "@/core/store";

// در هر جایی از کد (حتی خارج از component)
export function checkAuth() {
  const isAuthenticated = useStore.getState().isAuthenticated;
  return isAuthenticated;
}

// یا برای dispatch کردن action
export function logoutUser() {
  useStore.getState().logout();
}
```

---

## Best Practices

### 1. همیشه از Selector استفاده کنید

❌ **اشتباه:**
```tsx
const state = useStore(); // کل state را subscribe می‌کند
```

✅ **درست:**
```tsx
const username = useStore((state) => state.user.data?.username);
```

### 2. از Custom Hooks استفاده کنید

✅ **توصیه می‌شود:**
```tsx
const { user, logout } = useAuth(); // خواناتر و قابل استفاده مجدد
```

### 3. State را Normalize کنید

✅ **درست:**
```tsx
interface AuthState {
  user: AsyncState<User>; // شامل data, status, error
  isAuthenticated: boolean;
}
```

### 4. از Slice Pattern استفاده کنید

برای افزودن یک slice جدید:

```typescript
// src/core/store/slices/cart-slice.ts
import type { StateCreator } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<CartState> = (set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ items: [] }),
});
```

سپس در `store.ts`:

```typescript
import { createCartSlice, type CartState } from "./slices/cart-slice";

export type StoreState = AuthState & UserState & CartState;

export const useStore = create<StoreState>()(
  // ... middleware ...
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createUserSlice(...args),
      ...createCartSlice(...args), // اضافه کردن slice جدید
    }),
    // ...
  ),
);

// selector جدید
export const useCart = () =>
  useStore((state) => ({
    items: state.items,
    addItem: state.addItem,
    removeItem: state.removeItem,
    clearCart: state.clearCart,
  }));
```

### 5. از TypeScript به طور کامل استفاده کنید

```typescript
// تعریف دقیق type ها
interface User {
  id: string;
  username: string;
  email?: string;
}

// استفاده از type-safe selectors
const user = useStore((state): User | null => state.user.data);
```

---

## مثال‌های کاربردی

### مثال 1: صفحه Login

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/core/store";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens, setAuthLoading, setAuthError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      setAuthLoading();

      // فراخوانی API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // ذخیره در store
      setTokens(data.token, data.refreshToken);
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
      });

      router.push("/dashboard");
    } catch (error) {
      setAuthError("خطا در ورود");
    }
  };

  return (
    <div>
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="نام کاربری"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="رمز عبور"
      />
      <Button onClick={handleLogin}>ورود</Button>
    </div>
  );
}
```

### مثال 2: Protected Route

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/core/store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>در حال بارگذاری...</div>;
  }

  return <>{children}</>;
}
```

### مثال 3: Profile Update

```tsx
"use client";
import { useUserProfile } from "@/core/store";
import { FormBuilder } from "@/shared/components/form-builder";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(2, "حداقل 2 کاراکتر"),
  lastName: z.string().min(2, "حداقل 2 کاراکتر"),
  nationalId: z.string().length(10, "کد ملی باید 10 رقم باشد"),
});

export default function ProfileForm() {
  const { profile, updateProfile, checkProfileComplete } = useUserProfile();

  const handleSubmit = (data: z.infer<typeof profileSchema>) => {
    updateProfile(data);
    checkProfileComplete();
  };

  return (
    <FormBuilder
      schema={profileSchema}
      fields={[
        { name: "firstName", label: "نام", type: "text" },
        { name: "lastName", label: "نام خانوادگی", type: "text" },
        { name: "nationalId", label: "کد ملی", type: "text" },
      ]}
      onSubmit={handleSubmit}
      defaultValues={profile || undefined}
    />
  );
}
```

### مثال 4: Middleware سفارشی

```typescript
// src/core/store/middleware/analytics.ts
import type { StateCreator, StoreMutatorIdentifier } from "zustand";

type Analytics = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
) => StateCreator<T, Mps, Mcs>;

type AnalyticsImpl = <T>(
  f: StateCreator<T, [], []>,
) => StateCreator<T, [], []>;

const analyticsImpl: AnalyticsImpl = (f) => (set, get, store) => {
  const analyticsSet: typeof set = (...args) => {
    // ارسال event به Google Analytics یا سرویس دیگر
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "store_update", {
        state: JSON.stringify(get()),
      });
    }

    set(...args);
  };

  store.setState = analyticsSet;
  return f(analyticsSet, get, store);
};

export const analytics = analyticsImpl as Analytics;
```

---

## Middleware ها

### Logger Middleware

فقط در development فعال است و تغییرات state را log می‌کند:

```typescript
import { logger } from "@/core/store/middleware/logger";

const store = create(
  logger(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    "Counter Store",
  ),
);
```

### Persist Middleware

برای ذخیره‌سازی خودکار state:

```typescript
import { persist } from "zustand/middleware";
import { createStorage } from "@/core/store/utils/persist-config";

const store = create(
  persist(
    (set) => ({
      // state...
    }),
    {
      name: "my-store",
      storage: createStorage("local"), // یا "session"
      partialize: (state) => ({
        // فقط این فیلدها persist می‌شوند
        token: state.token,
      }),
    },
  ),
);
```

### Devtools Middleware

برای یکپارچگی با Redux DevTools:

```typescript
import { devtools } from "zustand/middleware";

const store = create(
  devtools(
    (set) => ({
      // state...
    }),
    {
      name: "My Store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
```

---

## TypeScript Types

### AsyncState Type

برای مدیریت state های async:

```typescript
import { type AsyncState, createAsyncState } from "@/core/store/types";

interface MyState {
  data: AsyncState<User>;
}

const initialState = {
  data: createAsyncState<User>(),
};

// استفاده
const setLoading = () =>
  set({
    data: { data: null, status: "loading", error: null },
  });

const setSuccess = (user: User) =>
  set({
    data: { data: user, status: "success", error: null },
  });

const setError = (error: string) =>
  set({
    data: { data: null, status: "error", error },
  });
```

### Extract State Type

برای استخراج type از store:

```typescript
import type { ExtractState } from "@/core/store";

const myStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

type MyStoreState = ExtractState<typeof myStore>;
// { count: number; increment: () => void; }
```

---

## نکات مهم

### 1. Performance

- همیشه از selector استفاده کنید تا فقط بخش مورد نیاز re-render شود
- از `shallow` برای مقایسه سطحی استفاده کنید:

```tsx
import { shallow } from "zustand/shallow";

const { user, profile } = useStore(
  (state) => ({ user: state.user, profile: state.profile }),
  shallow,
);
```

### 2. Testing

```typescript
import { renderHook, act } from "@testing-library/react";
import { useStore } from "@/core/store";

describe("Auth Store", () => {
  it("should set user", () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.setUser({
        id: "1",
        username: "test",
      });
    });

    expect(result.current.user.data?.username).toBe("test");
  });
});
```

### 3. Reset Store

```typescript
import { resetStore } from "@/core/store";

// برای خروج کاربر و پاک کردن کل state
const handleLogout = () => {
  resetStore();
  router.push("/auth/login");
};
```

---

## منابع

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)
- [Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [Testing](https://docs.pmnd.rs/zustand/guides/testing)

---

**نکته:** این راهنما بر اساس Best Practices و الگوهای معمول در پروژه‌های بزرگ تهیه شده است. در صورت نیاز به قابلیت‌های بیشتر، می‌توانید slice های جدید اضافه کنید یا middleware های سفارشی بنویسید.
