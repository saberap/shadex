# راهنمای استفاده از useAPI Hook

## مقدمه

`useAPI` یک custom hook است که برای مدیریت درخواست‌های API در پروژه استفاده می‌شود. این hook به صورت خودکار از React Query استفاده می‌کند و type-safety کامل را برای تمام endpoint‌ها فراهم می‌کند.

## ویژگی‌های اصلی

- ✅ Type-safe API calls با TypeScript
- ✅ پشتیبانی از GET، POST، PUT و DELETE
- ✅ مدیریت خودکار cache با React Query
- ✅ تبدیل خودکار به FormData برای آپلود فایل
- ✅ Invalidation خودکار cache پس از mutation
- ✅ پشتیبانی از path parameters و query parameters

## نحوه استفاده پایه

### درخواست GET

```typescript
import { useAPI } from "@/core/hooks/useAPI";

function MyComponent() {
  const { data, isLoading, error } = useAPI(["users", "getUsers"]);

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

### درخواست POST/PUT/DELETE

```typescript
import { useAPI } from "@/core/hooks/useAPI";

function MyComponent() {
  const { mutate, mutateAsync, isLoading } = useAPI(["users", "createUser"]);

  const handleSubmit = async (userData) => {
    try {
      const result = await mutateAsync(userData);
      console.log("کاربر ایجاد شد:", result);
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  return (
    <button onClick={() => handleSubmit({ name: "علی" })}>
      ایجاد کاربر
    </button>
  );
}
```

## استفاده از FormData (آپلود فایل)

برای ارسال داده به صورت `multipart/form-data` (مثلاً برای آپلود فایل)، از گزینه `isFormData` استفاده کنید:

```typescript
import { useAPI } from "@/core/hooks/useAPI";

function UploadComponent() {
  const { mutateAsync } = useAPI(["upload", "uploadFile"], {
    isFormData: true, // ✅ تبدیل خودکار به FormData
  });

  const handleUpload = async (file: File) => {
    const data = {
      file: file,
      description: "توضیحات فایل",
      userId: 123,
    };

    // خودکار به FormData تبدیل می‌شود
    await mutateAsync(data);
  };

  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />;
}
```

### نکات مهم درباره isFormData:

1. **تبدیل خودکار**: هنگام استفاده از `isFormData: true`، تمام داده‌ها به صورت خودکار با استفاده از تابع `jsonToFormData` تبدیل می‌شوند.

2. **Header خودکار**: `Content-Type: multipart/form-data` به صورت خودکار به headers اضافه می‌شود.

3. **پشتیبانی از File**: فایل‌ها به صورت خودکار تشخیص داده شده و به درستی به FormData اضافه می‌شوند.

4. **پشتیبانی از Nested Objects**: آبجکت‌های تو در تو به صورت خودکار به فرمت صحیح FormData تبدیل می‌شوند.

```typescript
// مثال با داده‌های پیچیده
const { mutateAsync } = useAPI(["onboarding", "sendOTP"], {
  isFormData: true,
});

await mutateAsync({
  nationalCode: "1234567890",
  mobileNo: "09123456789",
  documents: [file1, file2], // آرایه از فایل‌ها
  metadata: {
    age: 25,
    city: "Tehran",
  },
});
```

## استفاده از URL-encoded Form (x-www-form-urlencoded)

برای ارسال داده به صورت `application/x-www-form-urlencoded` (فرمت استاندارد فرم‌های HTML)، از گزینه `isUrlEncoded` استفاده کنید:

```typescript
import { useAPI } from "@/core/hooks/useAPI";

function LoginComponent() {
  const { mutateAsync } = useAPI(["auth", "login"], {
    isUrlEncoded: true, // ✅ تبدیل خودکار به URL-encoded
  });

  const handleLogin = async (username: string, password: string) => {
    const data = {
      username: username,
      password: password,
      grant_type: "password",
    };

    // خودکار به URLSearchParams تبدیل می‌شود
    // Body: username=john&password=123&grant_type=password
    await mutateAsync(data);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin("john", "123");
    }}>
      <input name="username" />
      <input name="password" type="password" />
      <button type="submit">ورود</button>
    </form>
  );
}
```

### نکات مهم درباره isUrlEncoded:

1. **تبدیل خودکار**: هنگام استفاده از `isUrlEncoded: true`، داده‌ها به صورت خودکار به `URLSearchParams` تبدیل می‌شوند.

2. **Header خودکار**: `Content-Type: application/x-www-form-urlencoded` به صورت خودکار به headers اضافه می‌شود.

3. **مناسب برای فرم‌های ساده**: این فرمت برای داده‌های ساده (string, number, boolean) مناسب است و از فایل پشتیبانی نمی‌کند.

4. **استفاده رایج**: بسیاری از API‌های OAuth و سیستم‌های احراز هویت از این فرمت استفاده می‌کنند.

```typescript
// مثال با OAuth
const { mutateAsync } = useAPI(["auth", "token"], {
  isUrlEncoded: true,
});

await mutateAsync({
  grant_type: "password",
  username: "user@example.com",
  password: "secret123",
  client_id: "my-app",
  client_secret: "app-secret",
});

// Body ارسالی:
// grant_type=password&username=user@example.com&password=secret123&client_id=my-app&client_secret=app-secret
```

### تفاوت isFormData و isUrlEncoded:

| ویژگی | `isFormData` | `isUrlEncoded` |
|-------|-------------|----------------|
| Content-Type | `multipart/form-data` | `application/x-www-form-urlencoded` |
| پشتیبانی از فایل | ✅ بله | ❌ خیر |
| آبجکت‌های تودرتو | ✅ بله | ❌ خیر (فقط flat objects) |
| استفاده رایج | آپلود فایل | فرم‌های ساده، OAuth |
| حجم داده | بزرگ‌تر | کوچک‌تر |

## استفاده از Path Parameters

```typescript
const { data } = useAPI(["users", "getUserById"], {
  pathParams: { id: "123" }, // /api/users/123
});
```

### Optional Path Parameters

اگر یک path parameter در تعریف API به صورت optional تعریف شده باشد، می‌توانید آن را ارسال نکنید و به صورت خودکار از URL حذف می‌شود:

```typescript
// تعریف API با nationalCode اختیاری
creditRisk: {
  method: "POST",
  url: "/loan/plans/credit-risk/:partyRole/:nationalCode",
  pathParams: Params<{
    partyRole: TPartyRole;
    nationalCode?: string; // ✅ optional parameter
  }>(),
}

// استفاده با هر دو parameter
const { mutateAsync } = useAPI(["loan", "creditRisk"], {
  pathParams: {
    partyRole: "APPLICANT",
    nationalCode: "1234567890",
  },
});
// نتیجه: /loan/plans/credit-risk/APPLICANT/1234567890

// استفاده بدون nationalCode
const { mutateAsync } = useAPI(["loan", "creditRisk"], {
  pathParams: {
    partyRole: "APPLICANT",
  },
});
// نتیجه: /loan/plans/credit-risk/APPLICANT ✅
// (nationalCode از URL حذف شده)
```

**نکات مهم:**
- پارامترهایی که مقدارشان `undefined`، `null` یا `''` (رشته خالی) باشد، از URL حذف می‌شوند
- این قابلیت برای APIهایی مفید است که برخی path parameters اختیاری دارند
- ترتیب parameters در URL به صورت خودکار حفظ می‌شود

## استفاده از Query Parameters

```typescript
const { data } = useAPI(["users", "searchUsers"], {
  params: {
    search: "علی",
    page: 1,
    limit: 10,
  }, // /api/users/search?search=علی&page=1&limit=10
});
```

## Custom Axios Config

```typescript
const { mutateAsync } = useAPI(["users", "createUser"], {
  axiosConfig: {
    timeout: 5000,
    headers: {
      "X-Custom-Header": "value",
    },
  },
});
```

## Invalidation سفارشی

به صورت پیش‌فرض، پس از هر mutation موفق، تمام query‌های مربوط به همان endpoint invalidate می‌شوند. اما می‌توانید این رفتار را سفارشی کنید:

```typescript
const { mutateAsync } = useAPI(["posts", "createPost"], {
  invalidateKey: ["posts"], // تمام query‌هایی که با "posts" شروع می‌شوند
});
```

## Custom Query Key

```typescript
const { data } = useAPI(["users", "getUsers"], {
  queryKey: ["custom", "users", "list"],
});
```

## Callback‌های سفارشی

```typescript
const { mutateAsync } = useAPI(["users", "createUser"], {
  onSuccess: (data) => {
    console.log("موفق:", data);
  },
  onError: (error) => {
    console.error("خطا:", error);
  },
});
```

## مثال کامل با Form

```typescript
import { useAPI } from "@/core/hooks/useAPI";
import { useState } from "react";

function RegistrationForm() {
  const [loading, setLoading] = useState(false);

  const { mutateAsync: sendOTP } = useAPI(["onboarding", "sendOTP"], {
    isFormData: true,
  });

  const handleSubmit = async (formData: {
    nationalCode: string;
    phoneNumber: string;
  }) => {
    setLoading(true);
    
    try {
      const result = await sendOTP({
        nationalCode: formData.nationalCode,
        mobileNo: formData.phoneNumber,
      });
      
      console.log("کد OTP ارسال شد:", result);
    } catch (error) {
      console.error("خطا در ارسال OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        nationalCode: e.currentTarget.nationalCode.value,
        phoneNumber: e.currentTarget.phoneNumber.value,
      });
    }}>
      <input name="nationalCode" placeholder="کدملی" />
      <input name="phoneNumber" placeholder="شماره همراه" />
      <button type="submit" disabled={loading}>
        {loading ? "در حال ارسال..." : "ارسال کد"}
      </button>
    </form>
  );
}
```

## Best Practices

### 1. انتخاب درست Content-Type

انتخاب Content-Type مناسب برای درخواست خیلی مهم است:

✅ **برای آپلود فایل - استفاده از isFormData:**
```typescript
const { mutateAsync } = useAPI(["upload", "uploadFile"], {
  isFormData: true, // multipart/form-data
});
```

✅ **برای فرم‌های ساده (مثل login) - استفاده از isUrlEncoded:**
```typescript
const { mutateAsync } = useAPI(["auth", "login"], {
  isUrlEncoded: true, // application/x-www-form-urlencoded
});
```

✅ **برای JSON (پیش‌فرض) - بدون گزینه اضافی:**
```typescript
const { mutateAsync } = useAPI(["users", "createUser"]);
// Content-Type: application/json (default)
```

❌ **اشتباه - ساخت دستی FormData:**
```typescript
const { mutateAsync } = useAPI(["upload", "uploadFile"]);
const formData = new FormData();
formData.append("file", file);
await mutateAsync(formData); // ❌ به جای این از isFormData استفاده کنید
```

### 2. استفاده از mutateAsync برای async/await

✅ **درست:**
```typescript
const { mutateAsync } = useAPI(["users", "createUser"]);

try {
  const result = await mutateAsync(data);
  // کار بعدی
} catch (error) {
  // مدیریت خطا
}
```

### 3. Type Safety

همیشه از type inference خودکار TypeScript استفاده کنید:

```typescript
// TypeScript به صورت خودکار نوع data را تشخیص می‌دهد
const { data } = useAPI(["users", "getUsers"]);
```

## مثال کامل با URL-encoded (OAuth Login)

```typescript
import { useAPI } from "@/core/hooks/useAPI";
import { useState } from "react";

function OAuthLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { mutateAsync: getToken } = useAPI(["auth", "token"], {
    isUrlEncoded: true, // برای OAuth باید URL-encoded باشد
  });

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError("");
    
    try {
      const result = await getToken({
        grant_type: "password",
        username: username,
        password: password,
        client_id: "web-app",
        client_secret: "secret-key",
        scope: "read write",
      });
      
      // ذخیره token
      localStorage.setItem("access_token", result.data.access_token);
      console.log("ورود موفق:", result);
    } catch (err) {
      setError("نام کاربری یا رمز عبور اشتباه است");
      console.error("خطا در ورود:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleLogin(
        formData.get("username") as string,
        formData.get("password") as string
      );
    }}>
      <input 
        name="username" 
        type="text" 
        placeholder="نام کاربری"
        required 
      />
      <input 
        name="password" 
        type="password" 
        placeholder="رمز عبور"
        required 
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
}
```

## خطاهای رایج و راه‌حل

### خطا: "Invalid API key"

**علت:** scope یا endpoint در فایل `apis.ts` تعریف نشده است.

**راه‌حل:** مطمئن شوید که endpoint در `@/core/services/apis` تعریف شده است.

### خطا: Type mismatch

**علت:** نوع داده ارسالی با نوع تعریف شده در API config مطابقت ندارد.

**راه‌حل:** مطمئن شوید که نوع `request` در تعریف API صحیح است.

## نتیجه‌گیری

`useAPI` hook یک راه ساده و type-safe برای مدیریت درخواست‌های API در پروژه است. با استفاده از این hook:

- ✅ نیازی به نوشتن boilerplate code نیست
- ✅ Type safety کامل دارید
- ✅ مدیریت cache خودکار است
- ✅ آپلود فایل با یک گزینه ساده است (`isFormData: true`)
- ✅ پشتیبانی از فرم‌های URL-encoded (`isUrlEncoded: true`)
- ✅ سازگار با استانداردهای OAuth و REST API

### خلاصه گزینه‌های Content-Type:

```typescript
// JSON (پیش‌فرض) - برای اکثر API‌ها
useAPI(["users", "create"]);

// Multipart Form Data - برای آپلود فایل
useAPI(["files", "upload"], { isFormData: true });

// URL Encoded - برای OAuth و فرم‌های ساده
useAPI(["auth", "login"], { isUrlEncoded: true });
```

برای سؤالات بیشتر، به کد `@/core/hooks/useAPI.ts` مراجعه کنید.
