"use client";

import type { Row } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { cn } from "@/core/utils/cn";
import { Button } from "@/shared/components/ui/button";

type DataGridExpandToggleProps<TData> = {
  row: Row<TData>;
  /** Live state — passed as props so React Compiler can't cache stale JSX. */
  canExpand: boolean;
  isExpanded: boolean;
};

export function DataGridExpandToggle<TData>({
  row,
  canExpand,
  isExpanded,
}: DataGridExpandToggleProps<TData>) {
  "use no memo";

  if (!canExpand) return null;

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={isExpanded ? "بستن ردیف" : "گسترش ردیف"}
      aria-expanded={isExpanded}
      onClick={(e) => {
        e.stopPropagation();
        row.toggleExpanded();
      }}
    >
      <ChevronRight
        className={cn(
          "transition-transform duration-200 ease-out",
          isExpanded && "rotate-90",
        )}
      />
    </Button>
  );
}
