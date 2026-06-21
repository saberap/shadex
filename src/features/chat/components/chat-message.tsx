"use client";

import {
  Check,
  CheckCheck,
  Clock,
  File as FileIcon,
  Forward,
} from "lucide-react";
import { cn } from "@/core/utils/cn";
import { formatFileSize, formatMessageTime } from "../utils";
import { MessageActions } from "./message-actions";
import { InlineReplyPreview } from "./message-reply";
import type { ChatUser, Message, MessageAttachment, MessageStatus } from "../types";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  author: ChatUser | undefined;
  showHeader: boolean;
}

export function ChatMessage({
  message,
  isOwn,
  isFirstInGroup,
  isLastInGroup,
  author,
  showHeader,
}: ChatMessageProps) {
  if (message.type === "system") {
    return <SystemMessage content={message.content} />;
  }

  return (
    <div
      className={cn(
        "group/message relative flex w-full px-2",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative flex max-w-[78%] flex-col gap-1",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {showHeader && author && !isOwn && (
          <div className="ms-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">{author.name}</span>
            <span aria-hidden>·</span>
            <span>{formatMessageTime(message.createdAt)}</span>
          </div>
        )}

        <MessageActions message={message} align={isOwn ? "end" : "start"} />

        <div
          className={cn(
            "relative max-w-full whitespace-pre-wrap wrap-break-word rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-[0_1px_0_rgba(0,0,0,0.02)]",
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
            !isFirstInGroup && (isOwn ? "rounded-tr-md" : "rounded-tl-md"),
            !isLastInGroup && (isOwn ? "rounded-br-md" : "rounded-bl-md")
          )}
        >
          {message.forwardedFrom && (
            <div
              className={cn(
                "mb-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wide",
                isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              <Forward className="size-3" />
              هدایت‌شده از {message.forwardedFrom.fromConversationName}
            </div>
          )}

          {message.replyTo && (
            <InlineReplyPreview
              reply={message.replyTo}
              variant={isOwn ? "outgoing" : "incoming"}
            />
          )}

          {message.type === "image" && (
            <ImageAttachments attachments={message.attachments} />
          )}

          {message.type === "file" && (
            <FileAttachments
              attachments={message.attachments}
              isOwn={isOwn}
            />
          )}

          {message.content && (
            <p
              className={cn(
                message.type !== "text" && "mt-1.5"
              )}
            >
              {message.content}
            </p>
          )}

          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-[10px]",
              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            <span>{formatMessageTime(message.createdAt)}</span>
            {message.edited && <span>· ویرایش‌شده</span>}
            {isOwn && <MessageStatusIcon status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageStatusIcon({ status }: { status: MessageStatus }) {
  if (status === "sending") {
    return <Clock className="size-3" />;
  }
  if (status === "sent") {
    return <Check className="size-3" />;
  }
  if (status === "delivered") {
    return <CheckCheck className="size-3" />;
  }
  return <CheckCheck className="size-3 text-sky-300" />;
}

function ImageAttachments({
  attachments,
}: {
  attachments?: MessageAttachment[];
}) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className="grid gap-1.5">
      {attachments.map((att) => (
        <div
          key={att.id}
          className={cn(
            "relative h-44 w-full max-w-sm overflow-hidden rounded-lg border border-border/50",
            "bg-linear-to-br",
            att.previewColor ?? "from-muted via-muted to-muted-foreground/20"
          )}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-2 start-2 end-2 flex items-center justify-between text-[11px] text-white">
            <span className="truncate font-medium">{att.name}</span>
            <span className="shrink-0">{formatFileSize(att.size)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FileAttachments({
  attachments,
  isOwn,
}: {
  attachments?: MessageAttachment[];
  isOwn: boolean;
}) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      {attachments.map((att) => (
        <div
          key={att.id}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-2.5 py-2",
            isOwn
              ? "border-primary-foreground/20 bg-primary-foreground/10"
              : "border-border/60 bg-background/60"
          )}
        >
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md",
              isOwn
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            <FileIcon className="size-4" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span
              className={cn(
                "truncate text-xs font-medium",
                isOwn ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {att.name}
            </span>
            <span
              className={cn(
                "text-[10px]",
                isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {formatFileSize(att.size)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SystemMessage({ content }: { content: string }) {
  return (
    <div className="flex w-full justify-center px-4">
      <div className="rounded-full bg-muted/70 px-3 py-1 text-[11px] text-muted-foreground">
        {content}
      </div>
    </div>
  );
}
