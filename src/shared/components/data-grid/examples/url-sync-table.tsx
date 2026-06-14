"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { DataGrid } from "../data-grid";
import { useUrlState } from "../hooks/use-url-state";
import type {
  DataGridColumnDef,
  DataGridPaginationState,
  DataGridSortingState,
} from "../index";
import { buildQueryString } from "../utils/query-builder";
import { formatDate } from "./mock-data";

type ApiCustomer = {
  id: string;
  name: string;
  email: string;
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

export function UrlSyncTable() {
  const { state, update } = useUrlState({ defaultPageSize: 20 });

  const queryString = useMemo(
    () =>
      buildQueryString({
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        sorting: state.sorting,
        search: state.search,
      }),
    [state],
  );

  const query = useQuery<ApiResponse>({
    queryKey: ["customers-url", queryString],
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
        accessorKey: "id",
        header: "ID",
        meta: {
          label: "ID",
          className: "font-mono text-xs text-muted-foreground",
        },
        size: 130,
      },
      { accessorKey: "name", header: "Name", meta: { label: "Name" } },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
        meta: { label: "Email" },
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
        meta: { label: "Status" },
      },
      { accessorKey: "country", header: "Country", meta: { label: "Country" } },
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

  const handlePagination = (p: DataGridPaginationState) => {
    update({ pageIndex: p.pageIndex, pageSize: p.pageSize });
  };

  const handleSorting = (s: DataGridSortingState) => {
    update({ sorting: s, pageIndex: 0 });
  };

  const handleSearch = (s: string) => {
    update({ search: s, pageIndex: 0 });
  };

  return (
    <DataGrid
      serverSide
      data={query.data?.data ?? []}
      columns={columns}
      getRowId={(row) => row.id}
      totalRows={query.data?.total ?? 0}
      pageIndex={state.pageIndex}
      pageSize={state.pageSize}
      sorting={state.sorting}
      search={state.search}
      onPaginationChange={handlePagination}
      onSortingChange={handleSorting}
      onSearchChange={handleSearch}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      isError={query.isError}
      onRetry={() => query.refetch()}
      enableSelection={false}
      enableColumnFilters={false}
      searchPlaceholder="Search — state persists in URL"
    />
  );
}
