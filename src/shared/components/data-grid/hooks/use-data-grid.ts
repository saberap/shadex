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
import { useCallback, useMemo, useState } from "react";
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
  const [uncontrolledPagination, setUncontrolledPagination] =
    useState<PaginationState>({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: initialPageSize,
    });

  const [uncontrolledSorting, setUncontrolledSorting] =
    useState<SortingState>(initialSorting);

  const [uncontrolledFilters, setUncontrolledFilters] =
    useState<ColumnFiltersState>(initialFilters);

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const effectivePagination: PaginationState = useMemo(
    () => ({
      pageIndex: pageIndex ?? uncontrolledPagination.pageIndex,
      pageSize: pageSize ?? uncontrolledPagination.pageSize,
    }),
    [pageIndex, pageSize, uncontrolledPagination],
  );

  const effectiveSorting = sorting ?? uncontrolledSorting;
  const effectiveFilters = filters ?? uncontrolledFilters;

  const handlePaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const next =
        typeof updater === "function" ? updater(effectivePagination) : updater;
      if (pageIndex === undefined && pageSize === undefined) {
        setUncontrolledPagination(next);
      }
      onPaginationChange?.({
        pageIndex: next.pageIndex,
        pageSize: next.pageSize,
      });
    },
    [effectivePagination, onPaginationChange, pageIndex, pageSize],
  );

  const handleSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      const next =
        typeof updater === "function" ? updater(effectiveSorting) : updater;
      if (sorting === undefined) setUncontrolledSorting(next);
      onSortingChange?.(next);
    },
    [effectiveSorting, onSortingChange, sorting],
  );

  const handleFiltersChange = useCallback<OnChangeFn<ColumnFiltersState>>(
    (updater) => {
      const next =
        typeof updater === "function" ? updater(effectiveFilters) : updater;
      if (filters === undefined) setUncontrolledFilters(next);
      onFiltersChange?.(next);
    },
    [effectiveFilters, onFiltersChange, filters],
  );

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
