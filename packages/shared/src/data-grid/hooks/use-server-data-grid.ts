"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../constants/data-grid.constants";
import type {
  DataGridFiltersState,
  DataGridSortingState,
} from "../types/table.types";
import {
  buildQueryString,
  type QueryBuilderInput,
} from "../utils/query-builder";

export type ServerDataResponse<TData> = {
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type UseServerDataGridParams = {
  endpoint: string;
  queryKey: readonly unknown[];
  initialPageSize?: number;
  extraParams?: QueryBuilderInput["extra"];
};

export function useServerDataGrid<TData>({
  endpoint,
  queryKey,
  initialPageSize = DEFAULT_PAGE_SIZE,
  extraParams,
}: UseServerDataGridParams) {
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sorting, setSorting] = useState<DataGridSortingState>([]);
  const [filters, setFilters] = useState<DataGridFiltersState>([]);
  const [search, setSearch] = useState("");

  const queryString = useMemo(
    () =>
      buildQueryString({
        pageIndex,
        pageSize,
        sorting,
        filters,
        search,
        extra: extraParams,
      }),
    [pageIndex, pageSize, sorting, filters, search, extraParams],
  );

  const query = useQuery<ServerDataResponse<TData>>({
    queryKey: [...queryKey, queryString],
    queryFn: async () => {
      const res = await fetch(`${endpoint}?${queryString}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return (await res.json()) as ServerDataResponse<TData>;
    },
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data?.data ?? [],
    totalRows: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,

    pageIndex,
    pageSize,
    sorting,
    filters,
    search,

    setPagination: (p: { pageIndex: number; pageSize: number }) => {
      setPageIndex(p.pageIndex);
      setPageSize(p.pageSize);
    },
    setSorting,
    setFilters,
    setSearch: (s: string) => {
      setSearch(s);
      setPageIndex(0);
    },
  };
}
