"use client";

import { Download, Eye, FileText, Send } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
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
  card: "Card",
  wire: "Wire",
  ach: "ACH",
  paypal: "PayPal",
};

const columns: DataGridColumnDef<InvoiceRecord>[] = [
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.invoice}</span>
    ),
    meta: { label: "Invoice", filterType: "text" },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    meta: { label: "Customer", filterType: "text" },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.original.amount, row.original.currency)}
      </span>
    ),
    meta: { label: "Amount", align: "right" },
  },
  {
    accessorKey: "method",
    header: "Method",
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
      label: "Method",
      filterType: "select",
      filterOptions: [
        { label: "Card", value: "card" },
        { label: "Wire", value: "wire" },
        { label: "ACH", value: "ach" },
        { label: "PayPal", value: "paypal" },
      ],
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
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue<string>(id));
    },
    meta: {
      label: "Status",
      filterType: "select",
      filterOptions: [
        { label: "Paid", value: "paid" },
        { label: "Open", value: "open" },
        { label: "Overdue", value: "overdue" },
        { label: "Draft", value: "draft" },
      ],
    },
  },
  {
    accessorKey: "issuedAt",
    header: "Issued",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.issuedAt)}
      </span>
    ),
    meta: { label: "Issued" },
  },
  {
    accessorKey: "dueAt",
    header: "Due",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.dueAt)}
      </span>
    ),
    meta: { label: "Due" },
  },
];

const rowActions: DataGridRowAction<InvoiceRecord>[] = [
  {
    label: "View invoice",
    icon: <Eye />,
    onClick: (r) => toast(`Opening ${r.invoice}`),
  },
  {
    label: "Send reminder",
    icon: <Send />,
    onClick: (r) => toast.success(`Reminder sent for ${r.invoice}`),
  },
  {
    label: "Download PDF",
    icon: <FileText />,
    onClick: (r) => toast(`Downloading ${r.invoice}.pdf`),
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
          label: "Export",
          icon: <Download />,
          onClick: (rows) => toast(`Exporting ${rows.length} invoices`),
        },
      ]}
      searchPlaceholder="Search invoices, customers…"
      initialSorting={[{ id: "issuedAt", desc: true }]}
    />
  );
}
