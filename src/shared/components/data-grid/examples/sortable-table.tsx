"use client";

import { useMemo } from "react";
import { DataGrid } from "../data-grid";
import type { DataGridColumnDef } from "../types";
import {
  type CustomerRecord,
  formatCurrency,
  formatDate,
  generateCustomers,
} from "./mock-data";

const columns: DataGridColumnDef<CustomerRecord>[] = [
  { accessorKey: "name", header: "مشتری", meta: { label: "مشتری" } },
  {
    accessorKey: "email",
    header: "ایمیل",
    meta: { label: "ایمیل", className: "text-muted-foreground" },
  },
  { accessorKey: "country", header: "کشور", meta: { label: "کشور" } },
  {
    accessorKey: "spend",
    header: "هزینه‌کرد کل",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.original.spend)}
      </span>
    ),
    meta: { label: "هزینه‌کرد کل", align: "right" },
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ عضویت",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    meta: { label: "تاریخ عضویت" },
  },
];

export function SortableTable() {
  const data = useMemo(() => generateCustomers(60, 11), []);

  return (
    <DataGrid
      data={data}
      columns={columns}
      enableSelection={false}
      enableColumnFilters={false}
      enableExport={false}
      initialSorting={[{ id: "spend", desc: true }]}
      searchPlaceholder="جستجو بر اساس نام، ایمیل…"
    />
  );
}
