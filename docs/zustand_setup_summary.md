# خلاصه پیاده‌سازی Zustand

## ✅ چه کارهایی انجام شد؟

### 1. ساختار Store (Best Practice)

```
src/core/store/
├── index.ts                 # Export های مرکزی
├── store.ts                 # Store اصلی با ترکیب slices
├── types.ts                 # Type های مشترک (AsyncState, etc.)
│
├── slices/                  # Slice Pattern
│   ├── auth-slice.ts       # مدیریت احراز هویت
│   └── user-slice.ts       # مدیریت پروفایل کاربر
│
├── utils/                   # ابزارهای کمکی
│   ├── create-store.ts     # Helper برای ساخت store
│   ├── persist-config.ts   # کانفیگ persistence
│   └── devtools-config.ts  # کانفیگ devtools
│
├── middleware/              # Middleware های سفارشی
│   └── logger.ts           # Logger (فقط در dev)
│
└── examples/                # مثال‌های آماده
    ├── LoginFormExample.tsx
    ├── ProfileFormExample.tsx
    ├── ProtectedRoute.tsx
    ├── UserInfoDisplay.tsx
    ├── TestStorePage.tsx
    └── cart-slice-example.ts
```

### 2. ویژگی‌های پیاده‌سازی شده

✅ **Slice Pattern**: تفکیک منطقی state به بخش‌های مختلف  
✅ **TypeScript**: Type Safety کامل در همه جا  
✅ **Persistence**: ذخیره خودکار در localStorage  
✅ **DevTools**: یکپارچگی با Redux DevTools (فقط dev)  
✅ **Logger**: لاگ تغییرات state (فقط dev)  
✅ **Selectors**: Custom hooks برای دسترسی بهینه  
✅ **AsyncState**: مدیریت state های async (loading, error, success)  
✅ **Performance**: بهینه‌سازی re-render ها  

### 3. Middleware ها

- **persist**: ذخیره‌سازی خودکار در localStorage
- **devtools**: یکپارچگی با Redux DevTools
- **logger**: لاگ تغییرات (فقط در development)

### 4. Slices موجود

#### Auth Slice
- مدیریت کاربر (user, token, refreshToken)
- Actions: setUser, setTokens, logout, setAuthLoading, setAuthError
- AsyncState برای مدیریت وضعیت loading/error

#### User Slice  
- مدیریت پروفایل کاربر
- Actions: setProfile, updateProfile, clearProfile, checkProfileComplete
- چک کردن تکمیل بودن پروفایل

## 🚀 نحوه استفاده

### Import

```tsx
import { useAuth, useUserProfile, resetStore } from "@/core/store";
```

### در کامپوننت

```tsx
export default function MyComponent() {
  const { user, isAuthenticated, setUser, logout } = useAuth();
  const { profile, updateProfile } = useUserProfile();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>خوش آمدید {user.data?.username}</p>
          <button onClick={logout}>خروج</button>
        </div>
      ) : (
        <button onClick={() => setUser({ id: "1", username: "test" })}>
          ورود
        </button>
      )}
    </div>
  );
}
```

### Selector برای بهینه‌سازی

```tsx
// ❌ بد: کل state را subscribe می‌کند
const state = useStore();

// ✅ خوب: فقط بخش مورد نیاز
const username = useStore((state) => state.user.data?.username);

// ✅ بهترین: استفاده از custom hook
const { user } = useAuth();
```

## 📚 مستندات

### مستندات کامل
📄 `docs/zustand_usage_guide.md` - راهنمای جامع با مثال‌های کامل

### README های کوتاه
📄 `src/core/store/README.md` - خلاصه و راهنمای سریع

### مثال‌های عملی
📁 `src/core/store/examples/` - مثال‌های آماده برای استفاده

## 🎯 افزودن Slice جدید

### 1. ایجاد فایل Slice

```typescript
// src/core/store/slices/cart-slice.ts
import type { StateCreator } from "zustand";

export interface CartState {
  items: Array<{ id: string; name: string; price: number }>;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
}

export const createCartSlice: StateCreator<CartState> = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
});
```

### 2. اضافه کردن به Store اصلی

```typescript
// src/core/store/store.ts
import { createCartSlice, type CartState } from "./slices/cart-slice";

export type StoreState = AuthState & UserState & CartState;

export const useStore = create<StoreState>()(
  // ... middleware
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createUserSlice(...args),
      ...createCartSlice(...args), // ⬅️ اضافه کردن
    }),
    {
      name: "neon-store",
      storage: createStorage("local"),
      partialize: (state) => ({
        // ... state های قبلی
        items: state.items, // ⬅️ اضافه کردن
      }),
    },
  ),
);

// Custom hook
export const useCart = () =>
  useStore((state) => ({
    items: state.items,
    addItem: state.addItem,
    removeItem: state.removeItem,
  }));
```

### 3. استفاده

```tsx
import { useCart } from "@/core/store";

export default function CartPage() {
  const { items, addItem, removeItem } = useCart();

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => removeItem(item.id)}>حذف</button>
        </div>
      ))}
    </div>
  );
}
```

## 🧪 تست کردن

برای تست کردن store:

1. فایل `src/core/store/examples/TestStorePage.tsx` را در `src/app/test-store/page.tsx` کپی کنید
2. به `http://localhost:3000/test-store` بروید
3. تمام قابلیت‌های store را تست کنید

## 🔧 کانفیگ‌ها

### Persistence
- **Storage**: localStorage (قابل تغییر به sessionStorage)
- **Key**: "neon-store"
- **Partialize**: فقط state های مهم persist می‌شوند

### DevTools
- **فعال**: فقط در development
- **نام**: "Neon Store"

### Logger
- **فعال**: فقط در development
- **رنگی**: Previous State (قرمز), Next State (سبز)

## 🎨 Best Practices پیاده‌سازی شده

1. ✅ **Slice Pattern** برای تفکیک منطقی
2. ✅ **TypeScript** برای Type Safety
3. ✅ **Custom Hooks** برای دسترسی آسان
4. ✅ **Selectors** برای بهینه‌سازی performance
5. ✅ **AsyncState** برای مدیریت state های async
6. ✅ **Middleware** ها فقط در development
7. ✅ **Persistence** انتخابی
8. ✅ **Documentation** کامل

## 📝 نکات مهم

- همه چیز Type-Safe است
- Performance بهینه با استفاده از selectors
- DevTools فقط در development فعال است
- State ها به صورت خودکار persist می‌شوند
- می‌توانید slice های جدید به راحتی اضافه کنید
- مثال‌های آماده برای شروع سریع موجود است

## 🔗 لینک‌های مفید

- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)
- [Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)

---

**✨ Zustand با بهترین شیوه‌ها (Best Practices) در پروژه Neon پیاده‌سازی شد!**
