"use client";

import {
  type ColumnFiltersState,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../constants/data-grid.constants";
import type {
  DataGridColumnDef,
  DataGridFiltersState,
  DataGridPagination,
  DataGridSortingState,
  DataGridVisibilityState,
} from "../types";

type UseDataGridParams<TData> = {
  data: TData[];
  columns: DataGridColumnDef<TData>[];
  serverSide?: boolean;
  totalRows?: number;
  getRowId?: (row: TData, index: number) => string;

  initialPageSize?: number;
  initialSorting?: DataGridSortingState;
  initialFilters?: DataGridFiltersState;
  initialVisibility?: DataGridVisibilityState;

  /** Controlled state (server-side). */
  pageIndex?: number;
  pageSize?: number;
  sorting?: DataGridSortingState;
  filters?: DataGridFiltersState;

  onPaginationChange?: (pagination: DataGridPagination) => void;
  onSortingChange?: (sorting: DataGridSortingState) => void;
  onFiltersChange?: (filters: DataGridFiltersState) => void;

  enableSelection?: boolean;
  enableSorting?: boolean;
  enableColumnFilters?: boolean;
  enablePagination?: boolean;
  enableSubRows?: boolean;
};

export function useDataGrid<TData>({
  data,
  columns,
  serverSide = false,
  totalRows,
  getRowId,
  initialPageSize = DEFAULT_PAGE_SIZE,
  initialSorting = [],
  initialFilters = [],
  initialVisibility = {},
  pageIndex,
  pageSize,
  sorting,
  filters,
  onPaginationChange,
  onSortingChange,
  onFiltersChange,
  enableSelection = true,
  enableSorting = true,
  enableColumnFilters = true,
  enablePagination = true,
  enableSubRows = true,
}: UseDataGridParams<TData>) {
  // Internal state — TanStack pattern: useState setters double as OnChangeFn.
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: initialPageSize,
    },
  );
  const [internalSorting, setInternalSorting] =
    useState<SortingState>(initialSorting);
  const [internalFilters, setInternalFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  // Server-side controlled props take precedence over internal state.
  const isPaginationControlled =
    serverSide && pageIndex !== undefined && pageSize !== undefined;
  const isSortingControlled = serverSide && sorting !== undefined;
  const isFiltersControlled = serverSide && filters !== undefined;

  const effectivePagination = useMemo<PaginationState>(
    () =>
      isPaginationControlled
        ? { pageIndex: pageIndex as number, pageSize: pageSize as number }
        : internalPagination,
    [isPaginationControlled, pageIndex, pageSize, internalPagination],
  );
  const effectiveSorting = isSortingControlled
    ? (sorting as SortingState)
    : internalSorting;
  const effectiveFilters = isFiltersControlled
    ? (filters as ColumnFiltersState)
    : internalFilters;

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    setInternalPagination((prev) => {
      const base = isPaginationControlled ? effectivePagination : prev;
      const next = typeof updater === "function" ? updater(base) : updater;
      if (onPaginationChange) {
        onPaginationChange({
          pageIndex: next.pageIndex,
          pageSize: next.pageSize,
        });
      }
      return next;
    });
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setInternalSorting((prev) => {
      const base = isSortingControlled ? effectiveSorting : prev;
      const next = typeof updater === "function" ? updater(base) : updater;
      if (onSortingChange) onSortingChange(next);
      return next;
    });
  };

  const handleFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    setInternalFilters((prev) => {
      const base = isFiltersControlled ? effectiveFilters : prev;
      const next = typeof updater === "function" ? updater(base) : updater;
      if (onFiltersChange) onFiltersChange(next);
      return next;
    });
  };

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      pagination: effectivePagination,
      sorting: effectiveSorting,
      columnFilters: effectiveFilters,
      columnVisibility,
      rowSelection,
      expanded,
      columnOrder,
    },
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onColumnOrderChange: setColumnOrder,
    enableRowSelection: enableSelection,
    enableSorting,
    enableColumnFilters,
    enableMultiSort: true,
    enableExpanding: enableSubRows,
    // Any row can be expanded when a sub-row renderer is provided. Without
    // this, TanStack only allows expansion when the data itself has nested
    // `subRows`, which our flat data does not.
    getRowCanExpand: enableSubRows ? () => true : undefined,
    manualPagination: serverSide,
    manualSorting: serverSide,
    manualFiltering: serverSide,
    pageCount: serverSide
      ? Math.max(1, Math.ceil((totalRows ?? 0) / effectivePagination.pageSize))
      : undefined,
    rowCount: serverSide ? totalRows : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: serverSide ? undefined : getSortedRowModel(),
    getFilteredRowModel: serverSide ? undefined : getFilteredRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getExpandedRowModel: enableSubRows ? getExpandedRowModel() : undefined,
  });

  return { table };
}
