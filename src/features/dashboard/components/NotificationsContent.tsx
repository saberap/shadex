"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CreditCard,
  Info,
  Package,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/core/utils/cn";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type NotifType = "success" | "info" | "warning" | "error";

interface Notification {
  id: number;
  type: NotifType;
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "success",
    icon: CreditCard,
    title: "پرداخت دریافت شد",
    description: "شما پرداختی به مبلغ $1,999.00 از Olivia Martin دریافت کردید.",
    time: "۲ دقیقه پیش",
    read: false,
  },
  {
    id: 2,
    type: "info",
    icon: Users,
    title: "کاربر جدید ثبت‌نام کرد",
    description:
      "Jackson Lee حساب کاربری جدیدی ایجاد کرد و در انتظار تأیید است.",
    time: "۱۸ دقیقه پیش",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    icon: AlertTriangle,
    title: "نزدیک شدن به محدودیت فضای ذخیره‌سازی",
    description: "شما ۸۷٪ از سهمیه ۵۰ گیگابایتی فضای ذخیره‌سازی خود را استفاده کرده‌اید.",
    time: "۱ ساعت پیش",
    read: false,
  },
  {
    id: 4,
    type: "success",
    icon: Package,
    title: "سفارش انجام شد",
    description: "سفارش #4821 ارسال شده و در راه است.",
    time: "۳ ساعت پیش",
    read: true,
  },
  {
    id: 5,
    type: "info",
    icon: Settings,
    title: "تعمیر و نگهداری سیستم",
    description:
      "تعمیر و نگهداری برنامه‌ریزی‌شده برای ۱۰ ژوئن ۲۰۲۶ در ساعت 02:00 UTC پیش‌بینی شده است.",
    time: "۵ ساعت پیش",
    read: true,
  },
  {
    id: 6,
    type: "error",
    icon: AlertTriangle,
    title: "ارسال وب‌هوک ناموفق بود",
    description:
      "۳ رویداد وب‌هوک نتوانستند به https://api.example.com/hook ارسال شوند.",
    time: "دیروز",
    read: true,
  },
  {
    id: 7,
    type: "success",
    icon: CheckCircle2,
    title: "اشتراک تمدید شد",
    description: "اشتراک پلن Pro شما با موفقیت تمدید شد.",
    time: "۲ روز پیش",
    read: true,
  },
  {
    id: 8,
    type: "info",
    icon: Info,
    title: "ویژگی جدید در دسترس است",
    description: "تحلیل‌های پیشرفته با بازه‌های تاریخ سفارشی اکنون در دسترس است.",
    time: "۳ روز پیش",
    read: true,
  },
];

const typeStyle: Record<NotifType, { bg: string; icon: string }> = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    icon: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    icon: "text-amber-600 dark:text-amber-400",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950/40",
    icon: "text-red-600 dark:text-red-400",
  },
};

export function NotificationsContent() {
  const [items, setItems] = useState(initialNotifications);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismiss = (id: number) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  const markRead = (id: number) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const unread = items.filter((n) => !n.read);
  const read = items.filter((n) => n.read);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>اعلان‌ها</CardTitle>
              {unreadCount > 0 && (
                <Badge className="h-5 px-1.5 text-xs">{unreadCount} جدید</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                <CheckCircle2 className="size-3" />
                علامت‌گذاری همه به‌عنوان خوانده‌شده
              </Button>
            </div>
          </div>
          <CardDescription>
            {unreadCount > 0
              ? `شما ${unreadCount} اعلان خوانده‌نشده دارید.`
              : "همه را خوانده‌اید."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {unread.length > 0 && (
            <>
              <div className="px-4 sm:px-6 py-2 bg-muted/40 border-y">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  جدید
                </p>
              </div>
              <NotificationList
                items={unread}
                onDismiss={dismiss}
                onRead={markRead}
              />
            </>
          )}

          {read.length > 0 && (
            <>
              <div className="px-4 sm:px-6 py-2 bg-muted/40 border-y">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  قبل‌تر
                </p>
              </div>
              <NotificationList
                items={read}
                onDismiss={dismiss}
                onRead={markRead}
              />
            </>
          )}

          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Bell className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">اعلانی وجود ندارد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationList({
  items,
  onDismiss,
  onRead,
}: {
  items: Notification[];
  onDismiss: (id: number) => void;
  onRead: (id: number) => void;
}) {
  return (
    <div className="divide-y">
      {items.map((n) => {
        const style = typeStyle[n.type];
        return (
          <div
            key={n.id}
            className={cn(
              "flex items-start gap-3 px-4 sm:px-6 py-4 transition-colors hover:bg-muted/30 cursor-pointer",
              !n.read && "bg-muted/20",
            )}
            onClick={() => onRead(n.id)}
          >
            <div
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                style.bg,
              )}
            >
              <n.icon className={cn("size-4", style.icon)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className={cn("text-sm truncate", !n.read && "font-semibold")}
                >
                  {n.title}
                </p>
                {!n.read && (
                  <span className="size-1.5 rounded-full bg-primary shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {n.description}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100 mt-0.5"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(n.id);
              }}
            >
              <X className="size-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
