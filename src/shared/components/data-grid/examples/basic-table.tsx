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
    header: "ID",
    meta: { label: "ID", className: "font-mono text-xs text-muted-foreground" },
  },
  { accessorKey: "name", header: "Name", meta: { label: "Name" } },
  {
    accessorKey: "email",
    header: "Email",
    meta: { label: "Email", className: "text-muted-foreground" },
  },
  { accessorKey: "country", header: "Country", meta: { label: "Country" } },
  { accessorKey: "city", header: "City", meta: { label: "City" } },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    meta: { label: "Created" },
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
      searchPlaceholder="Search customers…"
    />
  );
}
