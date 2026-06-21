"use client";

import {
  CircleAlert,
  CircleCheck,
  FileArchive,
  File as FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  Presentation,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/core/utils/cn";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { FileUploadProgress } from "./FileUploadProgress";
import type { FileUploadItemProps, UploadFile } from "./types";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / 1024 ** i;
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function getFileIcon(file: UploadFile): IconComponent {
  const t = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  if (t.startsWith("image/")) return FileImage;
  if (t === "application/pdf" || name.endsWith(".pdf")) return FileText;
  if (
    t.includes("spreadsheet") ||
    t.includes("excel") ||
    name.endsWith(".xlsx") ||
    name.endsWith(".csv")
  )
    return FileSpreadsheet;
  if (
    t.includes("presentation") ||
    name.endsWith(".pptx") ||
    name.endsWith(".ppt")
  )
    return Presentation;
  if (t.includes("word") || name.endsWith(".docx") || name.endsWith(".doc"))
    return FileText;
  if (
    t.includes("zip") ||
    t.includes("compressed") ||
    name.endsWith(".zip") ||
    name.endsWith(".rar")
  )
    return FileArchive;
  return FileIcon;
}

export function FileUploadItem({
  file,
  onRemove,
  onRetry,
  className,
}: FileUploadItemProps) {
  const Icon = getFileIcon(file);
  const isImage = Boolean(file.preview);
  const isError = file.status === "error";
  const isSuccess = file.status === "success";

  return (
    <div
      data-slot="file-upload-item"
      data-status={file.status}
      className={cn(
        "group/file flex items-center gap-3 rounded-xl border bg-card p-3 ring-1 ring-foreground/5 transition-colors",
        isError && "border-destructive/40 ring-destructive/10",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/50 text-muted-foreground",
          isError && "border-destructive/30 text-destructive",
          isSuccess &&
            "border-emerald-500/30 text-emerald-600 dark:text-emerald-500",
        )}
      >
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.preview}
            alt={file.name}
            className="size-full object-cover"
          />
        ) : (
          <Icon className="size-5" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <p
            className="truncate text-sm font-medium text-foreground"
            title={file.name}
          >
            {file.name}
          </p>
          {isSuccess && (
            <CircleCheck className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-500" />
          )}
          {isError && (
            <CircleAlert className="size-3.5 shrink-0 text-destructive" />
          )}
        </div>

        {isError ? (
          <p className="truncate text-xs text-destructive">
            {file.error ?? "آپلود ناموفق بود"}
          </p>
        ) : (
          <FileUploadProgress value={file.progress} status={file.status} />
        )}

        <p className="text-xs text-muted-foreground">
          {formatBytes(file.size)}
        </p>
      </div>

      <TooltipProvider>
        <div className="flex shrink-0 items-center gap-1">
          {isError && onRetry && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onRetry(file)}
                  aria-label={`تلاش مجدد برای ${file.name}`}
                >
                  <RefreshCw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تلاش مجدد برای آپلود</TooltipContent>
            </Tooltip>
          )}
          {onRemove && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onRemove(file)}
                  aria-label={`حذف ${file.name}`}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>حذف</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
