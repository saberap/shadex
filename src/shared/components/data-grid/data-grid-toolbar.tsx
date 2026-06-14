"use client";

import type { Table } from "@tanstack/react-table";
import { Download, FileSpreadsheet, FileText, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
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
  bulkActions?: DataGridBulkAction<TData>[];
  slots?: DataGridToolbarSlot;
};

export function DataGridToolbar<TData>({
  table,
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  enableSearch,
  enableColumnVisibility,
  enableExport,
  bulkActions,
  slots,
}: DataGridToolbarProps<TData>) {
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

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const selectedCount = selectedRows.length;
  const hasActiveFilters = table.getState().columnFilters.length > 0;
  const filterCount = table.getState().columnFilters.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {enableSearch ? (
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-64 pl-8 pr-8"
                aria-label="Search"
              />
              {draftSearch ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setDraftSearch("")}
                  aria-label="Clear search"
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
              Reset
              <Badge variant="secondary">{filterCount}</Badge>
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {slots?.endContent}

          {enableColumnVisibility ? (
            <DataGridViewOptions table={table} />
          ) : null}

          {enableExport ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Download as</DropdownMenuLabel>
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
          <span className="text-sm font-medium">{selectedCount} selected</span>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex flex-wrap items-center gap-1.5">
            {bulkActions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                variant={
                  action.variant === "destructive" ? "destructive" : "outline"
                }
                onClick={() => action.onClick(selectedRows)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={() => table.resetRowSelection()}
          >
            Clear
          </Button>
        </div>
      ) : null}
    </div>
  );
}
