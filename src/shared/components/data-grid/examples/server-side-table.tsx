"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Eye, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { DataGrid } from "../data-grid";
import type {
  DataGridColumnDef,
  DataGridFiltersState,
  DataGridPaginationState,
  DataGridRowAction,
  DataGridSortingState,
} from "../index";
import { buildQueryString } from "../utils/query-builder";
import { formatDate } from "./mock-data";

type ApiCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "suspended" | "churned";
  role: "admin" | "manager" | "member" | "viewer";
  country: string;
  city: string;
  createdAt: string;
};

type ApiResponse = {
  data: ApiCustomer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const STATUS_VARIANT: Record<
  ApiCustomer["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  pending: "secondary",
  suspended: "destructive",
  churned: "outline",
};

const STATUS_LABEL: Record<ApiCustomer["status"], string> = {
  active: "فعال",
  pending: "در انتظار",
  suspended: "معلق",
  churned: "ریزش‌کرده",
};

const ROLE_LABEL: Record<ApiCustomer["role"], string> = {
  admin: "مدیر",
  manager: "مدیر بخش",
  member: "عضو",
  viewer: "بیننده",
};

function initials(name: string) {
  const [first, last] = name.split(" ");
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

export function ServerSideTable() {
  const [pagination, setPagination] = useState<DataGridPaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<DataGridSortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [filters, setFilters] = useState<DataGridFiltersState>([]);
  const [search, setSearch] = useState("");

  const queryString = useMemo(
    () =>
      buildQueryString({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        filters,
        search,
      }),
    [pagination, sorting, filters, search],
  );

  const query = useQuery<ApiResponse>({
    queryKey: ["customers", queryString],
    queryFn: async () => {
      const res = await fetch(`/api/customers?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch customers");
      return (await res.json()) as ApiResponse;
    },
    placeholderData: keepPreviousData,
  });

  const columns = useMemo<DataGridColumnDef<ApiCustomer>[]>(
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
        meta: { label: "مشتری" },
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
        meta: { label: "کشور" },
      },
      {
        accessorKey: "city",
        header: "شهر",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.city}</span>
        ),
        meta: { label: "شهر" },
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

  const rowActions: DataGridRowAction<ApiCustomer>[] = [
    { label: "مشاهده", icon: <Eye />, onClick: (r) => toast(`باز کردن ${r.name}`) },
    {
      label: "حذف",
      icon: <Trash2 />,
      variant: "destructive",
      separatorBefore: true,
      onClick: (r) => toast.success(`${r.name} برای حذف علامت‌گذاری شد`),
    },
  ];

  return (
    <DataGrid
      serverSide
      data={query.data?.data ?? []}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={rowActions}
      totalRows={query.data?.total ?? 0}
      pageIndex={pagination.pageIndex}
      pageSize={pagination.pageSize}
      sorting={sorting}
      filters={filters}
      search={search}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      onFiltersChange={setFilters}
      onSearchChange={(s) => {
        setSearch(s);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      }}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      isError={query.isError}
      onRetry={() => query.refetch()}
      searchPlaceholder="جستجوی ۱٬۲۰۰ مشتری از طریق API…"
    />
  );
}
