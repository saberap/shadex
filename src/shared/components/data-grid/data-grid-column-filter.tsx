"use client";

import type { Column } from "@tanstack/react-table";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/core/utils/cn";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";

type DataGridColumnFilterProps<TData, TValue> = {
  column: Column<TData, TValue>;
};

export function DataGridColumnFilter<TData, TValue>({
  column,
}: DataGridColumnFilterProps<TData, TValue>) {
  "use no memo";

  const meta = column.columnDef.meta;
  const filterType = meta?.filterType ?? "text";
  const value = column.getFilterValue();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<unknown>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const apply = () => {
    column.setFilterValue(draft);
    setOpen(false);
  };

  const clear = () => {
    column.setFilterValue(undefined);
    setDraft(undefined);
    setOpen(false);
  };

  const isActive =
    value !== undefined &&
    value !== "" &&
    !(Array.isArray(value) && value.length === 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`فیلتر ستون ${column.id}`}
          data-active={isActive ? "true" : undefined}
          className={cn(
            "shrink-0 transition-colors",
            isActive &&
              "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary aria-expanded:bg-primary/15 aria-expanded:text-primary",
          )}
        >
          <Filter
            className={cn(
              "transition-[fill,stroke]",
              isActive && "fill-primary",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-foreground">
            فیلتر{" "}
            <span className="text-muted-foreground">
              {meta?.label ?? column.id}
            </span>
          </p>
          {isActive ? <Badge variant="secondary">فعال</Badge> : null}
        </div>
        <Separator />

        {filterType === "text" || filterType === "number" ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor={`filter-${column.id}`} className="text-xs">
              {filterType === "number" ? "شامل عدد" : "شامل متن"}
            </Label>
            <Input
              id={`filter-${column.id}`}
              type={filterType === "number" ? "number" : "text"}
              value={(draft as string | number | undefined) ?? ""}
              onChange={(e) =>
                setDraft(
                  filterType === "number"
                    ? e.target.value === ""
                      ? undefined
                      : Number(e.target.value)
                    : e.target.value,
                )
              }
              placeholder="برای فیلتر کردن تایپ کنید…"
              className="h-8"
            />
          </div>
        ) : null}

        {filterType === "boolean" ? (
          <div className="flex flex-col gap-2">
            <Label className="text-xs">مقدار</Label>
            <div className="flex gap-1.5">
              {(
                [
                  { v: true, label: "درست" },
                  { v: false, label: "نادرست" },
                ] as const
              ).map((opt) => (
                <Button
                  key={String(opt.v)}
                  variant={draft === opt.v ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDraft(opt.v)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {filterType === "select" ? (
          <div className="flex max-h-64 flex-col gap-1.5 overflow-auto">
            {(meta?.filterOptions ?? []).map((o) => {
              const selected = Array.isArray(draft) && draft.includes(o.value);
              return (
                <Label
                  key={o.value}
                  htmlFor={`opt-${column.id}-${o.value}`}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-muted/60"
                >
                  <Checkbox
                    id={`opt-${column.id}-${o.value}`}
                    checked={selected}
                    onCheckedChange={(checked) => {
                      const current = Array.isArray(draft)
                        ? [...(draft as string[])]
                        : [];
                      if (checked) {
                        if (!current.includes(o.value)) current.push(o.value);
                      } else {
                        const i = current.indexOf(o.value);
                        if (i >= 0) current.splice(i, 1);
                      }
                      setDraft(current.length === 0 ? undefined : current);
                    }}
                  />
                  <span>{o.label}</span>
                </Label>
              );
            })}
          </div>
        ) : null}

        {filterType === "date" ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor={`filter-${column.id}`} className="text-xs">
              در تاریخ
            </Label>
            <Input
              id={`filter-${column.id}`}
              type="date"
              value={(draft as string | undefined) ?? ""}
              onChange={(e) => setDraft(e.target.value || undefined)}
              className="h-8"
            />
          </div>
        ) : null}

        <div className="flex justify-between gap-2 pt-1">
          <Button size="sm" variant="ghost" onClick={clear}>
            <X />
            پاک کردن
          </Button>
          <Button size="sm" onClick={apply}>
            اعمال فیلتر
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
