"use client";

import { flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Fragment, useMemo, useRef } from "react";
import { cn } from "@/core/utils/cn";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  VIRTUAL_OVERSCAN,
  VIRTUAL_ROW_HEIGHT,
} from "./constants/data-grid.constants";
import { DataGridColumnFilter } from "./data-grid-column-filter";
import { DataGridEmptyState } from "./data-grid-empty-state";
import { DataGridExpandToggle } from "./data-grid-expandable-row";
import { DataGridPagination } from "./data-grid-pagination";
import { DataGridProvider } from "./data-grid-provider";
import { DataGridRowActions } from "./data-grid-row-actions";
import { DataGridSkeleton } from "./data-grid-skeleton";
import { DataGridToolbar } from "./data-grid-toolbar";
import { useDataGrid } from "./hooks/use-data-grid";
import type {
  DataGridColumnDef,
  DataGridContextValue,
  DataGridProps,
} from "./types";

export function DataGrid<TData>({
  data,
  columns,
  getRowId,

  initialPageSize,
  initialSorting,
  initialFilters,
  initialVisibility,

  serverSide = false,
  totalRows,
  pageIndex,
  pageSize,
  sorting,
  filters,
  search,

  onPaginationChange,
  onSortingChange,
  onFiltersChange,
  onSearchChange,
  onCellEdit,

  renderSubRow,
  rowActions,
  bulkActions,
  toolbar,

  enableSearch = true,
  searchPlaceholder,
  enableSelection = true,
  enableColumnVisibility = true,
  enableColumnFilters = true,
  enablePagination = true,
  enableVirtualization = false,
  enableExport = true,
  enableSorting = true,

  isLoading = false,
  isFetching = false,
  isError = false,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  onRetry,

  className,
  tableClassName,
  rowClassName,
  density = "comfortable",

  virtualHeight = 560,
  virtualRowHeight = VIRTUAL_ROW_HEIGHT,
}: DataGridProps<TData>) {
  "use no memo";

  const enrichedColumns = useMemo<DataGridColumnDef<TData>[]>(() => {
    const cols: DataGridColumnDef<TData>[] = [];

    if (enableSelection) {
      cols.push({
        id: "__select__",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="انتخاب همه ردیف‌ها"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="انتخاب ردیف"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 36,
        meta: { className: "w-9" },
      });
    }

    if (renderSubRow) {
      cols.push({
        id: "__expand__",
        header: () => null,
        cell: ({ row }) => (
          <DataGridExpandToggle
            row={row}
            canExpand={row.getCanExpand()}
            isExpanded={row.getIsExpanded()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 36,
        meta: { className: "w-9" },
      });
    }

    cols.push(...columns);

    if (rowActions && rowActions.length > 0) {
      cols.push({
        id: "__actions__",
        header: () => <span className="sr-only">عملیات</span>,
        cell: ({ row }) => (
          <DataGridRowActions row={row} actions={rowActions} />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 56,
        meta: { className: "w-14 text-end" },
      });
    }

    return cols;
  }, [columns, enableSelection, renderSubRow, rowActions]);

  const { table } = useDataGrid<TData>({
    data,
    columns: enrichedColumns,
    serverSide,
    totalRows,
    getRowId,
    initialPageSize,
    initialSorting,
    initialFilters,
    initialVisibility,
    pageIndex,
    pageSize,
    sorting,
    filters,
    onPaginationChange,
    onSortingChange,
    onFiltersChange,
    enableSelection,
    enableSorting,
    enableColumnFilters,
    enablePagination,
    enableSubRows: !!renderSubRow,
  });

  // Read TanStack state once per render and pass down explicitly so React
  // Compiler can't memoize children with stale state.
  const tableState = table.getState();
  const livePagination = tableState.pagination;
  const liveColumnVisibility = tableState.columnVisibility;
  const liveColumnFilters = tableState.columnFilters;
  const livePageCount = table.getPageCount();
  const liveSelectedCount = table.getSelectedRowModel().rows.length;

  const rows = table.getRowModel().rows;
  const showSkeleton = isLoading && rows.length === 0;
  const showEmpty = !isLoading && !isError && rows.length === 0;
  const showError = isError && rows.length === 0;

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => virtualRowHeight,
    overscan: VIRTUAL_OVERSCAN,
    enabled: enableVirtualization,
  });

  const ctx: DataGridContextValue<TData> = {
    table,
    serverSide,
    search: search ?? "",
    setSearch: onSearchChange ?? (() => undefined),
    isLoading,
    isFetching,
    isError,
    totalRows: serverSide
      ? (totalRows ?? 0)
      : table.getFilteredRowModel().rows.length,
    density,
    enableColumnFilters,
    enableColumnVisibility,
    enableSelection,
    enableExport,
    onCellEdit,
  };

  const cellPadding = density === "compact" ? "px-3 py-1.5" : "px-4 py-2.5";
  const headPadding = density === "compact" ? "px-3 h-9" : "px-4 h-11";
  const totalLeafColumns = enrichedColumns.length;

  return (
    <DataGridProvider value={ctx}>
      <div className={cn("flex flex-col gap-3", className)}>
        <DataGridToolbar
          table={table}
          search={search ?? ""}
          onSearchChange={onSearchChange ?? (() => undefined)}
          searchPlaceholder={searchPlaceholder}
          enableSearch={enableSearch}
          enableColumnVisibility={enableColumnVisibility}
          enableExport={enableExport}
          columnVisibility={liveColumnVisibility}
          columnFilters={liveColumnFilters}
          selectedCount={liveSelectedCount}
          bulkActions={bulkActions}
          slots={toolbar}
        />

        {showSkeleton ? (
          <DataGridSkeleton columns={Math.min(8, totalLeafColumns)} />
        ) : showError ? (
          <DataGridEmptyState
            variant="error"
            title={errorTitle}
            description={errorDescription}
            onRetry={onRetry}
          />
        ) : showEmpty ? (
          <DataGridEmptyState
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-xl border bg-card shadow-xs",
              isFetching && "opacity-95 transition-opacity",
              tableClassName,
            )}
          >
            <div
              ref={scrollRef}
              className={cn(
                "w-full overflow-auto",
                enableVirtualization && "max-h-(--virtual-h)",
              )}
              style={
                enableVirtualization
                  ? ({
                      "--virtual-h": `${virtualHeight}px`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <Table>
                <TableHeader className="[&_tr]:border-b-0">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent"
                    >
                      {headerGroup.headers.map((header) => {
                        const meta = header.column.columnDef.meta;
                        const canSort =
                          header.column.getCanSort() && enableSorting;
                        const isSorted = header.column.getIsSorted();
                        const canFilter =
                          header.column.getCanFilter() &&
                          enableColumnFilters &&
                          !!meta?.filterType;

                        const align = meta?.align ?? "left";
                        const alignClass =
                          align === "right"
                            ? "justify-end text-end"
                            : align === "center"
                              ? "justify-center text-center"
                              : "justify-start text-start";

                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            style={{
                              width:
                                header.getSize() !== 150
                                  ? header.getSize()
                                  : undefined,
                            }}
                            className={cn(
                              headPadding,
                              "sticky top-0 z-10 select-none border-b bg-card text-xs font-medium uppercase tracking-wide text-muted-foreground",
                              meta?.className,
                            )}
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                className={cn(
                                  "flex items-center gap-1",
                                  alignClass,
                                )}
                              >
                                {canSort ? (
                                  <button
                                    type="button"
                                    className="group/sort flex items-center gap-1 rounded-sm hover:text-foreground"
                                    onClick={header.column.getToggleSortingHandler()}
                                    aria-label={`مرتب‌سازی بر اساس ${header.column.id}`}
                                  >
                                    <span>
                                      {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                      )}
                                    </span>
                                    {isSorted === "asc" ? (
                                      <ArrowUp className="size-3.5 text-foreground" />
                                    ) : isSorted === "desc" ? (
                                      <ArrowDown className="size-3.5 text-foreground" />
                                    ) : (
                                      <ArrowUpDown className="size-3.5 opacity-0 transition-opacity group-hover/sort:opacity-100" />
                                    )}
                                  </button>
                                ) : (
                                  flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )
                                )}
                                {canFilter ? (
                                  <DataGridColumnFilter
                                    column={header.column}
                                  />
                                ) : null}
                              </div>
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>

                {enableVirtualization ? (
                  <TableBody
                    style={{
                      height: `${virtualizer.getTotalSize()}px`,
                      position: "relative",
                    }}
                  >
                    {virtualizer.getVirtualItems().map((virtualRow) => {
                      const row = rows[virtualRow.index];
                      if (!row) return null;
                      return (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          data-index={virtualRow.index}
                          ref={(node) => {
                            if (node) virtualizer.measureElement(node);
                          }}
                          className={cn(rowClassName?.(row.original))}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          {row.getVisibleCells().map((cell) => {
                            const meta = cell.column.columnDef.meta;
                            const align = meta?.align ?? "left";
                            return (
                              <TableCell
                                key={cell.id}
                                className={cn(
                                  cellPadding,
                                  "text-sm text-foreground",
                                  align === "right" && "text-end",
                                  align === "center" && "text-center",
                                  meta?.className,
                                )}
                                style={{
                                  width:
                                    cell.column.getSize() !== 150
                                      ? cell.column.getSize()
                                      : undefined,
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : (
                  <TableBody>
                    {rows.map((row) => (
                      <Fragment key={row.id}>
                        <TableRow
                          data-state={row.getIsSelected() && "selected"}
                          className={cn(rowClassName?.(row.original))}
                        >
                          {row.getVisibleCells().map((cell) => {
                            const meta = cell.column.columnDef.meta;
                            const align = meta?.align ?? "left";
                            return (
                              <TableCell
                                key={cell.id}
                                className={cn(
                                  cellPadding,
                                  "text-sm text-foreground",
                                  align === "right" && "text-end",
                                  align === "center" && "text-center",
                                  meta?.className,
                                )}
                                style={{
                                  width:
                                    cell.column.getSize() !== 150
                                      ? cell.column.getSize()
                                      : undefined,
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        {renderSubRow ? (
                          <TableRow
                            aria-expanded={row.getIsExpanded()}
                            className="border-b-0 hover:bg-transparent"
                          >
                            <TableCell
                              colSpan={row.getVisibleCells().length}
                              className="border-b-0 p-0"
                            >
                              <AnimatePresence initial={false}>
                                {row.getIsExpanded() ? (
                                  <motion.div
                                    key="content"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                      height: {
                                        duration: 0.25,
                                        ease: [0.4, 0, 0.2, 1],
                                      },
                                      opacity: {
                                        duration: 0.18,
                                        ease: "easeOut",
                                      },
                                    }}
                                    className="overflow-hidden"
                                  >
                                    <div className="border-b bg-muted/30 px-6 py-4">
                                      {renderSubRow(row.original)}
                                    </div>
                                  </motion.div>
                                ) : null}
                              </AnimatePresence>
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </Fragment>
                    ))}
                  </TableBody>
                )}
              </Table>
            </div>
          </div>
        )}

        {enablePagination && !showSkeleton && !showEmpty && !showError ? (
          <DataGridPagination
            table={table}
            totalRows={
              serverSide
                ? (totalRows ?? 0)
                : table.getFilteredRowModel().rows.length
            }
            pageIndex={livePagination.pageIndex}
            pageSize={livePagination.pageSize}
            pageCount={livePageCount}
          />
        ) : null}
      </div>
    </DataGridProvider>
  );
}

export type { DataGridProps };
