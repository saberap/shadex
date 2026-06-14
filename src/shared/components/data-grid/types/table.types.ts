import type {
  ColumnFiltersState,
  RowData,
  SortingState,
  Table,
  ColumnDef as TanstackColumnDef,
  VisibilityState,
} from "@tanstack/react-table";

export type DataGridFilterType =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "date";

export type DataGridEditableType = "text" | "number" | "select" | "date";

export type DataGridSelectOption = {
  label: string;
  value: string;
};

export type DataGridColumnMeta = {
  label?: string;
  filterType?: DataGridFilterType;
  filterOptions?: DataGridSelectOption[];
  editable?: boolean;
  editType?: DataGridEditableType;
  editOptions?: DataGridSelectOption[];
  align?: "left" | "center" | "right";
  className?: string;
  hidden?: boolean;
};

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: TanStack module augmentation
  interface ColumnMeta<TData extends RowData, TValue>
    extends DataGridColumnMeta {}
}

export type DataGridColumnDef<TData, TValue = unknown> = TanstackColumnDef<
  TData,
  TValue
>;

export type DataGridSortingState = SortingState;
export type DataGridFiltersState = ColumnFiltersState;
export type DataGridVisibilityState = VisibilityState;

export type DataGridTableInstance<TData> = Table<TData>;
