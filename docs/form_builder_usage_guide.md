# FormBuilder Documentation

این داکیومنت توضیح می‌دهد که چگونه از **FormBuilder** استفاده کنید که با
`react-hook-form`, `zod`, و کامپوننت‌های `shadcn/ui` ساخته شده است.

------------------------------------------------------------------------

## نصب پکیج‌های لازم

``` bash
npm install react-hook-form zod @hookform/resolvers
npx shadcn-ui init
npx shadcn-ui add input button label
npm install react-day-picker date-fns
```

------------------------------------------------------------------------

## استفاده پایه

### تعریف Schema با Zod

``` ts
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3, "حداقل ۳ کاراکتر"),
  age: z.string().regex(/^\d+$/, "فقط عدد مجازه"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور باید حداقل 6 کاراکتر باشد"),
});

type UserForm = z.infer<typeof userSchema>;
```

### استفاده از FormBuilder

``` tsx
<FormBuilder<UserForm>
  schema={userSchema}
  fields={[
    { name: "name", label: "نام", type: "text", placeholder: "نام خود را وارد کنید" },
    { name: "age", label: "سن", type: "numericString", placeholder: "مثلاً 25" },
    { 
      name: "email", 
      label: "ایمیل", 
      type: "text", 
      placeholder: "ایمیل شما",
      onChange: (value) => {
        // تابع سفارشی برای تغییر مقدار
        console.log("مقدار جدید ایمیل:", value);
      }
    },
    {
      name: "password",
      label: "رمز عبور",
      type: "password", 
      placeholder: "رمز عبور خود را وارد کنید"
    }
  ]}
  onSubmit={(data) => {
    console.log("فرم ارسال شد:", data);
  }}
/>
```

------------------------------------------------------------------------

## FieldConfig Options

هر فیلد می‌تواند دارای پروپرتی‌های زیر باشد:

- `name`: (اجباری) نام فیلد که باید با کلیدهای schema مطابقت داشته باشد
- `label`: (اجباری) برچسب فیلد
- `type`: (اجباری) نوع فیلد (`text` یا `numericString`)
- `placeholder`: (اختیاری) متن راهنمای فیلد
- `onChange`: (اختیاری) تابع callback که هنگام تغییر مقدار فیلد اجرا می‌شود

### مثال onChange

``` tsx
{
  name: "username",
  label: "نام کاربری",
  type: "text",
  onChange: (value) => {
    // اعتبارسنجی آنی
    if (value.length < 3) {
      console.log("نام کاربری باید حداقل 3 کاراکتر باشد");
    }
    
    // تغییر حالت کامپوننت والد
    setIsUsernameValid(value.length >= 3);
  }
}
```

------------------------------------------------------------------------

## انواع فیلدهای پشتیبانی‌شده

-   `text`: ورودی متنی ساده
-   `numericString`: فقط اعداد را قبول می‌کند و مقدار را به صورت رشته
    برمی‌گرداند
-   `password`: ورودی رمز عبور با قابلیت نمایش/پنهان کردن متن
-   `datepicker`: انتخابگر تاریخ جلالی با استفاده از Drawer و DatePicker
-   `select`: فیلد انتخابی با قابلیت جستجو و اسکرول بی‌نهایت
-   `textarea`: ورودی متن چند خطی

### مثال فیلد رمز عبور

``` tsx
{
  name: "password",
  label: "رمز عبور", 
  type: "password",
  placeholder: "رمز عبور خود را وارد کنید"
}
```

فیلد رمز عبور دارای آیکن چشم در سمت راست است که با کلیک روی آن می‌توانید متن رمز عبور را مشاهده کنید یا پنهان کنید.

### مثال فیلد DatePicker

```tsx
{
  name: "birthDate",
  label: "تاریخ تولد",
  type: "datepicker",
  placeholder: "انتخاب تاریخ",
  defaultYear: 1375,
  defaultMonth: 1,
  defaultDay: 1,
  // Enable/Disable fields
  enableYear: true,
  enableMonth: true,
  enableDay: true,
  // Range settings
  startYear: 1330,
  endYear: 1430,
  startMonth: 1,
  endMonth: 12,
  startDay: 1,
  endDay: 31,
  onChange: (value) => {
    // مقدار به صورت YYYY-MM-DD (میلادی) برگشت داده می‌شود
    console.log("تاریخ انتخاب شده:", value);
  }
}
```

فیلد datepicker شامل یک اینپوت با آیکن تقویم است. با کلیک روی اینپوت، یک Drawer باز می‌شود که داخل آن DatePicker جلالی قرار دارد. تاریخ انتخاب شده به صورت میلادی (YYYY-MM-DD) برگشت داده می‌شود.

**پروپرتی‌های اضافی برای `datepicker`:**

مقادیر پیش‌فرض:
- `defaultYear`: سال پیش‌فرض (مثلاً 1375)
- `defaultMonth`: ماه پیش‌فرض (1 تا 12)
- `defaultDay`: روز پیش‌فرض (1 تا 31)

فعال/غیرفعال کردن فیلدها:
- `enableYear`: فعال/غیرفعال کردن انتخاب سال (پیش‌فرض: `true`)
- `enableMonth`: فعال/غیرفعال کردن انتخاب ماه (پیش‌فرض: `true`)
- `enableDay`: فعال/غیرفعال کردن انتخاب روز (پیش‌فرض: `true`)

محدودسازی بازه:
- `startYear` / `endYear`: محدود کردن بازه سال (پیش‌فرض: 1330-1430)
- `startMonth` / `endMonth`: محدود کردن بازه ماه (پیش‌فرض: 1-12)
- `startDay` / `endDay`: محدود کردن بازه روز

نمایش:
- `showMonthNumber`: نمایش شماره ماه به جای نام ماه (پیش‌فرض: `false`)
- `outputFormat`: فرمت خروجی تاریخ (پیش‌فرض: `"YYYY-MM-DD"`)

**مثال‌های کاربردی:**

```tsx
// فقط ماه و سال (برای کارت اعتباری)
{
  name: "cardExpiry",
  label: "تاریخ انقضا",
  type: "datepicker",
  enableDay: false,
  defaultMonth: 1,
  defaultYear: 1404,
}

// محدود کردن به 5 سال اخیر
{
  name: "issueDate",
  label: "تاریخ صدور",
  type: "datepicker",
  startYear: 1399,
  endYear: 1404,
}

// فقط ماه‌های بهار
{
  name: "springMonth",
  label: "ماه بهاری",
  type: "datepicker",
  startMonth: 1,
  endMonth: 3,
}

// نمایش شماره ماه به جای نام
{
  name: "monthNumber",
  label: "ماه (عددی)",
  type: "datepicker",
  showMonthNumber: true,
  defaultMonth: 6,
  defaultYear: 1403,
}

// فرمت خروجی سفارشی
{
  name: "customFormat",
  label: "تاریخ با فرمت سفارشی",
  type: "datepicker",
  outputFormat: "YYYY/MM/DD",
}

// فقط سال
{
  name: "yearOnly",
  label: "فقط سال",
  type: "datepicker",
  enableMonth: false,
  enableDay: false,
  outputFormat: "YYYY",
}
```

### مثال فیلد Textarea

``` tsx
{
  name: "description",
  label: "توضیحات",
  type: "textarea",
  placeholder: "توضیحات خود را وارد کنید",
  rows: 5,
  maxLength: 500,
  onChange: (value) => {
    console.log("تعداد کاراکترها:", value.length);
  }
}
```

فیلد textarea برای ورودی متن چند خطی استفاده می‌شود. این فیلد قابلیت تغییر اندازه عمودی را دارد.

پروپرتی‌های اضافی برای `textarea`:
- `rows`: تعداد خطوط پیش‌فرض (مثلاً 5)
- `maxLength`: حداکثر تعداد کاراکترها (مثلاً 500)

### مثال فیلد Select

``` tsx
{
  name: "city",
  label: "شهر",
  type: "select",
  placeholder: "شهر خود را انتخاب کنید",
  options: [
    { label: "تهران", value: "tehran" },
    { label: "شیراز", value: "shiraz" },
    { label: "مشهد", value: "mashhad" }
  ],
  search: true, // فعال‌سازی جستجو
  infinite: false, // اسکرول بی‌نهایت غیرفعال
  isLoading: false, // نمایش لودینگ
  onChange: (value, label) => {
    console.log("شهر انتخاب شده:", label);
  }
}
```

فیلد select با استفاده از کامپوننت SelectInput پیاده‌سازی شده است و دارای قابلیت‌های زیر است:
- نمایش لیست گزینه‌ها در Drawer
- قابلیت جستجو در گزینه‌ها (با `search: true`)
- اسکرول بی‌نهایت (با `infinite: true`) - مناسب برای لیست‌های کوچک
- نمایش آیکن لودینگ (با `isLoading: true`) - برای زمانی که داده‌ها در حال بارگذاری هستند

پروپرتی‌های اضافی برای `select`:
- `options`: (الزامی) آرایه‌ای از گزینه‌ها با فرمت `{ label: string, value: string }`
- `search`: فعال‌سازی قابلیت جستجو در لیست (پیش‌فرض: false)
- `infinite`: فعال‌سازی اسکرول دایره‌ای (پیش‌فرض: false)
- `isLoading`: نمایش آیکن لودینگ و غیرفعال کردن input (پیش‌فرض: false)
- `resetFields`: آرایه‌ای از نام فیلدهایی که با تغییر این فیلد باید ریست شوند (پیش‌فرض: undefined)

### استفاده از resetFields برای فیلدهای وابسته

وقتی دو فیلد به هم وابسته هستند (مثل استان و شهر)، می‌توانید از `resetFields` استفاده کنید تا با تغییر فیلد اول، فیلدهای وابسته به صورت خودکار ریست شوند:

``` tsx
const fields = [
  {
    name: "province",
    label: "استان",
    type: "select",
    options: provincesOptions,
    resetFields: ["city"], // با تغییر استان، شهر ریست می‌شود
    onChange: async (value, label) => {
      const cities = await fetchCities(value);
      setCitiesOptions(cities);
    }
  },
  {
    name: "city",
    label: "شهر",
    type: "select",
    options: citiesOptions,
  }
];
```

مثال با بارگذاری پویای داده:
``` tsx
const { data: provincesData, isLoading: provincesLoading } = useAPI(["base", "provinces"]);
const [citiesOptions, setCitiesOptions] = useState([]);
const [citiesLoading, setCitiesLoading] = useState(false);

const fields = [
  {
    name: "province",
    label: "استان",
    type: "select",
    options: provincesData?.map(p => ({ label: p.name, value: p.id })) || [],
    isLoading: provincesLoading,
    search: true,
    onChange: async (value, label) => {
      setCitiesLoading(true);
      const cities = await fetchCities(value);
      setCitiesOptions(cities);
      setCitiesLoading(false);
    }
  },
  {
    name: "city",
    label: "شهر",
    type: "select",
    options: citiesOptions,
    isLoading: citiesLoading,
    search: true,
  }
];
```

------------------------------------------------------------------------

## مثال کامل با تمام انواع فیلدها

``` tsx
import { z } from "zod";
import { FormBuilder } from "@/shared/components/form-builder";

const registrationSchema = z.object({
  fullName: z.string().min(3, "نام باید حداقل 3 کاراکتر باشد"),
  nationalCode: z.string().regex(/^\d{10}$/, "کد ملی باید 10 رقم باشد"),
  birthDate: z.string().min(1, "تاریخ تولد الزامی است"),
  password: z.string().min(6, "رمز عبور باید حداقل 6 کاراکتر باشد"),
  city: z.string().min(1, "انتخاب شهر الزامی است"),
  bio: z.string().max(500, "توضیحات نباید بیشتر از 500 کاراکتر باشد").optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

function RegistrationPage() {
  const handleSubmit = (data: RegistrationForm) => {
    console.log("اطلاعات فرم:", data);
    // data.birthDate به صورت YYYY-MM-DD (میلادی) است
  };

  const cityOptions = [
    { value: "tehran", label: "تهران" },
    { value: "shiraz", label: "شیراز" },
    { value: "mashhad", label: "مشهد" },
    { value: "isfahan", label: "اصفهان" },
  ];

  return (
    <FormBuilder<RegistrationForm>
      schema={registrationSchema}
      fields={[
        {
          name: "fullName",
          label: "نام و نام خانوادگی",
          type: "text",
          placeholder: "مثال: علی احمدی",
        },
        {
          name: "nationalCode",
          label: "کد ملی",
          type: "numericString",
          placeholder: "1234567890",
        },
        {
          name: "birthDate",
          label: "تاریخ تولد",
          type: "datepicker",
          placeholder: "انتخاب تاریخ تولد",
          defaultYear: 1375,
          defaultMonth: 1,
          defaultDay: 1,
          // محدود کردن به افراد بالای 18 سال
          startYear: 1330,
          endYear: 1385, // فرض: سال جاری 1403 است
        },
        {
          name: "city",
          label: "شهر",
          type: "select",
          placeholder: "شهر خود را انتخاب کنید",
          options: cityOptions,
          search: true,
        },
        {
          name: "bio",
          label: "درباره من",
          type: "textarea",
          placeholder: "توضیحات کوتاهی درباره خودتان بنویسید",
          rows: 4,
          maxLength: 500,
        },
        {
          name: "password",
          label: "رمز عبور",
          type: "password",
          placeholder: "حداقل 6 کاراکتر",
        },
      ]}
      onSubmit={handleSubmit}
      buttonText="ثبت نام"
      isLoading={false}
    />
  );
}
```

------------------------------------------------------------------------

## Props کامپوننت FormBuilder

### Props اصلی

- **`schema`** (الزامی): Schema زود برای validation
- **`fields`** (الزامی): آرایه‌ای از تعریف فیلدها
- **`onSubmit`** (الزامی): تابع callback که بعد از submit موفق فراخوانی می‌شود
- **`buttonText`** (اختیاری): متن دکمه submit (پیش‌فرض: "ثبت")
- **`isLoading`** (اختیاری): وضعیت loading دکمه submit (پیش‌فرض: `false`)
- **`isSubmitButtonSticky`** (اختیاری): آیا دکمه submit به پایین صفحه چسبیده باشد (پیش‌فرض: `true`)
- **`classes`** (اختیاری): کلاس‌های CSS سفارشی برای دکمه submit
- **`wrapper`** (اختیاری): کامپوننت wrapper برای فیلدها (برای انیمیشن)
- **`defaultValues`** (اختیاری): مقادیر پیش‌فرض فرم (برای بارگذاری داده‌های persist شده)

### مثال استفاده از defaultValues

این prop برای بارگذاری مقادیر قبلی (مثلاً از localStorage یا sessionStorage) استفاده می‌شود:

```tsx
import { useState, useEffect } from "react";

const MyForm = () => {
  const [savedData, setSavedData] = useState({});

  useEffect(() => {
    // خواندن داده از storage
    const data = sessionStorage.getItem('form-data');
    if (data) {
      setSavedData(JSON.parse(data));
    }
  }, []);

  return (
    <FormBuilder
      schema={mySchema}
      fields={myFields}
      onSubmit={handleSubmit}
      defaultValues={savedData} // بارگذاری مقادیر قبلی
    />
  );
};
```

**نکته**: وقتی `defaultValues` تغییر کند، فرم به صورت خودکار با `reset` به‌روزرسانی می‌شود.

------------------------------------------------------------------------

## استفاده از isAsyncValue و isLoading

برای فیلدهایی که مقدارشان از API بارگذاری می‌شود، می‌توانید از `isAsyncValue` و `isLoading` استفاده کنید:

### مثال:

```tsx
import { useAPI } from "@/core/hooks/useAPI";

const MyForm = () => {
  const { data, isLoading } = useAPI(["iam", "userInfo"]);

  return (
    <FormBuilder
      schema={mySchema}
      fields={[
        {
          name: "currentPhoneNumber",
          label: "شماره همراه فعلی",
          type: "text",
          value: data?.cellphoneNumber,
          readonly: true,
          isLoading: isLoading, // نمایش loading spinner در سمت چپ
          isAsyncValue: true, // مقدار از API می‌آید و باید به صورت خودکار ست شود
        },
        // ... سایر فیلدها
      ]}
      onSubmit={handleSubmit}
    />
  );
};
```

### توضیحات:

- **`isAsyncValue`**: وقتی `true` باشد، FormBuilder منتظر می‌ماند تا مقدار `value` از API دریافت شود و به صورت خودکار در فیلد ست می‌کند. این باعث می‌شود که کاربر تغییر مقدار را ببیند.

- **`isLoading`**: وقتی `true` باشد، یک loading spinner در سمت چپ input نمایش داده می‌شود تا به کاربر نشان دهد که داده در حال بارگذاری است.

**نکته**: این دو prop معمولاً با هم استفاده می‌شوند. `isAsyncValue` برای مدیریت مقدار و `isLoading` برای نمایش وضعیت بارگذاری.

------------------------------------------------------------------------

## مزایا

-   استفاده مجدد از یک کامپوننت مرکزی
-   تایپ ایمن با Zod
-   ولیدیشن سمت کلاینت ساده
-   پشتیبانی از انواع مختلف فیلدها (text, numericString, password, datepicker, select, textarea)
-   قابلیت بارگذاری مقادیر پیش‌فرض برای persistence
-   قابلیت توسعه آسان

