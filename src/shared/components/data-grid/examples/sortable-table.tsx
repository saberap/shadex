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
  { accessorKey: "name", header: "Customer", meta: { label: "Customer" } },
  {
    accessorKey: "email",
    header: "Email",
    meta: { label: "Email", className: "text-muted-foreground" },
  },
  { accessorKey: "country", header: "Country", meta: { label: "Country" } },
  {
    accessorKey: "spend",
    header: "Lifetime spend",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.original.spend)}
      </span>
    ),
    meta: { label: "Lifetime spend", align: "right" },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    meta: { label: "Joined" },
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
      searchPlaceholder="Search by name, email…"
    />
  );
}
