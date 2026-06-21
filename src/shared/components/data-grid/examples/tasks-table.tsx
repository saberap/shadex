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
  todo: "انجام‌نشده",
  in_progress: "در حال انجام",
  review: "بررسی",
  done: "انجام‌شده",
};

const PRIORITY_LABEL: Record<TaskRecord["priority"], string> = {
  low: "پایین",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
};

export function TasksTable() {
  const [data, setData] = useState<TaskRecord[]>(() => generateTasks(120, 79));

  const columns = useMemo<DataGridColumnDef<TaskRecord>[]>(
    () => [
      {
        accessorKey: "id",
        header: "شناسه",
        meta: {
          label: "شناسه",
          className: "font-mono text-xs text-muted-foreground",
        },
        size: 110,
      },
      {
        accessorKey: "title",
        header: "عنوان",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title}</span>
        ),
        meta: { label: "عنوان", filterType: "text" },
      },
      {
        accessorKey: "assignee",
        header: "مسئول",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.assignee}</span>
        ),
        meta: { label: "مسئول" },
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
            { label: "انجام‌نشده", value: "todo" },
            { label: "در حال انجام", value: "in_progress" },
            { label: "بررسی", value: "review" },
            { label: "انجام‌شده", value: "done" },
          ],
        },
      },
      {
        accessorKey: "priority",
        header: "اولویت",
        cell: ({ row }) => (
          <Badge
            variant={PRIORITY_VARIANT[row.original.priority]}
            className="capitalize"
          >
            {PRIORITY_LABEL[row.original.priority]}
          </Badge>
        ),
        filterFn: (row, id, value) => {
          if (!Array.isArray(value) || value.length === 0) return true;
          return value.includes(row.getValue<string>(id));
        },
        meta: {
          label: "اولویت",
          filterType: "select",
          filterOptions: [
            { label: "پایین", value: "low" },
            { label: "متوسط", value: "medium" },
            { label: "بالا", value: "high" },
            { label: "فوری", value: "urgent" },
          ],
        },
      },
      {
        accessorKey: "labels",
        header: "برچسب‌ها",
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
        meta: { label: "برچسب‌ها" },
      },
      {
        accessorKey: "progress",
        header: "پیشرفت",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress value={row.original.progress} className="h-1.5 w-24" />
            <span className="text-xs tabular-nums text-muted-foreground">
              {row.original.progress}%
            </span>
          </div>
        ),
        meta: { label: "پیشرفت" },
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
    ],
    [],
  );

  const rowActions: DataGridRowAction<TaskRecord>[] = [
    {
      label: "مشاهده وظیفه",
      icon: <Eye />,
      onClick: (r) => toast(`در حال باز کردن ${r.id}`),
    },
    {
      label: "ویرایش",
      icon: <Pencil />,
      onClick: (r) => toast(`در حال ویرایش ${r.id}`),
    },
    {
      label: "علامت‌گذاری به‌عنوان انجام‌شده",
      icon: <CheckCheck />,
      onClick: (r) =>
        setData((prev) =>
          prev.map((t) =>
            t.id === r.id ? { ...t, status: "done", progress: 100 } : t,
          ),
        ),
    },
    {
      label: "حذف",
      icon: <Trash2 />,
      variant: "destructive",
      separatorBefore: true,
      onClick: (r) => {
        setData((prev) => prev.filter((t) => t.id !== r.id));
        toast.success(`${r.id} حذف شد`);
      },
    },
  ];

  const bulkActions: DataGridBulkAction<TaskRecord>[] = [
    {
      label: "علامت‌گذاری به‌عنوان انجام‌شده",
      icon: <CheckCheck />,
      onClick: (rows) => {
        const ids = new Set(rows.map((r) => r.id));
        setData((prev) =>
          prev.map((t) =>
            ids.has(t.id) ? { ...t, status: "done", progress: 100 } : t,
          ),
        );
        toast.success(`${rows.length} وظیفه به‌عنوان انجام‌شده علامت‌گذاری شد`);
      },
    },
    {
      label: "حذف",
      icon: <Trash2 />,
      variant: "destructive",
      onClick: (rows) => {
        const ids = new Set(rows.map((r) => r.id));
        setData((prev) => prev.filter((t) => !ids.has(t.id)));
        toast.success(`${rows.length} وظیفه حذف شد`);
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
      searchPlaceholder="جستجوی وظایف…"
      density="compact"
    />
  );
}
