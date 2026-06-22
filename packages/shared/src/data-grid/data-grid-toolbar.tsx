"use client";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Separator,
} from "@repo/ui";
import type {
  ColumnFiltersState,
  Table,
  VisibilityState,
} from "@tanstack/react-table";
import { Download, FileSpreadsheet, FileText, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_DEBOUNCE_MS } from "./constants/data-grid.constants";
import { DataGridViewOptions } from "./data-grid-view-options";
import type { DataGridBulkAction, DataGridToolbarSlot } from "./types";
import { exportTableToCsv } from "./utils/export-csv";
import { exportTableToExcel } from "./utils/export-excel";
import { exportTableToPdf } from "./utils/export-pdf";

type DataGridToolbarProps<TData> = {
  table: Table<TData>;
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  enableSearch: boolean;
  enableColumnVisibility: boolean;
  enableExport: boolean;
  /** Live state slices — passed through so React Compiler can't skip re-render
   *  when TanStack updates state internally. */
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
  selectedCount: number;
  bulkActions?: DataGridBulkAction<TData>[];
  slots?: DataGridToolbarSlot;
};

export function DataGridToolbar<TData>({
  table,
  search,
  onSearchChange,
  searchPlaceholder = "جستجو…",
  enableSearch,
  enableColumnVisibility,
  enableExport,
  columnVisibility,
  columnFilters,
  selectedCount,
  bulkActions,
  slots,
}: DataGridToolbarProps<TData>) {
  "use no memo";

  const [draftSearch, setDraftSearch] = useState(search);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraftSearch(search);
  }, [search]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (draftSearch !== search) onSearchChange(draftSearch);
    }, DEFAULT_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draftSearch, onSearchChange, search]);

  const hasActiveFilters = columnFilters.length > 0;
  const filterCount = columnFilters.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {enableSearch ? (
            <div className="relative">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-64 ps-8 pe-8"
                aria-label="جستجو"
              />
              {draftSearch ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute end-1 top-1/2 -translate-y-1/2"
                  onClick={() => setDraftSearch("")}
                  aria-label="پاک کردن جستجو"
                >
                  <X />
                </Button>
              ) : null}
            </div>
          ) : null}

          {slots?.startContent}

          {hasActiveFilters ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
            >
              بازنشانی
              <Badge variant="secondary">{filterCount}</Badge>
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {slots?.endContent}

          {enableColumnVisibility ? (
            <DataGridViewOptions
              table={table}
              columnVisibility={columnVisibility}
            />
          ) : null}

          {enableExport ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download />
                  خروجی گرفتن
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>دانلود به‌صورت</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => exportTableToCsv(table)}>
                  <FileText />
                  <span>CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => exportTableToExcel(table)}>
                  <FileSpreadsheet />
                  <span>Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => exportTableToPdf(table)}>
                  <FileText />
                  <span>PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {selectedCount > 0 && bulkActions && bulkActions.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="text-sm font-medium">{selectedCount} انتخاب‌شده</span>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex flex-wrap items-center gap-1.5">
            {bulkActions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                variant={
                  action.variant === "destructive" ? "destructive" : "outline"
                }
                onClick={() =>
                  action.onClick(
                    table.getSelectedRowModel().rows.map((r) => r.original),
                  )
                }
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="ms-auto"
            onClick={() => table.resetRowSelection()}
          >
            پاک کردن
          </Button>
        </div>
      ) : null}
    </div>
  );
}
