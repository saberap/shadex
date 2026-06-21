"use client";

import { Pencil, Trash2, Upload } from "lucide-react";
import { cn } from "@/core/utils/cn";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { FileUploadDropzone } from "./FileUploadDropzone";
import { FileUploadItem } from "./FileUploadItem";
import type { FileUploadProps } from "./types";
import { useFileUpload } from "./useFileUpload";

export function FileUpload({
  variant = "default",
  multiple = false,
  disabled = false,
  maxSize,
  maxFiles,
  accept,
  className,
  emptyLabel,
  emptyHint,
  value,
  onChange,
  onUpload,
  onRemove,
  onReject,
}: FileUploadProps) {
  const { files, addFiles, removeFile, retryFile } = useFileUpload({
    multiple,
    value,
    onChange,
    onUpload,
    onRemove,
    onReject,
    disabled,
  });

  if (variant === "avatar") {
    const current = files[0];
    const fileInputId = "file-upload-avatar-input";
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="relative">
          {current?.preview ? (
            <div className="size-20 overflow-hidden rounded-full ring-1 ring-foreground/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.preview}
                alt={current.name}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <Avatar className="size-20">
              <AvatarFallback className="text-base">
                <Upload className="size-5" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div>
            <p className="text-sm font-medium text-foreground">
              {emptyLabel ?? "تصویر پروفایل"}
            </p>
            <p className="text-xs text-muted-foreground">
              {emptyHint ?? "PNG یا JPG، حداکثر ۲ مگابایت"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={disabled}
              onClick={() => document.getElementById(fileInputId)?.click()}
            >
              <Pencil />
              {current ? "تغییر" : "بارگذاری"}
            </Button>
            {current && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeFile(current)}
                disabled={disabled}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 />
                حذف
              </Button>
            )}
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={disabled}
              onChange={(e) => {
                const list = Array.from(e.target.files ?? []);
                addFiles(list, []);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "image") {
    const current = files[0];
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {current ? (
          <div className="group/preview relative aspect-video w-full overflow-hidden rounded-xl border bg-muted/30 ring-1 ring-foreground/5">
            {current.preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.preview}
                alt={current.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <Upload className="size-6" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/50 to-transparent p-3">
              <p className="truncate text-xs font-medium text-white">
                {current.name}
              </p>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => removeFile(current)}
                className="bg-background/80 text-foreground hover:bg-background"
                aria-label="حذف تصویر"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ) : (
          <FileUploadDropzone
            variant="image"
            accept={accept ?? { "image/*": [] }}
            maxSize={maxSize}
            disabled={disabled}
            multiple={false}
            onDrop={addFiles}
            emptyLabel={emptyLabel}
            emptyHint={emptyHint}
          />
        )}
        {current && (
          <FileUploadItem
            file={current}
            onRemove={removeFile}
            onRetry={retryFile}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {(!files.length || multiple) && (
        <FileUploadDropzone
          variant="default"
          multiple={multiple}
          disabled={disabled}
          maxSize={maxSize}
          maxFiles={maxFiles}
          accept={accept}
          emptyLabel={emptyLabel}
          emptyHint={emptyHint}
          hasFiles={files.length > 0}
          onDrop={addFiles}
        />
      )}

      {files.length > 0 && (
        <>
          {multiple && files.length > 3 ? (
            <ScrollArea className="max-h-72 rounded-xl">
              <div className="flex flex-col gap-2 pe-3">
                {files.map((file) => (
                  <FileUploadItem
                    key={file.id}
                    file={file}
                    onRemove={removeFile}
                    onRetry={retryFile}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col gap-2">
              {files.map((file) => (
                <FileUploadItem
                  key={file.id}
                  file={file}
                  onRemove={removeFile}
                  onRetry={retryFile}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
