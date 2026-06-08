"use client";

import { Download, FileSpreadsheet, FileText, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

type ReportStatus = "ready" | "generating" | "failed";

const reports = [
  {
    id: 1,
    name: "Monthly Revenue Report",
    type: "Financial",
    icon: FileSpreadsheet,
    date: "Jun 1, 2026",
    size: "2.4 MB",
    status: "ready" as ReportStatus,
  },
  {
    id: 2,
    name: "User Acquisition Summary",
    type: "Marketing",
    icon: FileText,
    date: "Jun 1, 2026",
    size: "1.1 MB",
    status: "ready" as ReportStatus,
  },
  {
    id: 3,
    name: "Q2 Sales Breakdown",
    type: "Sales",
    icon: FileSpreadsheet,
    date: "May 31, 2026",
    size: "3.8 MB",
    status: "ready" as ReportStatus,
  },
  {
    id: 4,
    name: "Product Performance",
    type: "Product",
    icon: FileText,
    date: "May 28, 2026",
    size: "890 KB",
    status: "ready" as ReportStatus,
  },
  {
    id: 5,
    name: "Weekly Traffic Digest",
    type: "Analytics",
    icon: FileText,
    date: "Jun 7, 2026",
    size: "—",
    status: "generating" as ReportStatus,
  },
  {
    id: 6,
    name: "Subscription Churn Analysis",
    type: "Financial",
    icon: FileSpreadsheet,
    date: "May 20, 2026",
    size: "—",
    status: "failed" as ReportStatus,
  },
];

const statusConfig: Record<ReportStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  ready: { label: "Ready", variant: "default" },
  generating: { label: "Generating…", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
};

const summaryStats = [
  { label: "Total Reports", value: "24" },
  { label: "Generated This Month", value: "6" },
  { label: "Scheduled", value: "3" },
  { label: "Storage Used", value: "48 MB" },
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
              <p className="mt-1 text-2xl font-bold tracking-tight">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Reports</CardTitle>
              <CardDescription className="mt-1">Download or regenerate your reports.</CardDescription>
            </div>
            <Button size="sm" className="gap-1.5 self-start sm:self-auto" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <><RefreshCw className="size-3.5 animate-spin" />Generating…</>
              ) : (
                <><Plus className="size-3.5" />New Report</>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Table header — hidden on mobile */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-2 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Name</span>
            <span>Type</span>
            <span>Date</span>
            <span>Size</span>
            <span>Status</span>
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
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <Badge variant={statusConfig[r.status].variant} className="h-4 px-1 text-[10px]">
                      {statusConfig[r.status].label}
                    </Badge>
                  </div>
                </div>

                {/* Desktop columns */}
                <span className="hidden sm:block text-sm text-muted-foreground w-24 shrink-0">{r.type}</span>
                <span className="hidden sm:block text-sm text-muted-foreground w-24 shrink-0">{r.date}</span>
                <span className="hidden sm:block text-sm text-muted-foreground w-16 shrink-0 text-right">{r.size}</span>
                <div className="hidden sm:flex w-24 justify-center shrink-0">
                  <Badge variant={statusConfig[r.status].variant} className="text-xs">
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
