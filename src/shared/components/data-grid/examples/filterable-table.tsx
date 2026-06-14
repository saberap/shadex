"use client";

import { useMemo } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { DataGrid } from "../data-grid";
import type { DataGridColumnDef } from "../types";
import {
  type CustomerRecord,
  formatDate,
  generateCustomers,
} from "./mock-data";

const STATUS_VARIANT: Record<
  CustomerRecord["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  pending: "secondary",
  suspended: "destructive",
  churned: "outline",
};

const columns: DataGridColumnDef<CustomerRecord>[] = [
  { accessorKey: "name", header: "Name", meta: { label: "Name" } },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      label: "Email",
      filterType: "text",
      className: "text-muted-foreground",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={STATUS_VARIANT[row.original.status]}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
    filterFn: (row, columnId, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue<string>(columnId));
    },
    meta: {
      label: "Status",
      filterType: "select",
      filterOptions: [
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
        { label: "Suspended", value: "suspended" },
        { label: "Churned", value: "churned" },
      ],
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">
        {row.original.role}
      </span>
    ),
    filterFn: (row, columnId, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue<string>(columnId));
    },
    meta: {
      label: "Role",
      filterType: "select",
      filterOptions: [
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "Member", value: "member" },
        { label: "Viewer", value: "viewer" },
      ],
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    meta: { label: "Country", filterType: "text" },
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

export function FilterableTable() {
  const data = useMemo(() => generateCustomers(80, 17), []);

  return (
    <DataGrid
      data={data}
      columns={columns}
      enableSelection={false}
      enableExport={false}
      searchPlaceholder="Search customers…"
    />
  );
}
