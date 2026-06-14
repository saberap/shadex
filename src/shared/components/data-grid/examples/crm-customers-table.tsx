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
        header: "Customer",
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
        meta: { label: "Customer", filterType: "text" },
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
        meta: { label: "Role" },
      },
      {
        accessorKey: "country",
        header: "Location",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span>{row.original.country}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.city}
            </span>
          </div>
        ),
        meta: { label: "Location", filterType: "text" },
      },
      {
        accessorKey: "spend",
        header: "Lifetime spend",
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {formatCurrency(row.original.spend)}
          </span>
        ),
        meta: { label: "Lifetime spend", align: "right" },
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
    ],
    [],
  );

  const rowActions: DataGridRowAction<CustomerRecord>[] = [
    {
      label: "View profile",
      icon: <Eye />,
      onClick: (r) => toast(`Opening ${r.name}`),
    },
    {
      label: "Edit customer",
      icon: <Pencil />,
      onClick: (r) => toast(`Editing ${r.name}`),
    },
    {
      label: "Send email",
      icon: <Mail />,
      onClick: (r) => toast(`Composing email to ${r.email}`),
    },
    {
      label: "Suspend account",
      icon: <UserMinus />,
      variant: "destructive",
      separatorBefore: true,
      onClick: (r) =>
        setData((prev) =>
          prev.map((c) => (c.id === r.id ? { ...c, status: "suspended" } : c)),
        ),
    },
    {
      label: "Delete",
      icon: <Trash2 />,
      variant: "destructive",
      onClick: (r) => {
        setData((prev) => prev.filter((c) => c.id !== r.id));
        toast.success(`${r.name} removed`);
      },
    },
  ];

  const bulkActions: DataGridBulkAction<CustomerRecord>[] = [
    {
      label: "Email selected",
      icon: <Mail />,
      onClick: (rows) => toast(`Emailing ${rows.length} customers`),
    },
    {
      label: "Archive",
      icon: <Archive />,
      onClick: (rows) => toast(`Archived ${rows.length} customers`),
    },
    {
      label: "Delete",
      icon: <Trash2 />,
      variant: "destructive",
      onClick: (rows) => {
        const ids = new Set(rows.map((r) => r.id));
        setData((prev) => prev.filter((c) => !ids.has(c.id)));
        toast.success(`Deleted ${rows.length} customers`);
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
      searchPlaceholder="Search by name, email, ID…"
    />
  );
}
