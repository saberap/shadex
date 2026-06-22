"use client";

import { Badge } from "@repo/ui";
import { Download, Eye, FileText, Send } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { DataGrid } from "../data-grid";
import type { DataGridColumnDef, DataGridRowAction } from "../types";
import {
  formatCurrency,
  formatDate,
  generateInvoices,
  type InvoiceRecord,
} from "./mock-data";

const STATUS_VARIANT: Record<
  InvoiceRecord["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  paid: "default",
  open: "secondary",
  overdue: "destructive",
  draft: "outline",
};

const METHOD_LABEL: Record<InvoiceRecord["method"], string> = {
  card: "کارت",
  wire: "حواله",
  ach: "ACH",
  paypal: "پی‌پال",
};

const STATUS_LABEL: Record<InvoiceRecord["status"], string> = {
  paid: "پرداخت‌شده",
  open: "باز",
  overdue: "سررسید گذشته",
  draft: "پیش‌نویس",
};

const columns: DataGridColumnDef<InvoiceRecord>[] = [
  {
    accessorKey: "invoice",
    header: "فاکتور",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.invoice}</span>
    ),
    meta: { label: "فاکتور", filterType: "text" },
  },
  {
    accessorKey: "customer",
    header: "مشتری",
    meta: { label: "مشتری", filterType: "text" },
  },
  {
    accessorKey: "amount",
    header: "مبلغ",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.original.amount, row.original.currency)}
      </span>
    ),
    meta: { label: "مبلغ", align: "right" },
  },
  {
    accessorKey: "method",
    header: "روش پرداخت",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {METHOD_LABEL[row.original.method]}
      </span>
    ),
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue<string>(id));
    },
    meta: {
      label: "روش پرداخت",
      filterType: "select",
      filterOptions: [
        { label: "کارت", value: "card" },
        { label: "حواله", value: "wire" },
        { label: "ACH", value: "ach" },
        { label: "پی‌پال", value: "paypal" },
      ],
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
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue<string>(id));
    },
    meta: {
      label: "وضعیت",
      filterType: "select",
      filterOptions: [
        { label: "پرداخت‌شده", value: "paid" },
        { label: "باز", value: "open" },
        { label: "سررسید گذشته", value: "overdue" },
        { label: "پیش‌نویس", value: "draft" },
      ],
    },
  },
  {
    accessorKey: "issuedAt",
    header: "تاریخ صدور",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.issuedAt)}
      </span>
    ),
    meta: { label: "تاریخ صدور" },
  },
  {
    accessorKey: "dueAt",
    header: "سررسید",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.dueAt)}
      </span>
    ),
    meta: { label: "سررسید" },
  },
];

const rowActions: DataGridRowAction<InvoiceRecord>[] = [
  {
    label: "مشاهده فاکتور",
    icon: <Eye />,
    onClick: (r) => toast(`در حال باز کردن ${r.invoice}`),
  },
  {
    label: "ارسال یادآور",
    icon: <Send />,
    onClick: (r) => toast.success(`یادآور برای ${r.invoice} ارسال شد`),
  },
  {
    label: "دانلود PDF",
    icon: <FileText />,
    onClick: (r) => toast(`در حال دانلود ${r.invoice}.pdf`),
  },
];

export function FinanceTable() {
  const data = useMemo(() => generateInvoices(180, 73), []);

  return (
    <DataGrid
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={rowActions}
      bulkActions={[
        {
          label: "خروجی گرفتن",
          icon: <Download />,
          onClick: (rows) => toast(`در حال خروجی گرفتن ${rows.length} فاکتور`),
        },
      ]}
      searchPlaceholder="جستجوی فاکتورها، مشتریان…"
      initialSorting={[{ id: "issuedAt", desc: true }]}
    />
  );
}
