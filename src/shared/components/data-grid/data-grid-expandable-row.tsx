"use client";

import type { Row } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { cn } from "@/core/utils/cn";
import { Button } from "@/shared/components/ui/button";

type DataGridExpandToggleProps<TData> = {
  row: Row<TData>;
};

export function DataGridExpandToggle<TData>({
  row,
}: DataGridExpandToggleProps<TData>) {
  if (!row.getCanExpand()) return null;
  const expanded = row.getIsExpanded();
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={expanded ? "Collapse row" : "Expand row"}
      onClick={(e) => {
        e.stopPropagation();
        row.toggleExpanded();
      }}
    >
      <ChevronRight
        className={cn(
          "transition-transform duration-200",
          expanded && "rotate-90",
        )}
      />
    </Button>
  );
}
