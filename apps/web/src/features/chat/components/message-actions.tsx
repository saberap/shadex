"use client";

import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui";
import {
  Copy,
  CornerUpLeft,
  Forward,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useMessageActions } from "../hooks/use-message-actions";
import type { Message } from "../types";

interface MessageActionsProps {
  message: Message;
  align?: "start" | "end";
}

export function MessageActions({
  message,
  align = "end",
}: MessageActionsProps) {
  const { replyTo, forward, copy, remove, canDelete } = useMessageActions();
  const deletable = canDelete(message);

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-20 flex items-center gap-0.5 rounded-lg border bg-popover/95 px-0.5 py-0.5 opacity-0 shadow-sm backdrop-blur transition-opacity",
        "group-hover/message:pointer-events-auto group-hover/message:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100",
        "-top-2.5",
        align === "end" ? "end-2" : "start-2",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground"
            onClick={() => replyTo(message)}
            aria-label="پاسخ به پیام"
          >
            <CornerUpLeft className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">پاسخ</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground"
            onClick={() => forward(message)}
            aria-label="هدایت پیام"
          >
            <Forward className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">هدایت</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground"
            onClick={() => copy(message)}
            aria-label="کپی پیام"
          >
            <Copy className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">کپی</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 text-muted-foreground hover:text-foreground"
                aria-label="اقدامات بیشتر"
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">بیشتر</TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          align={align === "end" ? "end" : "start"}
          className="w-40"
        >
          <DropdownMenuItem onClick={() => replyTo(message)}>
            <CornerUpLeft className="size-4" />
            پاسخ
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => forward(message)}>
            <Forward className="size-4" />
            هدایت
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copy(message)}>
            <Copy className="size-4" />
            کپی متن
          </DropdownMenuItem>
          {deletable && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => remove(message)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4" />
                حذف
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
