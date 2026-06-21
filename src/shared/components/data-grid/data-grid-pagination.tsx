"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/core/utils/cn";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { DEFAULT_PAGE_SIZES } from "./constants/data-grid.constants";
import { formatRecordsRange, getPageNumbers } from "./utils/table-utils";

type DataGridPaginationProps<TData> = {
  table: Table<TData>;
  totalRows: number;
  /** Live pagination state — passed as a prop so React Compiler can't skip
   *  re-render when TanStack updates the table internally. */
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  pageSizes?: readonly number[];
};

export function DataGridPagination<TData>({
  table,
  totalRows,
  pageIndex,
  pageSize,
  pageCount,
  pageSizes = DEFAULT_PAGE_SIZES,
}: DataGridPaginationProps<TData>) {
  "use no memo";

  const current = pageIndex + 1;
  const numbers = getPageNumbers(current, pageCount);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        {formatRecordsRange(pageIndex, pageSize, totalRows)}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">ردیف در صفحه</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger size="sm" className="h-7 w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="رفتن به صفحه اول"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="رفتن به صفحه قبل"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft />
          </Button>

          <div className="hidden items-center gap-0.5 px-1 sm:flex">
            {numbers.map((n, i) =>
              n === "..." ? (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis position is stable per render
                  key={`dots-${i}`}
                  className="px-1 text-sm text-muted-foreground"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <Button
                  key={n}
                  variant={n === current ? "default" : "ghost"}
                  size="icon-sm"
                  aria-label={`رفتن به صفحه ${n}`}
                  aria-current={n === current ? "page" : undefined}
                  className={cn(
                    "min-w-7",
                    n === current && "pointer-events-none",
                  )}
                  onClick={() => table.setPageIndex(n - 1)}
                >
                  {n}
                </Button>
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="icon-sm"
            aria-label="رفتن به صفحه بعد"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="رفتن به صفحه آخر"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(pageCount - 1)}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
