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

const columns: DataGridColumnDef<CustomerRecord>[] = [
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
  {
    accessorKey: "spend",
    header: "Spend",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.original.spend)}
      </span>
    ),
    meta: { label: "Spend", align: "right" },
  },
];

function CustomerDetail({ row }: { row: CustomerRecord }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Contact
        </p>
        <Separator className="my-2" />
        <dl className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{row.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-mono text-xs">{row.phone}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Customer ID</dt>
            <dd className="font-mono text-xs text-muted-foreground">
              {row.id}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Location
        </p>
        <Separator className="my-2" />
        <dl className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Country</dt>
            <dd>{row.country}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">City</dt>
            <dd>{row.city}</dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Account
        </p>
        <Separator className="my-2" />
        <dl className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="capitalize">{row.role}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Joined</dt>
            <dd>{formatDate(row.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Lifetime spend</dt>
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
      searchPlaceholder="Search…"
    />
  );
}
