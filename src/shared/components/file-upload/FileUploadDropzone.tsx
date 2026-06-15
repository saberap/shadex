"use client";

import { Image as ImageIcon, Upload, User } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/core/utils/cn";
import type { FileUploadDropzoneProps } from "./types";

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  return `${(bytes / 1024 ** i).toFixed(0)} ${units[i]}`;
}

export function FileUploadDropzone({
  multiple,
  disabled,
  maxSize,
  maxFiles,
  accept,
  variant = "default",
  className,
  emptyLabel,
  emptyHint,
  hasFiles,
  onDrop,
}: FileUploadDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      multiple,
      disabled,
      maxSize,
      maxFiles,
      accept,
      onDrop,
    });

  if (variant === "avatar") {
    return (
      <div
        {...getRootProps({
          className: cn(
            "group/avatar-dropzone relative flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed bg-muted/30 text-muted-foreground outline-none transition-colors",
            "hover:border-foreground/30 hover:bg-muted/50 hover:text-foreground",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
            isDragActive && "border-primary/60 bg-primary/5 text-primary",
            isDragReject &&
              "border-destructive/60 bg-destructive/5 text-destructive",
            disabled && "pointer-events-none opacity-60",
            className,
          ),
        })}
      >
        <input {...getInputProps()} aria-label="Upload avatar" />
        <div className="flex flex-col items-center gap-1">
          <User className="size-6" />
          <span className="text-[10px] font-medium uppercase tracking-wide">
            Upload
          </span>
        </div>
      </div>
    );
  }

  if (variant === "image") {
    return (
      <div
        {...getRootProps({
          className: cn(
            "group/image-dropzone relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed bg-muted/30 p-6 text-center text-muted-foreground outline-none transition-colors",
            "hover:border-foreground/30 hover:bg-muted/50",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
            isDragActive && "border-primary/60 bg-primary/5 text-foreground",
            isDragReject &&
              "border-destructive/60 bg-destructive/5 text-destructive",
            disabled && "pointer-events-none opacity-60",
            className,
          ),
        })}
      >
        <input {...getInputProps()} aria-label="Upload image" />
        <div className="flex size-10 items-center justify-center rounded-lg bg-background ring-1 ring-foreground/10">
          <ImageIcon className="size-5" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-foreground">
            {emptyLabel ?? "Drop image to upload"}
          </p>
          <p className="text-xs text-muted-foreground">
            {emptyHint ?? "PNG, JPG, WEBP or SVG"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps({
        className: cn(
          "group/dropzone relative flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center outline-none transition-colors",
          "hover:border-foreground/30 hover:bg-muted/50",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
          isDragActive && "border-primary/60 bg-primary/5",
          isDragReject && "border-destructive/60 bg-destructive/5",
          disabled && "pointer-events-none opacity-60",
          hasFiles && "py-6",
          className,
        ),
      })}
    >
      <input {...getInputProps()} aria-label="Upload files" />

      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-foreground/10 transition-colors",
          isDragActive && "text-primary",
        )}
      >
        <Upload className="size-5" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          {isDragActive
            ? isDragReject
              ? "This file type isn't supported"
              : "Drop to upload"
            : (emptyLabel ?? "Click to upload or drag and drop")}
        </p>
        <p className="text-xs text-muted-foreground">
          {emptyHint ??
            (maxSize
              ? `Up to ${formatBytes(maxSize)} per file`
              : "Any file type")}
        </p>
      </div>
    </div>
  );
}
