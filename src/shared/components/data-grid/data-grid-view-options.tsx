"use client";

import type { Table } from "@tanstack/react-table";
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
};

export function DataGridViewOptions<TData>({
  table,
}: DataGridViewOptionsProps<TData>) {
  // Reading visibility from state forces a re-subscribe to TanStack's
  // state object so the checkbox indicators stay in sync with the table.
  const visibility = table.getState().columnVisibility;

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
          const isVisible = visibility[column.id] ?? true;
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
