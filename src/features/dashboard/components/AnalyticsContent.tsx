"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { Progress } from "@/shared/components/ui/progress";

const weeklyTraffic = [
  { day: "دوشنبه", visitors: 2400, pageviews: 4200 },
  { day: "سه‌شنبه", visitors: 3100, pageviews: 5800 },
  { day: "چهارشنبه", visitors: 2800, pageviews: 4900 },
  { day: "پنج‌شنبه", visitors: 3600, pageviews: 6100 },
  { day: "جمعه", visitors: 4200, pageviews: 7300 },
  { day: "شنبه", visitors: 1900, pageviews: 3100 },
  { day: "یک‌شنبه", visitors: 1500, pageviews: 2400 },
];

const chartConfig = {
  visitors: { label: "بازدیدکنندگان", color: "var(--chart-5)" },
  pageviews: { label: "بازدید صفحه", color: "var(--chart-2)" },
} satisfies ChartConfig;

const topPages = [
  { path: "/dashboard", views: 12430, pct: 32 },
  { path: "/products", views: 8912, pct: 23 },
  { path: "/users", views: 6310, pct: 16 },
  { path: "/analytics", views: 4870, pct: 13 },
  { path: "/settings", views: 3120, pct: 8 },
  { path: "/help", views: 2100, pct: 5 },
];

const sources = [
  { name: "جستجوی ارگانیک", value: 42, color: "bg-chart-5" },
  { name: "مستقیم", value: 28, color: "bg-chart-2" },
  { name: "شبکه‌های اجتماعی", value: 16, color: "bg-chart-3" },
  { name: "ارجاع", value: 9, color: "bg-chart-4" },
  { name: "ایمیل", value: 5, color: "bg-muted-foreground/40" },
];

const metrics = [
  { label: "بازدید صفحه", value: "38,742", change: "+14.2%", up: true },
  { label: "بازدیدکنندگان یکتا", value: "19,510", change: "+9.8%", up: true },
  { label: "نرخ پرش", value: "34.7%", change: "-2.1%", up: false },
  { label: "میانگین جلسه", value: "3m 42s", change: "+0:18", up: true },
];

export function AnalyticsContent() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Metric cards */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {m.value}
              </p>
              <p
                className={`mt-0.5 text-xs font-medium ${m.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}
              >
                {m.change} نسبت به هفته گذشته
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Sources */}
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>ترافیک هفتگی</CardTitle>
            <CardDescription>
              بازدیدکنندگان و بازدیدهای صفحه در ۷ روز گذشته
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <BarChart
                data={weeklyTraffic}
                margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border/40"
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="visitors"
                  fill="var(--color-visitors)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="pageviews"
                  fill="var(--color-pageviews)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>منابع ترافیک</CardTitle>
            <CardDescription>بازدیدکنندگان شما از کجا می‌آیند</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sources.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${s.color}`} />
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {s.value}%
                  </span>
                </div>
                <Progress value={s.value} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top pages */}
      <Card>
        <CardHeader>
          <CardTitle>صفحات برتر</CardTitle>
          <CardDescription>پربازدیدترین صفحات این ماه</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {topPages.map((page, i) => (
              <div
                key={page.path}
                className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/50 transition-colors"
              >
                <span className="w-5 text-center text-xs font-medium text-muted-foreground tabular-nums">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-mono truncate">
                  {page.path}
                </span>
                <div className="hidden sm:flex items-center gap-3 w-32">
                  <Progress value={page.pct} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground w-8 text-end">
                    {page.pct}%
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums shrink-0">
                  {page.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
