"use client";

import { AlertCircle, Inbox, RefreshCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

type DataGridEmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  variant?: "empty" | "error";
  onRetry?: () => void;
};

export function DataGridEmptyState({
  title,
  description,
  icon,
  action,
  variant = "empty",
  onRetry,
}: DataGridEmptyStateProps) {
  const isError = variant === "error";
  const defaultIcon = isError ? (
    <AlertCircle className="size-5 text-destructive" />
  ) : (
    <Inbox className="size-5 text-muted-foreground" />
  );

  return (
    <Card className="flex flex-col items-center justify-center gap-3 border-dashed bg-card/30 py-16 text-center shadow-none">
      <div
        className={
          isError
            ? "flex size-12 items-center justify-center rounded-full bg-destructive/10"
            : "flex size-12 items-center justify-center rounded-full bg-muted"
        }
      >
        {icon ?? defaultIcon}
      </div>

      <div className="flex flex-col items-center gap-1 px-6">
        <p className="text-sm font-semibold text-foreground">
          {title ?? (isError ? "مشکلی پیش آمد" : "نتیجه‌ای یافت نشد")}
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {description ??
            (isError
              ? "بارگذاری داده‌ها ممکن نشد. لطفاً دوباره تلاش کنید."
              : "برای دیدن نتایج بیشتر فیلترها یا جستجوی خود را تنظیم کنید.")}
        </p>
      </div>

      <div className="mt-1 flex items-center gap-2">
        {onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry}>
            <RefreshCcw />
            تلاش مجدد
          </Button>
        ) : null}
        {action}
      </div>
    </Card>
  );
}
