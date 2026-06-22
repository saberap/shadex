import type { ReactNode } from "react";
import type {
  DataGridColumnDef,
  DataGridFiltersState,
  DataGridSortingState,
  DataGridTableInstance,
  DataGridVisibilityState,
} from "./table.types";

export type DataGridPagination = {
  pageIndex: number;
  pageSize: number;
};

export type DataGridRowAction<TData> = {
  label: string;
  icon?: ReactNode;
  onClick: (row: TData) => void;
  variant?: "default" | "destructive";
  separatorBefore?: boolean;
  hidden?: (row: TData) => boolean;
};

export type DataGridBulkAction<TData> = {
  label: string;
  icon?: ReactNode;
  onClick: (rows: TData[]) => void;
  variant?: "default" | "destructive";
};

export type DataGridToolbarSlot = {
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export type DataGridProps<TData> = {
  data: TData[];
  columns: DataGridColumnDef<TData>[];

  /** Unique identifier used by selection / virtualization. */
  getRowId?: (row: TData, index: number) => string;

  /** Controlled / uncontrolled state */
  initialPageSize?: number;
  initialSorting?: DataGridSortingState;
  initialFilters?: DataGridFiltersState;
  initialVisibility?: DataGridVisibilityState;

  /** Server-side mode toggles manual modes inside TanStack. */
  serverSide?: boolean;
  totalRows?: number;
  pageIndex?: number;
  pageSize?: number;
  sorting?: DataGridSortingState;
  filters?: DataGridFiltersState;
  search?: string;

  onPaginationChange?: (pagination: DataGridPagination) => void;
  onSortingChange?: (sorting: DataGridSortingState) => void;
  onFiltersChange?: (filters: DataGridFiltersState) => void;
  onSearchChange?: (search: string) => void;

  /** Inline editing handler. Called when an editable cell finishes editing. */
  onCellEdit?: (params: {
    rowId: string;
    columnId: string;
    value: unknown;
    row: TData;
  }) => void;

  /** Renders a detail panel below an expanded row. */
  renderSubRow?: (row: TData) => ReactNode;

  /** Per-row action menu items. Renders a trailing actions cell. */
  rowActions?: DataGridRowAction<TData>[];

  /** Bulk actions shown when at least one row is selected. */
  bulkActions?: DataGridBulkAction<TData>[];

  /** Optional toolbar slots. */
  toolbar?: DataGridToolbarSlot;

  /** Behavior flags. */
  enableSearch?: boolean;
  searchPlaceholder?: string;
  enableSelection?: boolean;
  enableColumnVisibility?: boolean;
  enableColumnFilters?: boolean;
  enablePagination?: boolean;
  enableVirtualization?: boolean;
  enableExport?: boolean;
  enableSorting?: boolean;

  /** Visual state. */
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  onRetry?: () => void;

  /** Wrapping. */
  className?: string;
  tableClassName?: string;
  rowClassName?: (row: TData) => string | undefined;
  density?: "compact" | "comfortable";

  /** Virtualization config. */
  virtualHeight?: number;
  virtualRowHeight?: number;
};

export type DataGridCellEditPayload<TData> = {
  rowId: string;
  columnId: string;
  value: unknown;
  row: TData;
};

export type DataGridContextValue<TData> = {
  table: DataGridTableInstance<TData>;
  serverSide: boolean;
  search: string;
  setSearch: (v: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  totalRows: number;
  density: "compact" | "comfortable";
  enableColumnFilters: boolean;
  enableColumnVisibility: boolean;
  enableSelection: boolean;
  enableExport: boolean;
  onCellEdit?: (payload: DataGridCellEditPayload<TData>) => void;
};
