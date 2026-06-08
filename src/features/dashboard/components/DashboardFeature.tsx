"use client";

import { Download, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { AnalyticsContent } from "./AnalyticsContent";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { NotificationsContent } from "./NotificationsContent";
import { RecentSales } from "./RecentSales";
import { ReportsContent } from "./ReportsContent";
import { RevenueChart } from "./RevenueChart";
import { StatsCards } from "./StatsCards";

export function DashboardFeature() {
  const [tab, setTab] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">

            {/* Page title */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Welcome back, Saber. Here&apos;s what&apos;s happening today.
                </p>
              </div>
              <Button size="sm" className="gap-1.5 self-start sm:self-auto shrink-0">
                <Download className="size-3.5" />
                Export
              </Button>
            </div>

            {/* Tabs — fix: remove overflow wrapper; TabsList is inline-flex w-fit by default */}
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="h-9">
                <TabsTrigger value="overview" className="text-xs px-3">Overview</TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs px-3">Analytics</TabsTrigger>
                <TabsTrigger value="reports" className="text-xs px-3">Reports</TabsTrigger>
                <TabsTrigger value="notifications" className="text-xs px-3">Notifications</TabsTrigger>
              </TabsList>

              {/* ── Overview ── */}
              <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4">
                <StatsCards />

                <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
                  <Card className="xl:col-span-3">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle>Revenue Overview</CardTitle>
                          <CardDescription className="mt-1">
                            Revenue vs expenses — January to December
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                          <TrendingUp className="size-3" />
                          +12.5%
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="size-2.5 rounded-full bg-chart-5" />
                          Revenue
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="size-2.5 rounded-full bg-chart-2" />
                          Expenses
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <RevenueChart />
                    </CardContent>
                  </Card>

                  <Card className="xl:col-span-2">
                    <CardHeader>
                      <CardTitle>Recent Sales</CardTitle>
                      <CardDescription>You made 265 sales this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentSales />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ── Analytics ── */}
              <TabsContent value="analytics" className="mt-4">
                <AnalyticsContent />
              </TabsContent>

              {/* ── Reports ── */}
              <TabsContent value="reports" className="mt-4">
                <ReportsContent />
              </TabsContent>

              {/* ── Notifications ── */}
              <TabsContent value="notifications" className="mt-4">
                <NotificationsContent />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
