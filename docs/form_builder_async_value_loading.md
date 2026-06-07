# استفاده از isAsyncValue و isLoading در FormBuilder

این راهنما نحوه استفاده از قابلیت‌های `isAsyncValue` و `isLoading` در FormBuilder را برای مدیریت فیلدهایی که مقدارشان از API دریافت می‌شود، توضیح می‌دهد.

## مشکل

زمانی که مقدار یک فیلد از API بارگذاری می‌شود:
- کاربر نمی‌تواند ببیند که داده در حال بارگذاری است
- مقدار فیلد به صورت ناگهانی تغییر می‌کند
- تجربه کاربری ضعیفی ایجاد می‌شود

## راه‌حل

با استفاده از دو پراپرتی `isAsyncValue` و `isLoading`:

### 1. `isAsyncValue`
- مقدار فیلد به صورت خودکار با تغییر `value` از API به‌روزرسانی می‌شود
- تغییرات به صورت روان و قابل مشاهده برای کاربر اعمال می‌شود
- مقدار فیلد همیشه با داده API sync می‌ماند

### 2. `isLoading`
- یک loading spinner در سمت چپ input نمایش داده می‌شود
- به کاربر نشان می‌دهد که داده در حال بارگذاری است
- بعد از بارگذاری کامل، spinner حذف می‌شود

## نحوه استفاده

### مثال کامل

```tsx
"use client";
import { useAPI } from "@/core/hooks/useAPI";
import { FormBuilder } from "@/shared/components/form-builder";
import z from "zod";

const formSchema = z.object({
  currentPhoneNumber: z.string(),
  newPhoneNumber: z.string().min(11, "حداقل 11 رقم"),
});

const MyForm = () => {
  // دریافت داده از API
  const { data, isLoading } = useAPI(["iam", "userInfo"]);

  const onSubmitHandler = (formData: z.infer<typeof formSchema>) => {
    console.log(formData);
  };

  return (
    <FormBuilder
      schema={formSchema}
      onSubmit={onSubmitHandler}
      fields={[
        {
          name: "currentPhoneNumber",
          label: "شماره همراه فعلی",
          type: "text",
          value: data?.cellphoneNumber, // مقدار از API
          readonly: true,
          isLoading: isLoading, // نمایش loading spinner
          isAsyncValue: true, // فعال‌سازی به‌روزرسانی خودکار
        },
        {
          name: "newPhoneNumber",
          label: "شماره همراه جدید",
          type: "text",
          maxLength: 11,
        },
      ]}
    />
  );
};

export default MyForm;
```

## جزئیات فنی

### در Input Component

وقتی `isLoading={true}` است:
1. یک SVG spinner انیمیت‌دار در سمت چپ input نمایش داده می‌شود
2. اگر `leftIcon` تعریف شده باشد، با spinner جایگزین می‌شود
3. spinner با رنگ primary theme نمایش داده می‌شود

```tsx
{isLoading && (
  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
    <svg className="animate-spin h-5 w-5 c-icon-primary" ...>
      {/* SVG spinner */}
    </svg>
  </div>
)}
```

### در FormBuilder

وقتی `isAsyncValue={true}` است:
1. یک `useEffect` مقدار فیلد را رصد می‌کند
2. هر بار که `value` تغییر کند، فیلد را به‌روزرسانی می‌کند
3. از `shouldValidate: false` استفاده می‌شود تا validation اجرا نشود

```tsx
useEffect(() => {
  fields.forEach((field) => {
    if (field.isAsyncValue && field.value !== undefined && field.value !== null) {
      const currentValue = getValues(field.name);
      if (currentValue !== field.value) {
        setValue(field.name, field.value, { shouldValidate: false });
      }
    }
  });
}, [fields.map(f => f.isAsyncValue ? f.value : null)]);
```

## کاربردها

### 1. نمایش اطلاعات کاربر
```tsx
{
  name: "username",
  type: "text",
  value: userData?.username,
  isLoading: isLoadingUser,
  isAsyncValue: true,
  readonly: true,
}
```

### 2. فیلدهای پیش‌فرض با API
```tsx
{
  name: "email",
  type: "text",
  value: userProfile?.email,
  isLoading: isFetchingProfile,
  isAsyncValue: true,
}
```

### 3. فرم‌های ویرایش
```tsx
{
  name: "address",
  type: "textarea",
  value: addressData?.fullAddress,
  isLoading: isLoadingAddress,
  isAsyncValue: true,
}
```

## نکات مهم

✅ **توصیه می‌شود:**
- همیشه `isAsyncValue` و `isLoading` را با هم استفاده کنید
- برای فیلدهای readonly از `isAsyncValue` استفاده کنید
- مطمئن شوید که `value` از hook/API شما می‌آید

❌ **توصیه نمی‌شود:**
- استفاده از `isAsyncValue` بدون `value`
- استفاده از `isLoading` برای فیلدهای عادی
- فراموش کردن `isAsyncValue` وقتی مقدار async است

## انواع Input های پشتیبانی شده

قابلیت `isLoading` برای این نوع input ها پشتیبانی می‌شود:
- ✅ `text`
- ✅ `numericString`
- ✅ `password` (spinner به جای آیکون چشم نمایش داده می‌شود)

قابلیت `isAsyncValue` برای تمام نوع input ها کار می‌کند.

## مثال پیشرفته: فرم تغییر شماره همراه

```tsx
const ChangePhoneForm = () => {
  const router = useRouter();
  const { data, isLoading } = useAPI(["iam", "userInfo"]);
  
  const { mutateAsync: changePhone, isPending } = useAPI([
    "users",
    "changeCellPhoneNumber",
  ]);

  const formSchema = z.object({
    currentPhone: z.string(),
    newPhone: z
      .string()
      .min(11, "حداقل 11 رقم")
      .refine((value) => isPhoneNumberValid(value), {
        message: "شماره همراه وارد شده صحیح نیست.",
      }),
  });

  const onSubmit = async (formData) => {
    await changePhone({ cellphoneNumber: formData.newPhone });
    router.back();
  };

  return (
    <FormBuilder
      schema={formSchema}
      onSubmit={onSubmit}
      isLoading={isPending}
      buttonText="ثبت شماره جدید"
      fields={[
        {
          name: "currentPhone",
          label: "شماره همراه فعلی",
          type: "text",
          value: data?.cellphoneNumber,
          readonly: true,
          isLoading: isLoading,
          isAsyncValue: true,
          renderBefore: () => (
            <p className="mb-6 c-text-high-emphasis">
              شماره همراه متعلق به خودتان را وارد کنید.
            </p>
          ),
        },
        {
          name: "newPhone",
          label: "شماره همراه جدید",
          type: "text",
          maxLength: 11,
        },
      ]}
    />
  );
};
```

## خلاصه

این قابلیت باعث می‌شود:
- ✨ تجربه کاربری بهتر با نمایش loading
- 🔄 به‌روزرسانی خودکار فیلدها با داده API
- 🎯 کد تمیزتر و قابل نگهداری‌تر
- 📱 رفتار استاندارد برای فرم‌های async

---

**تاریخ ایجاد:** ۲۴ دسامبر ۲۰۲۵  
**آخرین به‌روزرسانی:** ۲۴ دسامبر ۲۰۲۵
