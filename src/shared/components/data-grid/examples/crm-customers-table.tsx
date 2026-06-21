"use client";

import { Archive, Eye, Mail, Pencil, Trash2, UserMinus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { DataGrid } from "../data-grid";
import type {
  DataGridBulkAction,
  DataGridColumnDef,
  DataGridRowAction,
} from "../types";
import {
  type CustomerRecord,
  formatCurrency,
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

function initials(name: string) {
  const [first, last] = name.split(" ");
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

export function CrmCustomersTable() {
  const [data, setData] = useState<CustomerRecord[]>(() =>
    generateCustomers(420, 67),
  );

  const columns = useMemo<DataGridColumnDef<CustomerRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: "مشتری",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {initials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{row.original.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
        meta: { label: "مشتری", filterType: "text" },
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
        meta: { label: "نقش" },
      },
      {
        accessorKey: "country",
        header: "موقعیت",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span>{row.original.country}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.city}
            </span>
          </div>
        ),
        meta: { label: "موقعیت", filterType: "text" },
      },
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
    ],
    [],
  );

  const rowActions: DataGridRowAction<CustomerRecord>[] = [
    {
      label: "مشاهده پروفایل",
      icon: <Eye />,
      onClick: (r) => toast(`در حال باز کردن ${r.name}`),
    },
    {
      label: "ویرایش مشتری",
      icon: <Pencil />,
      onClick: (r) => toast(`در حال ویرایش ${r.name}`),
    },
    {
      label: "ارسال ایمیل",
      icon: <Mail />,
      onClick: (r) => toast(`نوشتن ایمیل به ${r.email}`),
    },
    {
      label: "معلق کردن حساب",
      icon: <UserMinus />,
      variant: "destructive",
      separatorBefore: true,
      onClick: (r) =>
        setData((prev) =>
          prev.map((c) => (c.id === r.id ? { ...c, status: "suspended" } : c)),
        ),
    },
    {
      label: "حذف",
      icon: <Trash2 />,
      variant: "destructive",
      onClick: (r) => {
        setData((prev) => prev.filter((c) => c.id !== r.id));
        toast.success(`${r.name} حذف شد`);
      },
    },
  ];

  const bulkActions: DataGridBulkAction<CustomerRecord>[] = [
    {
      label: "ارسال ایمیل به انتخاب‌شده‌ها",
      icon: <Mail />,
      onClick: (rows) => toast(`ارسال ایمیل به ${rows.length} مشتری`),
    },
    {
      label: "بایگانی",
      icon: <Archive />,
      onClick: (rows) => toast(`${rows.length} مشتری بایگانی شد`),
    },
    {
      label: "حذف",
      icon: <Trash2 />,
      variant: "destructive",
      onClick: (rows) => {
        const ids = new Set(rows.map((r) => r.id));
        setData((prev) => prev.filter((c) => !ids.has(c.id)));
        toast.success(`${rows.length} مشتری حذف شد`);
      },
    },
  ];

  return (
    <DataGrid
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={rowActions}
      bulkActions={bulkActions}
      initialPageSize={20}
      searchPlaceholder="جستجو بر اساس نام، ایمیل، شناسه…"
    />
  );
}
