"use client";

import { Loader2 } from "lucide-react";

export function DataGridLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <output
      aria-live="polite"
      className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"
    >
      <Loader2 className="size-4 animate-spin" />
      <span>{label}</span>
    </output>
  );
}
