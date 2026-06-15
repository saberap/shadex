"use client";

import { CornerUpLeft, Image as ImageIcon, Paperclip, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/core/utils/cn";
import type { ReplyReference } from "../types";

interface InlineReplyPreviewProps {
  reply: ReplyReference;
  variant?: "incoming" | "outgoing";
}

export function InlineReplyPreview({
  reply,
  variant = "incoming",
}: InlineReplyPreviewProps) {
  return (
    <div
      className={cn(
        "mb-1.5 flex items-start gap-2 rounded-md border-l-2 bg-background/40 px-2 py-1.5 text-xs",
        variant === "outgoing"
          ? "border-l-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground/90"
          : "border-l-primary/40 bg-muted text-muted-foreground"
      )}
    >
      <CornerUpLeft className="mt-0.5 size-3 shrink-0 opacity-60" />
      <div className="flex min-w-0 flex-col">
        <span
          className={cn(
            "truncate text-[11px] font-medium",
            variant === "outgoing" ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {reply.authorName}
        </span>
        <span className="line-clamp-2 text-[11px] opacity-80">
          {reply.type === "image" ? (
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="size-3" /> Photo
            </span>
          ) : reply.type === "file" ? (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3" /> Attachment
            </span>
          ) : (
            reply.preview
          )}
        </span>
      </div>
    </div>
  );
}

interface ReplyComposerBarProps {
  reply: ReplyReference;
  onCancel: () => void;
}

export function ReplyComposerBar({ reply, onCancel }: ReplyComposerBarProps) {
  return (
    <div className="mx-1 mb-2 flex items-start gap-2 rounded-lg border bg-muted/60 px-3 py-2">
      <CornerUpLeft className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-medium text-foreground">
          Replying to {reply.authorName}
        </span>
        <span className="line-clamp-1 truncate text-[11px] text-muted-foreground">
          {reply.type === "image"
            ? "Photo"
            : reply.type === "file"
            ? "Attachment"
            : reply.preview}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-6 text-muted-foreground hover:text-foreground"
        onClick={onCancel}
        aria-label="Cancel reply"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
