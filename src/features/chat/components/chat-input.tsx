"use client";

import {
  Image as ImageIcon,
  Paperclip,
  SendHorizontal,
  Smile,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/core/utils/cn";
import { useChat } from "../hooks/use-chat";
import { EmojiPicker } from "./emoji-picker";
import { ReplyComposerBar } from "./message-reply";

interface ChatInputProps {
  conversationId: string;
}

export function ChatInput({ conversationId }: ChatInputProps) {
  const { sendMessage, pendingReply, setPendingReply } = useChat();
  const [value, setValue] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [value]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [conversationId]);

  useEffect(() => {
    if (pendingReply) {
      textareaRef.current?.focus();
    }
  }, [pendingReply]);

  const insertEmoji = useCallback((emoji: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      setValue((prev) => prev + emoji);
      return;
    }
    const start = ta.selectionStart ?? value.length;
    const end = ta.selectionEnd ?? value.length;
    const next = value.slice(0, start) + emoji + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      ta.focus();
      const cursor = start + emoji.length;
      ta.setSelectionRange(cursor, cursor);
    });
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    sendMessage({
      conversationId,
      content: trimmed,
      replyTo: pendingReply ?? undefined,
    });
    setValue("");
  }, [value, sendMessage, conversationId, pendingReply]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0;

  return (
    <div className="shrink-0 border-t bg-background/95 px-3 py-3 sm:px-4">
      {pendingReply && (
        <ReplyComposerBar
          reply={pendingReply}
          onCancel={() => setPendingReply(null)}
        />
      )}

      <div className="rounded-2xl border bg-card shadow-sm transition-shadow focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/20">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          rows={1}
          className="block w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          style={{ minHeight: "2.5rem", maxHeight: "160px" }}
          aria-label="Message input"
        />

        <div className="flex h-10 items-center gap-0.5 px-1.5 pb-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                aria-label="Attach file"
              >
                <Paperclip className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Attach file</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                aria-label="Upload image"
              >
                <ImageIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Upload image</TooltipContent>
          </Tooltip>

          <Separator
            orientation="vertical"
            className="mx-1 data-vertical:h-5 data-vertical:self-center"
          />

          <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground"
                    aria-label="Insert emoji"
                  >
                    <Smile className="size-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">Emoji</TooltipContent>
            </Tooltip>
            <PopoverContent
              side="top"
              align="start"
              className="w-auto p-0"
              sideOffset={8}
            >
              <EmojiPicker
                onSelect={(emoji) => {
                  insertEmoji(emoji);
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="ml-auto" />

          <Button
            type="button"
            size="icon"
            className={cn(
              "size-8 rounded-lg transition-colors",
              canSend
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground hover:bg-muted"
            )}
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
          >
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <p className="mt-1.5 px-1 text-center text-[10px] text-muted-foreground/70">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
