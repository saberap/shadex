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

const STATUS_LABEL: Record<CustomerRecord["status"], string> = {
  active: "فعال",
  pending: "در انتظار",
  suspended: "معلق",
  churned: "ریزش‌کرده",
};

const ROLE_LABEL: Record<CustomerRecord["role"], string> = {
  admin: "مدیر",
  manager: "مدیر بخش",
  member: "عضو",
  viewer: "بیننده",
};

const columns: DataGridColumnDef<CustomerRecord>[] = [
  { accessorKey: "name", header: "نام", meta: { label: "نام" } },
  {
    accessorKey: "email",
    header: "ایمیل",
    meta: {
      label: "ایمیل",
      filterType: "text",
      className: "text-muted-foreground",
    },
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => (
      <Badge
        variant={STATUS_VARIANT[row.original.status]}
        className="capitalize"
      >
        {STATUS_LABEL[row.original.status]}
      </Badge>
    ),
    filterFn: (row, columnId, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue<string>(columnId));
    },
    meta: {
      label: "وضعیت",
      filterType: "select",
      filterOptions: [
        { label: "فعال", value: "active" },
        { label: "در انتظار", value: "pending" },
        { label: "معلق", value: "suspended" },
        { label: "ریزش‌کرده", value: "churned" },
      ],
    },
  },
  {
    accessorKey: "role",
    header: "نقش",
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">
        {ROLE_LABEL[row.original.role]}
      </span>
    ),
    filterFn: (row, columnId, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue<string>(columnId));
    },
    meta: {
      label: "نقش",
      filterType: "select",
      filterOptions: [
        { label: "مدیر", value: "admin" },
        { label: "مدیر بخش", value: "manager" },
        { label: "عضو", value: "member" },
        { label: "بیننده", value: "viewer" },
      ],
    },
  },
  {
    accessorKey: "country",
    header: "کشور",
    meta: { label: "کشور", filterType: "text" },
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

export function FilterableTable() {
  const data = useMemo(() => generateCustomers(80, 17), []);

  return (
    <DataGrid
      data={data}
      columns={columns}
      enableSelection={false}
      enableExport={false}
      searchPlaceholder="جستجوی مشتریان…"
    />
  );
}
