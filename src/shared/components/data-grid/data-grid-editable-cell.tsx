"use client";

import { Check, Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { DataGridEditableType, DataGridSelectOption } from "./types";

type DataGridEditableCellProps = {
  value: string | number | null | undefined;
  type?: DataGridEditableType;
  options?: DataGridSelectOption[];
  onCommit: (next: string | number) => void;
  display?: React.ReactNode;
  align?: "left" | "center" | "right";
};

export function DataGridEditableCell({
  value,
  type = "text",
  options = [],
  onCommit,
  display,
  align = "left",
}: DataGridEditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(
    value == null ? "" : String(value),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(value == null ? "" : String(value));
  }, [value]);

  const commit = () => {
    if (type === "number") {
      const n = Number(draft);
      if (!Number.isNaN(n)) onCommit(n);
    } else {
      onCommit(draft);
    }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value == null ? "" : String(value));
    setEditing(false);
  };

  if (!editing) {
    const alignClass =
      align === "right"
        ? "justify-end"
        : align === "center"
          ? "justify-center"
          : "justify-start";
    return (
      <div className={`group/edit flex items-center gap-1.5 ${alignClass}`}>
        <span className="truncate">{display ?? value ?? "—"}</span>
        <Button
          aria-label="ویرایش سلول"
          size="icon-xs"
          variant="ghost"
          className="opacity-0 transition-opacity group-hover/edit:opacity-100"
          onClick={() => setEditing(true)}
        >
          <Pencil />
        </Button>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="flex items-center gap-1">
        <Select
          value={draft}
          onValueChange={(v) => {
            setDraft(v);
            if (type === "select") {
              onCommit(v);
              setEditing(false);
            }
          }}
        >
          <SelectTrigger size="sm" className="h-7 w-full min-w-32">
            <SelectValue placeholder="انتخاب…" />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={cancel}
          aria-label="انصراف"
        >
          <X />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        ref={inputRef}
        type={type === "number" ? "number" : type === "date" ? "date" : "text"}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        className="h-7"
      />
      <Button size="icon-xs" variant="ghost" onClick={commit} aria-label="ذخیره">
        <Check />
      </Button>
      <Button
        size="icon-xs"
        variant="ghost"
        onClick={cancel}
        aria-label="انصراف"
      >
        <X />
      </Button>
    </div>
  );
}
