"use client";

import { Badge } from "@repo/ui";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataGrid } from "../data-grid";
import { DataGridEditableCell } from "../data-grid-editable-cell";
import type { DataGridColumnDef } from "../types";
import { type CustomerRecord, generateCustomers } from "./mock-data";

const ROLE_OPTIONS = [
  { label: "مدیر", value: "admin" },
  { label: "مدیر بخش", value: "manager" },
  { label: "عضو", value: "member" },
  { label: "بیننده", value: "viewer" },
];

const STATUS_OPTIONS = [
  { label: "فعال", value: "active" },
  { label: "در انتظار", value: "pending" },
  { label: "معلق", value: "suspended" },
  { label: "ریزش‌کرده", value: "churned" },
];

const ROLE_LABEL: Record<CustomerRecord["role"], string> = {
  admin: "مدیر",
  manager: "مدیر بخش",
  member: "عضو",
  viewer: "بیننده",
};

const STATUS_LABEL: Record<CustomerRecord["status"], string> = {
  active: "فعال",
  pending: "در انتظار",
  suspended: "معلق",
  churned: "ریزش‌کرده",
};

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
      toast.success("سلول به‌روزرسانی شد", {
        description: `${String(field)} برای ${id} ذخیره شد.`,
      });
    },
    [],
  );

  const columns = useMemo<DataGridColumnDef<CustomerRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: "نام",
        cell: ({ row }) => (
          <DataGridEditableCell
            value={row.original.name}
            type="text"
            onCommit={(v) => updateCell(row.original.id, "name", v)}
          />
        ),
        meta: { label: "نام" },
      },
      {
        accessorKey: "email",
        header: "ایمیل",
        cell: ({ row }) => (
          <DataGridEditableCell
            value={row.original.email}
            type="text"
            onCommit={(v) => updateCell(row.original.id, "email", v)}
          />
        ),
        meta: { label: "ایمیل", className: "text-muted-foreground" },
      },
      {
        accessorKey: "role",
        header: "نقش",
        cell: ({ row }) => (
          <DataGridEditableCell
            value={row.original.role}
            type="select"
            options={ROLE_OPTIONS}
            display={
              <span className="capitalize text-muted-foreground">
                {ROLE_LABEL[row.original.role]}
              </span>
            }
            onCommit={(v) => updateCell(row.original.id, "role", v)}
          />
        ),
        meta: { label: "نقش" },
      },
      {
        accessorKey: "status",
        header: "وضعیت",
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
                {STATUS_LABEL[row.original.status]}
              </Badge>
            }
            onCommit={(v) => updateCell(row.original.id, "status", v)}
          />
        ),
        meta: { label: "وضعیت" },
      },
      {
        accessorKey: "spend",
        header: "هزینه‌کرد کل",
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
        meta: { label: "هزینه‌کرد کل", align: "right" },
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
      searchPlaceholder="برای ویرایش جستجو کنید…"
    />
  );
}
