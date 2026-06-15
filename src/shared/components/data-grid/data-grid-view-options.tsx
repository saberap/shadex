"use client";

import type { Table, VisibilityState } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getColumnLabel } from "./utils/table-utils";

type DataGridViewOptionsProps<TData> = {
  table: Table<TData>;
  /** Live visibility state — passed in so React Compiler can't skip re-render
   *  when the underlying TanStack state changes. */
  columnVisibility: VisibilityState;
};

export function DataGridViewOptions<TData>({
  table,
  columnVisibility,
}: DataGridViewOptionsProps<TData>) {
  "use no memo";

  const toggleable = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide(),
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {toggleable.map((column) => {
          const isVisible = columnVisibility[column.id] ?? true;
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={isVisible}
              onSelect={(e) => {
                e.preventDefault();
                column.toggleVisibility(!isVisible);
              }}
            >
              {getColumnLabel(column)}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
