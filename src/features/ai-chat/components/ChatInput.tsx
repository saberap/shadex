"use client";

import {
  AtSign,
  File,
  FileText,
  Image,
  Mic,
  Paperclip,
  Send,
  Square,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { cn } from "@/core/utils/cn";
import { ModelSelector } from "./ModelSelector";
import { useChatContext } from "../context/ChatContext";
import type { Attachment } from "../types";

const ACCEPTED_TYPES = ".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.zip";
const MAX_FILE_SIZE_MB = 25;

function getFileType(file: File): Attachment["type"] {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const map: Record<string, Attachment["type"]> = {
    pdf: "pdf", docx: "docx", xlsx: "xlsx", csv: "csv",
    png: "png", jpg: "jpg", jpeg: "jpg", zip: "zip",
  };
  return map[ext ?? ""] ?? "pdf";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

interface AttachmentPillProps {
  attachment: Attachment;
  onRemove: (id: string) => void;
}

function AttachmentPill({ attachment, onRemove }: AttachmentPillProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="group relative flex items-center gap-2 rounded-lg border border-border/60 bg-muted/60 px-3 py-2 text-xs"
    >
      {attachment.type === "png" || attachment.type === "jpg" ? (
        <Image className="size-3.5 shrink-0 text-blue-500" />
      ) : (
        <FileText className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="max-w-[120px] truncate font-medium">{attachment.name}</span>
        {attachment.status === "uploading" ? (
          <Progress value={attachment.uploadProgress} className="h-1 w-20" />
        ) : (
          <span className="text-muted-foreground">{formatBytes(attachment.size)}</span>
        )}
      </div>
      {attachment.status === "success" && (
        <Badge variant="secondary" className="ml-0.5 h-3.5 px-1 text-[9px] text-emerald-600">
          ✓
        </Badge>
      )}
      <button
        onClick={() => onRemove(attachment.id)}
        className="ml-0.5 rounded text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Remove attachment"
      >
        <X className="size-3" />
      </button>
    </motion.div>
  );
}

export function ChatInput() {
  const { sendMessage, isStreaming, stopStreaming, activeConversationId } =
    useChatContext();

  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  // Focus on conversation change
  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeConversationId]);

  const handleSend = useCallback(() => {
    if (isStreaming) {
      stopStreaming();
      return;
    }
    const trimmed = value.trim();
    if (!trimmed) return;
    sendMessage(trimmed, attachments.length > 0 ? attachments : undefined);
    setValue("");
    setAttachments([]);
  }, [value, attachments, isStreaming, sendMessage, stopStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newAttachments: Attachment[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE_MB * 1_048_576) continue;
      const att: Attachment = {
        id: Math.random().toString(36).slice(2),
        name: file.name,
        type: getFileType(file),
        size: file.size,
        status: "uploading",
        uploadProgress: 0,
      };
      newAttachments.push(att);
      // Simulate upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;
        if (progress >= 100) {
          clearInterval(interval);
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === att.id ? { ...a, status: "success", uploadProgress: 100 } : a
            )
          );
        } else {
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === att.id ? { ...a, uploadProgress: progress } : a
            )
          );
        }
      }, 200);
    }
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      addFiles(e.clipboardData.files);
    }
  };

  const canSend = value.trim().length > 0 || isStreaming;

  return (
    <div className="shrink-0 border-t border-border/50 bg-background/80 backdrop-blur-sm px-4 sm:px-6 py-3">
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative mx-auto max-w-3xl rounded-2xl border bg-card shadow-sm transition-all duration-200",
          isDragging
            ? "border-primary/50 shadow-md shadow-primary/10"
            : "border-border/60"
        )}
      >
        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary/5 ring-2 ring-primary/30 ring-inset"
            >
              <File className="size-8 text-primary/60" />
              <p className="text-sm font-medium text-primary/80">Drop files to attach</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 border-b border-border/40 px-4 py-3"
            >
              {attachments.map((att) => (
                <AttachmentPill
                  key={att.id}
                  attachment={att}
                  onRemove={(id) =>
                    setAttachments((prev) => prev.filter((a) => a.id !== id))
                  }
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <div className="px-4 pt-3 pb-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask anything…"
            rows={1}
            disabled={false}
            className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
            style={{ minHeight: "2rem", maxHeight: "200px" }}
            aria-label="Chat message input"
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 px-3 pb-3">
          <div className="flex items-center gap-1">
            {/* Attachment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach file"
                >
                  <Paperclip className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach file</TooltipContent>
            </Tooltip>

            {/* Image */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload image"
                >
                  <Image className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Upload image</TooltipContent>
            </Tooltip>

            {/* Voice */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  aria-label="Voice input"
                >
                  <Mic className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Voice input</TooltipContent>
            </Tooltip>

            {/* Mention */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  aria-label="Mention"
                >
                  <AtSign className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Mention</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-4" />

            <ModelSelector compact />
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] text-muted-foreground/60 sm:block">
              {isStreaming ? "Generating…" : "Enter ↵ to send · Shift+Enter for newline"}
            </span>
            <Button
              size="icon"
              className={cn(
                "size-8 rounded-xl transition-all",
                isStreaming
                  ? "bg-primary/10 text-destructive-foreground hover:bg-primary/20"
                  : canSend
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              onClick={handleSend}
              disabled={!canSend && !isStreaming}
              aria-label={isStreaming ? "Stop generation" : "Send message"}
            >
              {isStreaming ? <Square className="size-3.5" /> : <Send className="size-3.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
        AI can make mistakes. Verify important information.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}
