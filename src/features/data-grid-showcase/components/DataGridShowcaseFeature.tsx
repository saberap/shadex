"use client";

import { Suspense } from "react";
import {
  BasicTable,
  CrmCustomersTable,
  EditableTable,
  ExpandableTable,
  FilterableTable,
  FinanceTable,
  ServerSideTable,
  SortableTable,
  TasksTable,
  UrlSyncTable,
  VirtualizedTable,
} from "@/shared/components/data-grid/examples";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

type ShowcaseItem = {
  value: string;
  label: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

const items: ShowcaseItem[] = [
  {
    value: "crm",
    label: "CRM",
    title: "مشتریان CRM",
    description:
      "جدول کامل مشتریان با آواتار، وضعیت، عملیات گروهی و منوی ردیف.",
    component: <CrmCustomersTable />,
  },
  {
    value: "finance",
    label: "مالی",
    title: "فاکتورها",
    description:
      "دفتر فاکتورها با قالب‌بندی ارز، نشان‌های وضعیت و عملیات هر ردیف.",
    component: <FinanceTable />,
  },
  {
    value: "tasks",
    label: "وظایف",
    title: "وظایف پروژه",
    description:
      "وظایف به همراه نوار پیشرفت، برچسب‌های اولویت و وضعیت، و عملیات گروهی.",
    component: <TasksTable />,
  },
  {
    value: "basic",
    label: "ساده",
    title: "جدول ساده",
    description: "کوچک‌ترین پیکربندی ممکن — داده، ستون‌ها و جستجو.",
    component: <BasicTable />,
  },
  {
    value: "sorting",
    label: "مرتب‌سازی",
    title: "ستون‌های قابل مرتب‌سازی",
    description:
      "مرتب‌سازی چندستونی با نشانه بصری ظریف هنگام هاور روی ستون.",
    component: <SortableTable />,
  },
  {
    value: "filtering",
    label: "فیلتر کردن",
    title: "فیلترهای هر ستون",
    description:
      "فیلترهای متنی، انتخابی و تاریخ یکپارچه در سرستون هر ستون.",
    component: <FilterableTable />,
  },
  {
    value: "editable",
    label: "قابل ویرایش",
    title: "ویرایش درون‌خطی",
    description:
      "برای ویرایش سلول‌های متنی، عددی و انتخابی کلیک کنید. ذخیره فوری اطلاع‌رسانی می‌شود.",
    component: <EditableTable />,
  },
  {
    value: "expandable",
    label: "قابل گسترش",
    title: "ردیف‌های قابل گسترش",
    description:
      "باز کردن یک پنل جزئیات در زیر هر ردیف به همراه فراداده‌های مرتبط.",
    component: <ExpandableTable />,
  },
  {
    value: "virtualized",
    label: "مجازی‌سازی‌شده",
    title: "مجازی‌سازی ۱۰٬۰۰۰ ردیف",
    description:
      "TanStack Virtual ۱۰٬۰۰۰ ردیف را با اسکرول زیر میلی‌ثانیه مدیریت می‌کند.",
    component: <VirtualizedTable />,
  },
  {
    value: "server",
    label: "سمت سرور",
    title: "حالت سمت سرور",
    description:
      "متصل به /api/customers با صفحه‌بندی، مرتب‌سازی و فیلتر دستی.",
    component: <ServerSideTable />,
  },
  {
    value: "url",
    label: "همگام‌سازی URL",
    title: "وضعیت همگام با URL",
    description:
      "صفحه، جستجو و مرتب‌سازی در نوار آدرس باقی می‌ماند — مقاوم در برابر رفرش.",
    component: <UrlSyncTable />,
  },
];

export function DataGridShowcaseFeature() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <header className="flex flex-col gap-1.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          کامپوننت
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">جدول داده</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          یک جدول داده در سطح تولید بر پایه shadcn/ui، TanStack Table، Query و
          Virtual. مرتب‌سازی، فیلتر، مجازی‌سازی، ویرایش درون‌خطی، ردیف‌های قابل
          گسترش، حالت سمت سرور و همگام‌سازی URL — همه در یک کامپوننت قابل ترکیب.
        </p>
      </header>

      <Tabs defaultValue={items[0].value} className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/30 p-1">
          {items.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="data-[state=active]:bg-background"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {items.map((item) => (
          <TabsContent key={item.value} value={item.value} className="mt-4">
            <Card className="overflow-hidden border bg-card shadow-xs">
              <CardHeader className="border-b">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Suspense fallback={null}>{item.component}</Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
