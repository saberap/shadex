"use client";

import { useMemo } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { DataGrid } from "../data-grid";
import type { DataGridColumnDef } from "../types";
import { type CustomerRecord, generateCustomers } from "./mock-data";

const columns: DataGridColumnDef<CustomerRecord>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: { label: "ID", className: "font-mono text-xs text-muted-foreground" },
    size: 130,
  },
  { accessorKey: "name", header: "Name", meta: { label: "Name" } },
  {
    accessorKey: "email",
    header: "Email",
    meta: { label: "Email", className: "text-muted-foreground" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "secondary"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
    meta: { label: "Status" },
  },
  { accessorKey: "country", header: "Country", meta: { label: "Country" } },
  { accessorKey: "city", header: "City", meta: { label: "City" } },
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
      searchPlaceholder="Search 10,000 rows…"
      density="compact"
    />
  );
}
