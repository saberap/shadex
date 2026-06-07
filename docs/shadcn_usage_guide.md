# راهنمای استفاده از shadcn/ui

## 🎯 هدف
shadcn/ui یک مجموعه کامپوننت‌های قابل کپی و تنظیم است که به راحتی می‌توان آن‌ها را در پروژه‌های React و Next.js استفاده کرد. این کامپوننت‌ها بر اساس Radix UI ساخته شده‌اند و با Tailwind CSS استایل‌بندی شده‌اند.

---

## ⚙️ پیکربندی انجام شده

### 1. فایل‌های کانفیگ ایجاد شده:
- `components.json`: پیکربندی اصلی shadcn/ui
- `tailwind.config.ts`: پیکربندی Tailwind CSS با تم‌های shadcn/ui
- CSS Variables در `src/styles/globals.css`
- تابع `cn` در `src/core/utils/cn.ts`

### 2. وابستگی‌های نصب شده:
```bash
npm install tailwindcss-animate class-variance-authority lucide-react @radix-ui/react-slot
```

### 3. ساختار دایرکتری:
```
src/
  shared/
    components/
      ui/           # کامپوننت‌های shadcn/ui
  core/
    utils/
      cn.ts         # تابع ترکیب کلاس‌ها
```

---

## 🚀 استفاده

### اضافه کردن کامپوننت جدید:
```bash
# روش خودکار (نیاز به اتصال اینترنت)
npx shadcn add [component-name]

# مثال:
npx shadcn add button
npx shadcn add card
npx shadcn add input
```

### استفاده در کامپوننت‌ها:
```tsx
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>عنوان کارت</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">کلیک کنید</Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🎨 تنظیمات تم

### متغیرهای CSS:
متغیرهای رنگی در `src/styles/globals.css` تعریف شده‌اند و قابل تنظیم هستند:

```css
:root {
  --primary: 0 0% 9%;
  --secondary: 0 0% 96.1%;
  --accent: 0 0% 96.1%;
  /* سایر متغیرها... */
}
```

### حالت تیره (Dark Mode):
```css
.dark {
  --primary: 0 0% 98%;
  --secondary: 0 0% 14.9%;
  /* سایر متغیرها... */
}
```

---

## 📋 کامپوننت‌های موجود

فعلاً کامپوننت‌های زیر در پروژه موجود هستند:

### Button
```tsx
import { Button } from "@/shared/components/ui/button";

<Button variant="default">پیش‌فرض</Button>
<Button variant="secondary">ثانویه</Button>
<Button variant="outline">خطی</Button>
<Button variant="destructive">مخرب</Button>
<Button variant="ghost">شبح</Button>
<Button variant="link">لینک</Button>

<Button size="sm">کوچک</Button>
<Button size="default">عادی</Button>
<Button size="lg">بزرگ</Button>
<Button size="icon">آیکون</Button>
```

---

## 🔧 تنظیمات سفارشی

### اضافه کردن کامپوننت دستی:
اگر اتصال اینترنت نداشته باشید، می‌توانید کامپوننت‌ها را به صورت دستی از [ui.shadcn.com](https://ui.shadcn.com) کپی کنید.

### تغییر مسیرها:
مسیرهای کامپوننت‌ها در `components.json` تعریف شده‌اند:

```json
{
  "aliases": {
    "components": "@/shared/components/ui",
    "utils": "@/core/utils",
    "ui": "@/shared/components/ui",
    "lib": "@/core/utils",
    "hooks": "@/core/hooks"
  }
}
```

---

## 📚 منابع مفید

- [مستندات shadcn/ui](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Class Variance Authority](https://cva.style)

---

## 🐛 عیب‌یابی

### مشکلات رایج:

1. **خطای Import**: مطمئن شوید مسیر `@/shared/components/ui` در `tsconfig.json` تعریف شده است.

2. **استایل‌ها اعمال نمی‌شوند**: بررسی کنید که متغیرهای CSS در `globals.css` درست تعریف شده باشند.

3. **کامپوننت کار نمی‌کند**: وابستگی‌های مورد نیاز (`@radix-ui/*`) را نصب کنید.

---

## 🔄 به‌روزرسانی

برای به‌روزرسانی shadcn/ui:

```bash
# CLI را به‌روزرسانی کنید
npm update shadcn

# کامپوننت‌های موجود را به‌روزرسانی کنید
npx shadcn@latest diff
```