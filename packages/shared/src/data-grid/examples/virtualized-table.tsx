"use client";

import { Badge } from "@repo/ui";
import { useMemo } from "react";
import { DataGrid } from "../data-grid";
import type { DataGridColumnDef } from "../types";
import { type CustomerRecord, generateCustomers } from "./mock-data";

const STATUS_LABEL: Record<CustomerRecord["status"], string> = {
  active: "فعال",
  pending: "در انتظار",
  suspended: "معلق",
  churned: "ریزش‌کرده",
};

const columns: DataGridColumnDef<CustomerRecord>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
    meta: {
      label: "شناسه",
      className: "font-mono text-xs text-muted-foreground",
    },
    size: 130,
  },
  { accessorKey: "name", header: "نام", meta: { label: "نام" } },
  {
    accessorKey: "email",
    header: "ایمیل",
    meta: { label: "ایمیل", className: "text-muted-foreground" },
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "secondary"}
        className="capitalize"
      >
        {STATUS_LABEL[row.original.status]}
      </Badge>
    ),
    meta: { label: "وضعیت" },
  },
  { accessorKey: "country", header: "کشور", meta: { label: "کشور" } },
  { accessorKey: "city", header: "شهر", meta: { label: "شهر" } },
];

export function VirtualizedTable() {
  const data = useMemo(() => generateCustomers(10_000, 51), []);

  return (
    <DataGrid
      data={data}
      columns={columns}
      enableSelection={false}
      enableColumnFilters={false}
      enablePagination={false}
      enableExport={false}
      enableVirtualization
      virtualHeight={560}
      virtualRowHeight={44}
      searchPlaceholder="جستجو در ۱۰٬۰۰۰ ردیف…"
      density="compact"
    />
  );
}
