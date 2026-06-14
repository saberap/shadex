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
    title: "CRM customers",
    description:
      "Full-featured customer table with avatars, status, bulk actions and row menus.",
    component: <CrmCustomersTable />,
  },
  {
    value: "finance",
    label: "Finance",
    title: "Invoices",
    description:
      "Invoice ledger with currency formatting, status badges, and per-row actions.",
    component: <FinanceTable />,
  },
  {
    value: "tasks",
    label: "Tasks",
    title: "Project tasks",
    description:
      "Tasks with progress bars, priority and status labels, plus bulk operations.",
    component: <TasksTable />,
  },
  {
    value: "basic",
    label: "Basic",
    title: "Basic table",
    description: "The smallest possible setup — data, columns, search.",
    component: <BasicTable />,
  },
  {
    value: "sorting",
    label: "Sorting",
    title: "Sortable columns",
    description:
      "Multi-column sorting with subtle visual affordance on column hover.",
    component: <SortableTable />,
  },
  {
    value: "filtering",
    label: "Filtering",
    title: "Per-column filters",
    description:
      "Text, select and date filters integrated into each column header.",
    component: <FilterableTable />,
  },
  {
    value: "editable",
    label: "Editable",
    title: "Inline editing",
    description:
      "Click to edit text, number and select cells. Saves are toasted instantly.",
    component: <EditableTable />,
  },
  {
    value: "expandable",
    label: "Expandable",
    title: "Expandable rows",
    description:
      "Open a detail panel inline beneath each row with related metadata.",
    component: <ExpandableTable />,
  },
  {
    value: "virtualized",
    label: "Virtualized",
    title: "Virtualized 10k rows",
    description:
      "TanStack Virtual handles 10,000 rows with sub-millisecond scrolling.",
    component: <VirtualizedTable />,
  },
  {
    value: "server",
    label: "Server-side",
    title: "Server-side mode",
    description:
      "Backed by /api/customers with manual pagination, sorting and filtering.",
    component: <ServerSideTable />,
  },
  {
    value: "url",
    label: "URL sync",
    title: "URL-synced state",
    description:
      "Page, search and sort persist in the address bar — refresh-safe.",
    component: <UrlSyncTable />,
  },
];

export function DataGridShowcaseFeature() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <header className="flex flex-col gap-1.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Component
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">DataGrid</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A production-grade DataGrid built on shadcn/ui, TanStack Table, Query
          and Virtual. Sorting, filtering, virtualization, inline editing,
          expandable rows, server-side mode and URL sync — all in one composable
          component.
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
