# Runtime Environment Variables Guide

این راهنما نحوه استفاده از متغیرهای محیطی Runtime در پروژه نئون را توضیح می‌دهد.

## TL;DR — قوانین طلایی

> **هرگز از `process.env.NEXT_PUBLIC_*` مستقیماً در کد کلاینت استفاده نکنید.**
> همیشه از `getEnv("NEXT_PUBLIC_...")` یا `getServerEnv("NEXT_PUBLIC_...")` استفاده کنید.

برای اضافه کردن یک env جدید، **حتماً هر ۴ قدم** را انجام دهید:

1. به `PUBLIC_ENV_KEYS` در `src/core/config/env.ts` اضافه کنید
2. مقدار پیش‌فرض را به `DEFAULT_ENV` در همان فایل اضافه کنید
3. به `PUBLIC_ENV_KEYS` در `src/app/api/config/route.ts` اضافه کنید
4. در `.env.local` مقدار توسعه را تعریف کنید

اگر هر کدام از این مراحل جا بیفتد، متغیر در production کار نخواهد کرد.

---

## اشتباهات رایج و باگ‌های واقعی

### ❌ اشتباه: استفاده مستقیم از `process.env` در کد کلاینت

```typescript
// ❌ اشتباه — در Docker مقدار undefined خواهد بود
const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

// ❌ اشتباه — اسم متغیر اشتباه، TypeScript خطا نمی‌دهد
const domain = process.env.NEXT_PUBLIC_COOKIE_NAME; // وجود ندارد!
```

**چرا خطرناک است:**
- `process.env.NEXT_PUBLIC_*` فقط در **زمان build** جایگزین (inline) می‌شود
- در Docker، چون build با مقدار خالی انجام شده، مقدار `undefined` خواهد بود
- TypeScript هیچ خطایی برای `process.env` نمی‌دهد — حتی اگر نام متغیر اشتباه باشد

### ✅ صحیح: استفاده از `getEnv`

```typescript
// ✅ صحیح — مقدار runtime را برمی‌گرداند
import { getEnv } from "@/core/config";
const domain = getEnv("NEXT_PUBLIC_COOKIE_DOMAIN");

// ✅ TypeScript خطا می‌دهد اگر نام متغیر اشتباه باشد
const domain = getEnv("NEXT_PUBLIC_COOKIE_NAME");
//                     ^^^^^^^^^^^^^^^^^^^^^^^^ ← Type error!
```

**مزایای `getEnv`:**
- مقدار واقعی runtime را برمی‌گرداند (نه build-time)
- **Type-safe** است — اگر نام متغیر در `PUBLIC_ENV_KEYS` نباشد، TypeScript خطا می‌دهد
- هم در سرور و هم در کلاینت کار می‌کند

### ❌ اشتباه: فراموش کردن ثبت متغیر در `env.ts`

حتی اگر از `getEnv` استفاده کنید، اگر متغیر را در `PUBLIC_ENV_KEYS` اضافه نکرده باشید:
- TypeScript خطا می‌دهد (خوب!)
- ولی اگر به هر دلیلی type check را دور بزنید، مقدار خالی برمی‌گردد

### ❌ اشتباه: اضافه کردن به `env.ts` ولی نه به `route.ts`

اگر متغیر را فقط در `env.ts` اضافه کنید ولی در `route.ts` اضافه نکنید:
- در **سرور** کار می‌کند
- در **کلاینت** مقدار پیش‌فرض (معمولاً خالی) برمی‌گردد
- چون API endpoint آن متغیر را در response نمی‌فرستد

---

## مشکل اصلی

در Next.js، متغیرهای `NEXT_PUBLIC_*` در زمان build به صورت inline در کد bundle می‌شوند. این یعنی اگر Docker image بسازید، مقادیر build-time در image ثابت می‌شوند و قابل تغییر در runtime نیستند.

## نحوه کار سیستم

### معماری

این سیستم از دو لایه تشکیل شده:

1. **Server-Side**: مستقیماً از `process.env` می‌خواند (همیشه مقدار runtime را دارد)
2. **Client-Side**: از API endpoint `/api/config` مقادیر را دریافت و cache می‌کند

### جریان داده (Data Flow)

```
Docker Environment Variables
         ↓
  process.env (Server)
         ↓
  ┌──────┴──────┐
  ↓             ↓
Server      API Route
Components   /api/config
  ↓             ↓
Layout.tsx → EnvProvider
              ↓
         Client Cache
              ↓
    Client Components
```

### نکات مهم

1. **Dynamic baseURL**: در axios adapter از request interceptor استفاده می‌شود تا `baseURL` در **هر request** به صورت dynamic از runtime config خوانده شود. این تضمین می‌کند که حتی اگر Docker environment variables تغییر کنند، API calls به URL جدید ارسال شوند.

2. **SSR Hydration**: مقادیر اولیه از سرور به کلاینت منتقل می‌شوند تا از hydration mismatch جلوگیری شود.

3. **Caching**: مقادیر در client-side cache می‌شوند تا از multiple API calls جلوگیری شود.

## راه‌حل

این پروژه از یک سیستم Runtime Environment Variables استفاده می‌کند که:

1. **در سمت سرور**: مستقیماً از `process.env` می‌خواند
2. **در سمت کلاینت**: مقادیر از سرور دریافت و cache می‌شوند

## فایل‌های اصلی

```
src/
├── core/
│   └── config/
│       ├── env.ts          # توابع اصلی برای خواندن env
│       └── index.ts        # Export های عمومی
├── shared/
│   └── providers/
│       └── EnvProvider.tsx # React Context Provider
└── app/
    └── api/
        └── config/
            └── route.ts    # API endpoint برای دریافت config
```

## نحوه استفاده

### 1. در Server Components

```tsx
import { getServerEnv, getServerEnvConfig } from "@/core/config";

// خواندن یک متغیر
const apiUrl = getServerEnv("NEXT_PUBLIC_API_BASE_URL");

// خواندن همه متغیرها
const config = getServerEnvConfig();
```

### 2. در Client Components

```tsx
"use client";

import { getEnv } from "@/core/config";
import { useEnvConfig } from "@/shared/providers/EnvProvider";

function MyComponent() {
  // روش 1: استفاده از hook
  const { config, isLoading } = useEnvConfig();
  
  // روش 2: استفاده از تابع (نیاز به EnvProvider دارد)
  const apiUrl = getEnv("NEXT_PUBLIC_API_BASE_URL");
  
  return <div>API URL: {apiUrl}</div>;
}
```

### 3. در API Routes

```tsx
import { getServerEnv } from "@/core/config";

export async function GET() {
  const apiUrl = getServerEnv("NEXT_PUBLIC_API_BASE_URL");
  // ...
}
```

## متغیرهای پشتیبانی شده

| متغیر | توضیحات | مقدار پیش‌فرض |
|-------|---------|---------------|
| `NEXT_PUBLIC_API_BASE_URL` | آدرس پایه API | `""` |
| `NEXT_PUBLIC_USE_API_PROXY` | استفاده از proxy | `"false"` |
| `NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL` | آدرس Unleash | `""` |
| `NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN` | توکن Unleash | `""` |
| `NEXT_PUBLIC_UNLEASH_APP_NAME` | نام اپلیکیشن | `"neon"` |
| `NEXT_PUBLIC_UNLEASH_ENVIRONMENT` | محیط اجرا | `"development"` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | کلید Firebase | `""` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | دامنه Firebase Auth | `""` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | شناسه پروژه Firebase | `""` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | باکت Storage | `""` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | شناسه فرستنده پیام | `""` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | شناسه اپلیکیشن Firebase | `""` |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | کلید VAPID برای Push | `""` |
| `NEXT_PUBLIC_PUSH_REGISTER_URL` | آدرس ثبت Push Token | `""` |
| `NEXT_PUBLIC_MOBILE_ONLY` | فقط موبایل | `"false"` |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | دامنه کوکی‌ها (مثلاً `.neonteam.ir`) | `""` |

## اجرا با Docker

### Docker Run

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.neonteam.ir \
  -e NEXT_PUBLIC_USE_API_PROXY=false \
  -e NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL=https://unleash.neonteam.ir/api/frontend \
  -e NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN=your-token \
  -e NEXT_PUBLIC_UNLEASH_APP_NAME=neon-pwa \
  your-image-name
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: your-image-name
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://api.neonteam.ir
      - NEXT_PUBLIC_USE_API_PROXY=false
      - NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL=https://unleash.neonteam.ir/api/frontend
      - NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN=your-token
      - NEXT_PUBLIC_UNLEASH_APP_NAME=neon-pwa
      - NEXT_PUBLIC_UNLEASH_ENVIRONMENT=production
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: neon-app
spec:
  template:
    spec:
      containers:
        - name: neon
          image: your-image-name
          env:
            - name: NEXT_PUBLIC_API_BASE_URL
              valueFrom:
                configMapKeyRef:
                  name: neon-config
                  key: api-base-url
            - name: NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN
              valueFrom:
                secretKeyRef:
                  name: neon-secrets
                  key: unleash-token
```

## امنیت

### چرا این روش امن است؟

1. **متغیرهای حساس در سمت سرور می‌مانند**: متغیرهایی که با `NEXT_PUBLIC_` شروع نمی‌شوند (مثل `UNLEASH_SERVER_API_TOKEN`) هرگز به کلاینت ارسال نمی‌شوند.

2. **لیست سفید (Whitelist)**: فقط متغیرهای تعریف شده در `PUBLIC_ENV_KEYS` قابل دسترسی هستند.

3. **Server-Side Rendering**: مقادیر اولیه از سرور inject می‌شوند، نه از فایل JavaScript استاتیک.

4. **بدون Placeholder در Build**: برخلاف روش‌های دیگر که از placeholder استفاده می‌کنند، این روش مقادیر واقعی را در runtime می‌خواند.

## اضافه کردن متغیر محیطی جدید

برای اضافه کردن یک متغیر محیطی جدید، باید **سه فایل** را به‌روزرسانی کنید:

### گام 1: اضافه کردن به `env.ts`

فایل: `src/core/config/env.ts`

```typescript
// 1. متغیر جدید را به لیست کلیدها اضافه کنید
export const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_USE_API_PROXY",
  "NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL",
  "NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN",
  "NEXT_PUBLIC_UNLEASH_APP_NAME",
  "NEXT_PUBLIC_UNLEASH_ENVIRONMENT",
  "NEXT_PUBLIC_NEW_VARIABLE", // ← متغیر جدید
] as const;

// 2. مقدار پیش‌فرض را اضافه کنید
const DEFAULT_ENV: PublicEnvConfig = {
  NEXT_PUBLIC_API_BASE_URL: "",
  NEXT_PUBLIC_USE_API_PROXY: "false",
  NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL: "",
  NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN: "",
  NEXT_PUBLIC_UNLEASH_APP_NAME: "neon",
  NEXT_PUBLIC_UNLEASH_ENVIRONMENT: "development",
  NEXT_PUBLIC_NEW_VARIABLE: "default-value", // ← مقدار پیش‌فرض
};
```

**نکته مهم**: TypeScript به طور خودکار type را update می‌کند و نیازی به تغییر دستی type نیست.

### گام 2: اضافه کردن به API Route

فایل: `src/app/api/config/route.ts`

```typescript
// متغیر جدید را به لیست اضافه کنید
const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_USE_API_PROXY",
  "NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL",
  "NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN",
  "NEXT_PUBLIC_UNLEASH_APP_NAME",
  "NEXT_PUBLIC_UNLEASH_ENVIRONMENT",
  "NEXT_PUBLIC_NEW_VARIABLE", // ← متغیر جدید
] as const;
```

### گام 3: اضافه کردن به `.env.local`

فایل: `.env.local`

```bash
# متغیر جدید را با مقدار دلخواه اضافه کنید
NEXT_PUBLIC_NEW_VARIABLE=my-value
```

### گام 4: استفاده از متغیر جدید

حالا می‌توانید از متغیر جدید استفاده کنید:

```typescript
import { getEnv, getServerEnv } from "@/core/config";

// در Client Component
const myValue = getEnv("NEXT_PUBLIC_NEW_VARIABLE");

// در Server Component
const myValue = getServerEnv("NEXT_PUBLIC_NEW_VARIABLE");
```

### مثال کامل

فرض کنید می‌خواهید متغیر `NEXT_PUBLIC_ANALYTICS_ID` برای Google Analytics اضافه کنید:

**1. فایل `src/core/config/env.ts`:**
```typescript
export const PUBLIC_ENV_KEYS = [
  // ... existing keys
  "NEXT_PUBLIC_ANALYTICS_ID", // ← جدید
] as const;

const DEFAULT_ENV: PublicEnvConfig = {
  // ... existing defaults
  NEXT_PUBLIC_ANALYTICS_ID: "", // ← جدید
};
```

**2. فایل `src/app/api/config/route.ts`:**
```typescript
const PUBLIC_ENV_KEYS = [
  // ... existing keys
  "NEXT_PUBLIC_ANALYTICS_ID", // ← جدید
] as const;
```

**3. فایل `.env.local`:**
```bash
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
```

**4. استفاده در کد:**
```typescript
"use client";

import { getEnv } from "@/core/config";
import { useEffect } from "react";

export function Analytics() {
  const analyticsId = getEnv("NEXT_PUBLIC_ANALYTICS_ID");
  
  useEffect(() => {
    if (analyticsId) {
      // Initialize Google Analytics
      console.log("Analytics ID:", analyticsId);
    }
  }, [analyticsId]);
  
  return null;
}
```

**5. اجرا با Docker:**
```bash
docker run -e NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX your-image
```

### چک‌لیست

قبل از commit، این موارد را بررسی کنید:

- [ ] متغیر به `PUBLIC_ENV_KEYS` در `env.ts` اضافه شده
- [ ] مقدار پیش‌فرض به `DEFAULT_ENV` در `env.ts` اضافه شده
- [ ] متغیر به `PUBLIC_ENV_KEYS` در `route.ts` اضافه شده
- [ ] متغیر در `.env.local` برای توسعه تعریف شده
- [ ] در کد فقط از `getEnv()` یا `getServerEnv()` استفاده شده (**نه** `process.env`)
- [ ] TypeScript errors وجود ندارد (`npm run build`)
- [ ] متغیر در `docker-compose.yml` (و `docker-compose-test.yml` در صورت نیاز) اضافه شده
- [ ] جدول «متغیرهای پشتیبانی شده» در این داکیومنت به‌روز شده

## عیب‌یابی

### مقادیر در کلاینت به‌روز نمی‌شوند

1. مطمئن شوید `EnvProvider` در layout.tsx وجود دارد
2. مطمئن شوید `initialConfig` از سرور پاس داده می‌شود
3. Cache مرورگر را پاک کنید
4. Hard refresh کنید (Ctrl+Shift+R یا Cmd+Shift+R)

### API calls به URL قدیمی ارسال می‌شوند

اگر پس از تغییر `NEXT_PUBLIC_API_BASE_URL` در Docker، API calls همچنان به URL قدیمی می‌روند:

**علت**: Docker image قدیمی است که با مقادیر build-time ساخته شده

**راه‌حل**:
```bash
# 1. Build جدید بسازید
npm run build

# 2. Docker image جدید بسازید
docker build -t your-image-name .

# 3. با environment variables جدید اجرا کنید
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.neonteam.ir \
  your-image-name

# 4. در مرورگر console را باز کنید و بررسی کنید:
# Network tab → یک API call بزنید → Request URL را چک کنید
```

**تست کردن**:
```javascript
// در Console مرورگر این را اجرا کنید:
fetch('/api/config')
  .then(r => r.json())
  .then(console.log);

// خروجی باید مقادیر جدید را نشان دهد
```

### خطای Hydration Mismatch

این خطا زمانی رخ می‌دهد که مقدار سرور با کلاینت متفاوت باشد. مطمئن شوید:
- `initialConfig` به درستی از سرور پاس داده می‌شود
- از `getEnv` به جای `process.env` استفاده می‌کنید

### API /api/config کار نمی‌کند

1. فایل [route.ts](../src/app/api/config/route.ts) را بررسی کنید
2. مطمئن شوید Next.js به درستی اجرا شده
3. لاگ‌های سرور را بررسی کنید
4. به صورت دستی endpoint را تست کنید: `curl http://localhost:3000/api/config`

### متغیرها در Docker undefined هستند

```bash
# بررسی کنید environment variables به درستی set شده‌اند:
docker exec <container-id> env | grep NEXT_PUBLIC

# یا در زمان اجرا لاگ کنید:
docker run -e NEXT_PUBLIC_API_BASE_URL=https://api.neonteam.ir \
  your-image sh -c 'echo $NEXT_PUBLIC_API_BASE_URL && node server.js'
```
