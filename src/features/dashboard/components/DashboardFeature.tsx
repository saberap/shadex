"use client";

import { Download, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
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
import { AnalyticsContent } from "./AnalyticsContent";
import { NotificationsContent } from "./NotificationsContent";
import { RecentSales } from "./RecentSales";
import { ReportsContent } from "./ReportsContent";
import { RevenueChart } from "./RevenueChart";
import { StatsCards } from "./StatsCards";

export function DashboardFeature() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            داشبورد
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            خوش آمدید، صابر. این چیزی است که امروز در حال رخ دادن است.
          </p>
        </div>
        <Button size="sm" className="shrink-0 gap-1.5 self-start sm:self-auto">
          <Download className="size-3.5" />
          خروجی گرفتن
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-9">
          <TabsTrigger value="overview" className="px-3 text-xs">
            نمای کلی
          </TabsTrigger>
          <TabsTrigger value="analytics" className="px-3 text-xs">
            تحلیل‌ها
          </TabsTrigger>
          <TabsTrigger value="reports" className="px-3 text-xs">
            گزارش‌ها
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-3 text-xs">
            اعلان‌ها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4 sm:space-y-6">
          <StatsCards />

          <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-3">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle>نمای کلی درآمد</CardTitle>
                    <CardDescription className="mt-1">
                      درآمد در برابر هزینه‌ها — ژانویه تا دسامبر
                    </CardDescription>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <TrendingUp className="size-3" />
                    +12.5%
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-2.5 rounded-full bg-chart-5" />
                    درآمد
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-2.5 rounded-full bg-chart-2" />
                    هزینه‌ها
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <RevenueChart />
              </CardContent>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>فروش‌های اخیر</CardTitle>
                <CardDescription>
                  شما در این ماه ۲۶۵ فروش داشته‌اید.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <AnalyticsContent />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ReportsContent />
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <NotificationsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
