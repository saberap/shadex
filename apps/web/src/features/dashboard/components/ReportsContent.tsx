"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

type ReportStatus = "ready" | "generating" | "failed";

const reports = [
  {
    id: 1,
    name: "گزارش درآمد ماهانه",
    type: "مالی",
    icon: FileSpreadsheet,
    date: "۱ ژوئن ۲۰۲۶",
    size: "2.4 MB",
    status: "ready" as ReportStatus,
  },
  {
    id: 2,
    name: "خلاصه جذب کاربر",
    type: "بازاریابی",
    icon: FileText,
    date: "۱ ژوئن ۲۰۲۶",
    size: "1.1 MB",
    status: "ready" as ReportStatus,
  },
  {
    id: 3,
    name: "تفکیک فروش سه‌ماهه دوم",
    type: "فروش",
    icon: FileSpreadsheet,
    date: "۳۱ مه ۲۰۲۶",
    size: "3.8 MB",
    status: "ready" as ReportStatus,
  },
  {
    id: 4,
    name: "عملکرد محصول",
    type: "محصول",
    icon: FileText,
    date: "۲۸ مه ۲۰۲۶",
    size: "890 KB",
    status: "ready" as ReportStatus,
  },
  {
    id: 5,
    name: "خلاصه ترافیک هفتگی",
    type: "تحلیل‌ها",
    icon: FileText,
    date: "۷ ژوئن ۲۰۲۶",
    size: "—",
    status: "generating" as ReportStatus,
  },
  {
    id: 6,
    name: "تحلیل ریزش اشتراک",
    type: "مالی",
    icon: FileSpreadsheet,
    date: "۲۰ مه ۲۰۲۶",
    size: "—",
    status: "failed" as ReportStatus,
  },
];

const statusConfig: Record<
  ReportStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  ready: { label: "آماده", variant: "default" },
  generating: { label: "در حال تولید…", variant: "secondary" },
  failed: { label: "ناموفق", variant: "destructive" },
};

const summaryStats = [
  { label: "کل گزارش‌ها", value: "24" },
  { label: "تولیدشده در این ماه", value: "6" },
  { label: "زمان‌بندی‌شده", value: "3" },
  { label: "فضای استفاده‌شده", value: "48 MB" },
];

export function ReportsContent() {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryStats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>همه گزارش‌ها</CardTitle>
              <CardDescription className="mt-1">
                گزارش‌های خود را دانلود یا دوباره تولید کنید.
              </CardDescription>
            </div>
            <Button
              size="sm"
              className="gap-1.5 self-start sm:self-auto"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  در حال تولید…
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  گزارش جدید
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Table header — hidden on mobile */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-2 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>نام</span>
            <span>نوع</span>
            <span>تاریخ</span>
            <span>حجم</span>
            <span>وضعیت</span>
          </div>

          <div className="divide-y">
            {reports.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 px-4 sm:px-6 py-3.5 hover:bg-muted/40 transition-colors"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <r.icon className="size-4 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 sm:hidden">
                    <span className="text-xs text-muted-foreground">
                      {r.date}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <Badge
                      variant={statusConfig[r.status].variant}
                      className="h-4 px-1 text-[10px]"
                    >
                      {statusConfig[r.status].label}
                    </Badge>
                  </div>
                </div>

                {/* Desktop columns */}
                <span className="hidden sm:block text-sm text-muted-foreground w-24 shrink-0">
                  {r.type}
                </span>
                <span className="hidden sm:block text-sm text-muted-foreground w-24 shrink-0">
                  {r.date}
                </span>
                <span className="hidden sm:block text-sm text-muted-foreground w-16 shrink-0 text-end">
                  {r.size}
                </span>
                <div className="hidden sm:flex w-24 justify-center shrink-0">
                  <Badge
                    variant={statusConfig[r.status].variant}
                    className="text-xs"
                  >
                    {statusConfig[r.status].label}
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  disabled={r.status !== "ready"}
                >
                  <Download className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
