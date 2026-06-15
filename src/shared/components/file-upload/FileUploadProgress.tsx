"use client";

import { cn } from "@/core/utils/cn";
import { Progress } from "@/shared/components/ui/progress";
import type { FileUploadProgressProps } from "./types";

export function FileUploadProgress({
  value,
  status,
  className,
}: FileUploadProgressProps) {
  const label =
    status === "success"
      ? "Uploaded"
      : status === "error"
        ? "Failed"
        : status === "uploading"
          ? `${Math.round(value)}%`
          : "Ready";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress
        value={status === "success" ? 100 : value}
        className={cn(
          "h-1 flex-1",
          status === "error" &&
            "[&_[data-slot=progress-indicator]]:bg-destructive",
          status === "success" &&
            "[&_[data-slot=progress-indicator]]:bg-emerald-500",
        )}
      />
      <span
        className={cn(
          "min-w-12 text-right text-xs tabular-nums text-muted-foreground",
          status === "error" && "text-destructive",
          status === "success" && "text-emerald-600 dark:text-emerald-500",
        )}
      >
        {label}
      </span>
    </div>
  );
}
