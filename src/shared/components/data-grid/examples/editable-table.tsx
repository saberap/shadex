"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { DataGrid } from "../data-grid";
import { DataGridEditableCell } from "../data-grid-editable-cell";
import type { DataGridColumnDef } from "../types";
import { type CustomerRecord, generateCustomers } from "./mock-data";

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Member", value: "member" },
  { label: "Viewer", value: "viewer" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Churned", value: "churned" },
];

const STATUS_VARIANT: Record<
  CustomerRecord["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  pending: "secondary",
  suspended: "destructive",
  churned: "outline",
};

export function EditableTable() {
  const [data, setData] = useState<CustomerRecord[]>(() =>
    generateCustomers(24, 23),
  );

  const updateCell = useCallback(
    (id: string, field: keyof CustomerRecord, value: unknown) => {
      setData((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, [field]: value as never } : row,
        ),
      );
      toast.success("Cell updated", {
        description: `Saved ${String(field)} for ${id}.`,
      });
    },
    [],
  );

  const columns = useMemo<DataGridColumnDef<CustomerRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <DataGridEditableCell
            value={row.original.name}
            type="text"
            onCommit={(v) => updateCell(row.original.id, "name", v)}
          />
        ),
        meta: { label: "Name" },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <DataGridEditableCell
            value={row.original.email}
            type="text"
            onCommit={(v) => updateCell(row.original.id, "email", v)}
          />
        ),
        meta: { label: "Email", className: "text-muted-foreground" },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <DataGridEditableCell
            value={row.original.role}
            type="select"
            options={ROLE_OPTIONS}
            display={
              <span className="capitalize text-muted-foreground">
                {row.original.role}
              </span>
            }
            onCommit={(v) => updateCell(row.original.id, "role", v)}
          />
        ),
        meta: { label: "Role" },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <DataGridEditableCell
            value={row.original.status}
            type="select"
            options={STATUS_OPTIONS}
            display={
              <Badge
                variant={STATUS_VARIANT[row.original.status]}
                className="capitalize"
              >
                {row.original.status}
              </Badge>
            }
            onCommit={(v) => updateCell(row.original.id, "status", v)}
          />
        ),
        meta: { label: "Status" },
      },
      {
        accessorKey: "spend",
        header: "Lifetime spend",
        cell: ({ row }) => (
          <DataGridEditableCell
            value={row.original.spend}
            type="number"
            align="right"
            display={
              <span className="font-medium tabular-nums">
                ${row.original.spend.toLocaleString()}
              </span>
            }
            onCommit={(v) => updateCell(row.original.id, "spend", v)}
          />
        ),
        meta: { label: "Lifetime spend", align: "right" },
      },
    ],
    [updateCell],
  );

  return (
    <DataGrid
      data={data}
      columns={columns}
      enableSelection={false}
      enableColumnFilters={false}
      enableExport={false}
      searchPlaceholder="Search to edit…"
    />
  );
}
