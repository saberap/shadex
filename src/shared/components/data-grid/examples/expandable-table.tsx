"use client";

import { useMemo } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { DataGrid } from "../data-grid";
import type { DataGridColumnDef } from "../types";
import {
  type CustomerRecord,
  formatCurrency,
  formatDate,
  generateCustomers,
} from "./mock-data";

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
  {
    accessorKey: "spend",
    header: "هزینه‌کرد",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.original.spend)}
      </span>
    ),
    meta: { label: "هزینه‌کرد", align: "right" },
  },
];

function CustomerDetail({ row }: { row: CustomerRecord }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          تماس
        </p>
        <Separator className="my-2" />
        <dl className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">ایمیل</dt>
            <dd className="font-medium">{row.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">تلفن</dt>
            <dd className="font-mono text-xs">{row.phone}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">شناسه مشتری</dt>
            <dd className="font-mono text-xs text-muted-foreground">
              {row.id}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          موقعیت
        </p>
        <Separator className="my-2" />
        <dl className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">کشور</dt>
            <dd>{row.country}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">شهر</dt>
            <dd>{row.city}</dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          حساب کاربری
        </p>
        <Separator className="my-2" />
        <dl className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">نقش</dt>
            <dd className="capitalize">{ROLE_LABEL[row.role]}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">تاریخ عضویت</dt>
            <dd>{formatDate(row.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">هزینه‌کرد کل</dt>
            <dd className="font-medium">{formatCurrency(row.spend)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function ExpandableTable() {
  const data = useMemo(() => generateCustomers(30, 41), []);

  return (
    <DataGrid
      data={data}
      columns={columns}
      enableSelection={false}
      enableColumnFilters={false}
      enableExport={false}
      renderSubRow={(row) => <CustomerDetail row={row} />}
      searchPlaceholder="جستجو…"
    />
  );
}
