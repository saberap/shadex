"use client";

import { useMemo } from "react";
import { DataGrid } from "../data-grid";
import type { DataGridColumnDef } from "../types";
import {
  type CustomerRecord,
  formatDate,
  generateCustomers,
} from "./mock-data";

const columns: DataGridColumnDef<CustomerRecord>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
    meta: { label: "شناسه", className: "font-mono text-xs text-muted-foreground" },
  },
  { accessorKey: "name", header: "نام", meta: { label: "نام" } },
  {
    accessorKey: "email",
    header: "ایمیل",
    meta: { label: "ایمیل", className: "text-muted-foreground" },
  },
  { accessorKey: "country", header: "کشور", meta: { label: "کشور" } },
  { accessorKey: "city", header: "شهر", meta: { label: "شهر" } },
  {
    accessorKey: "createdAt",
    header: "تاریخ ایجاد",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    meta: { label: "تاریخ ایجاد" },
  },
];

export function BasicTable() {
  const data = useMemo(() => generateCustomers(28), []);

  return (
    <DataGrid
      data={data}
      columns={columns}
      enableSelection={false}
      enableColumnFilters={false}
      enableExport={false}
      enableSorting={false}
      searchPlaceholder="جستجوی مشتریان…"
    />
  );
}
