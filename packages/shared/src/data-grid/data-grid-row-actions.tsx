"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import type { DataGridRowAction } from "./types";

type DataGridRowActionsProps<TData> = {
  row: Row<TData>;
  actions: DataGridRowAction<TData>[];
};

export function DataGridRowActions<TData>({
  row,
  actions,
}: DataGridRowActionsProps<TData>) {
  const visible = actions.filter((a) => !a.hidden?.(row.original));
  if (visible.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="باز کردن عملیات ردیف"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visible.map((action) => {
          const key = action.label;
          const node = (
            <DropdownMenuItem
              key={key}
              data-variant={
                action.variant === "destructive" ? "destructive" : undefined
              }
              onSelect={(e) => {
                e.preventDefault();
                action.onClick(row.original);
              }}
            >
              {action.icon}
              <span>{action.label}</span>
            </DropdownMenuItem>
          );

          return action.separatorBefore ? (
            <span key={`group-${key}`}>
              <DropdownMenuSeparator />
              {node}
            </span>
          ) : (
            node
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
