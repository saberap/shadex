"use client";

import { CheckCheck, Eye, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { DataGrid } from "../data-grid";
import type {
  DataGridBulkAction,
  DataGridColumnDef,
  DataGridRowAction,
} from "../types";
import { formatDate, generateTasks, type TaskRecord } from "./mock-data";

const STATUS_VARIANT: Record<
  TaskRecord["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  todo: "outline",
  in_progress: "secondary",
  review: "default",
  done: "default",
};

const PRIORITY_VARIANT: Record<
  TaskRecord["priority"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  low: "outline",
  medium: "secondary",
  high: "default",
  urgent: "destructive",
};

const STATUS_LABEL: Record<TaskRecord["status"], string> = {
  todo: "Todo",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
};

export function TasksTable() {
  const [data, setData] = useState<TaskRecord[]>(() => generateTasks(120, 79));

  const columns = useMemo<DataGridColumnDef<TaskRecord>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        meta: {
          label: "ID",
          className: "font-mono text-xs text-muted-foreground",
        },
        size: 110,
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title}</span>
        ),
        meta: { label: "Title", filterType: "text" },
      },
      {
        accessorKey: "assignee",
        header: "Assignee",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.assignee}</span>
        ),
        meta: { label: "Assignee" },
      },
      {
        accessorKey: "status",
        header: "Status",
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
          label: "Status",
          filterType: "select",
          filterOptions: [
            { label: "Todo", value: "todo" },
            { label: "In progress", value: "in_progress" },
            { label: "Review", value: "review" },
            { label: "Done", value: "done" },
          ],
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <Badge
            variant={PRIORITY_VARIANT[row.original.priority]}
            className="capitalize"
          >
            {row.original.priority}
          </Badge>
        ),
        filterFn: (row, id, value) => {
          if (!Array.isArray(value) || value.length === 0) return true;
          return value.includes(row.getValue<string>(id));
        },
        meta: {
          label: "Priority",
          filterType: "select",
          filterOptions: [
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
            { label: "Urgent", value: "urgent" },
          ],
        },
      },
      {
        accessorKey: "labels",
        header: "Labels",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.labels.map((label) => (
              <Badge key={label} variant="outline" className="text-[10px]">
                {label}
              </Badge>
            ))}
          </div>
        ),
        enableSorting: false,
        meta: { label: "Labels" },
      },
      {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress value={row.original.progress} className="h-1.5 w-24" />
            <span className="text-xs tabular-nums text-muted-foreground">
              {row.original.progress}%
            </span>
          </div>
        ),
        meta: { label: "Progress" },
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
    ],
    [],
  );

  const rowActions: DataGridRowAction<TaskRecord>[] = [
    {
      label: "View task",
      icon: <Eye />,
      onClick: (r) => toast(`Opening ${r.id}`),
    },
    {
      label: "Edit",
      icon: <Pencil />,
      onClick: (r) => toast(`Editing ${r.id}`),
    },
    {
      label: "Mark done",
      icon: <CheckCheck />,
      onClick: (r) =>
        setData((prev) =>
          prev.map((t) =>
            t.id === r.id ? { ...t, status: "done", progress: 100 } : t,
          ),
        ),
    },
    {
      label: "Delete",
      icon: <Trash2 />,
      variant: "destructive",
      separatorBefore: true,
      onClick: (r) => {
        setData((prev) => prev.filter((t) => t.id !== r.id));
        toast.success(`${r.id} deleted`);
      },
    },
  ];

  const bulkActions: DataGridBulkAction<TaskRecord>[] = [
    {
      label: "Mark done",
      icon: <CheckCheck />,
      onClick: (rows) => {
        const ids = new Set(rows.map((r) => r.id));
        setData((prev) =>
          prev.map((t) =>
            ids.has(t.id) ? { ...t, status: "done", progress: 100 } : t,
          ),
        );
        toast.success(`Marked ${rows.length} tasks as done`);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 />,
      variant: "destructive",
      onClick: (rows) => {
        const ids = new Set(rows.map((r) => r.id));
        setData((prev) => prev.filter((t) => !ids.has(t.id)));
        toast.success(`Deleted ${rows.length} tasks`);
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
      searchPlaceholder="Search tasks…"
      density="compact"
    />
  );
}
