"use client";

import {
  Archive,
  Copy,
  FileAudio,
  FileText,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Share2,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/core/utils/cn";
import type { Conversation } from "../types";
import { useChatContext } from "../context/ChatContext";
import { MODELS } from "../data";

interface ConversationItemProps {
  conversation: Conversation;
}

const ACTIVITY_ICONS = {
  image: { icon: ImageIcon, label: "تصویر" },
  file: { icon: FileText, label: "فایل" },
  voice: { icon: FileAudio, label: "صوت" },
  shared: { icon: Share2, label: "اشتراک‌گذاری‌شده" },
};

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toFaDigits = (n: number) =>
  String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "همین حالا";
  if (seconds < 3600) return `${toFaDigits(Math.floor(seconds / 60))} دقیقه پیش`;
  if (seconds < 86400) return `${toFaDigits(Math.floor(seconds / 3600))} ساعت پیش`;
  if (seconds < 604800) return `${toFaDigits(Math.floor(seconds / 86400))} روز پیش`;
  return date.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
}

export function ConversationItem({ conversation }: ConversationItemProps) {
  const {
    activeConversationId,
    selectConversation,
    togglePin,
    toggleFavorite,
    archiveConversation,
    renameConversation,
    duplicateConversation,
    deleteConversation,
  } = useChatContext();

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(conversation.title);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = activeConversationId === conversation.id;
  const model = MODELS.find((m) => m.id === conversation.model);

  if (conversation.isGeneratingTitle) {
    return (
      <div className="px-2 py-1.5">
        <div className="rounded-xl px-3 py-2.5 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
    );
  }

  const handleRenameSubmit = () => {
    if (renameValue.trim()) {
      renameConversation(conversation.id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div className="group/item relative px-2 py-0.5">
      <button
        onClick={() => selectConversation(conversation.id)}
        className={cn(
          "w-full rounded-xl px-3 py-2.5 text-left transition-all duration-150",
          "hover:bg-muted/60",
          isActive && "bg-primary/8 ring-1 ring-primary/20 hover:bg-primary/8",
          menuOpen && !isActive && "bg-muted/60"
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          {isRenaming ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
                if (e.key === "Escape") {
                  setRenameValue(conversation.title);
                  setIsRenaming(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 bg-transparent text-sm font-medium outline-none border-b border-primary"
            />
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              {conversation.pinned && (
                <Pin className="size-2.5 shrink-0 text-muted-foreground rotate-45" />
              )}
              {conversation.favorite && (
                <Star className="size-2.5 shrink-0 fill-yellow-400 text-yellow-400" />
              )}
              {conversation.shared && (
                <Share2 className="size-2.5 shrink-0 text-blue-400" />
              )}
              <span
                className={cn(
                  "truncate text-sm",
                  isActive
                    ? "font-medium text-foreground"
                    : "font-normal text-foreground/80"
                )}
              >
                {conversation.title}
              </span>
            </div>
          )}

          {/* Context menu trigger */}
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "size-5 shrink-0 rounded-md opacity-0 transition-opacity",
                  "group-hover/item:opacity-100",
                  menuOpen && "opacity-100",
                  isActive && "opacity-100"
                )}
              >
                <MoreHorizontal className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={() => {
                  setIsRenaming(true);
                  setMenuOpen(false);
                }}
              >
                <Pencil className="me-2 size-3.5" />
                تغییر نام
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => duplicateConversation(conversation.id)}
              >
                <Copy className="me-2 size-3.5" />
                تکثیر
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => togglePin(conversation.id)}>
                {conversation.pinned ? (
                  <>
                    <PinOff className="me-2 size-3.5" />
                    حذف سنجاق
                  </>
                ) : (
                  <>
                    <Pin className="me-2 size-3.5" />
                    سنجاق
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleFavorite(conversation.id)}>
                {conversation.favorite ? (
                  <>
                    <StarOff className="me-2 size-3.5" />
                    حذف از علاقه‌مندی‌ها
                  </>
                ) : (
                  <>
                    <Star className="me-2 size-3.5" />
                    علاقه‌مندی
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => archiveConversation(conversation.id)}>
                <Archive className="me-2 size-3.5" />
                بایگانی
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteConversation(conversation.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="me-2 size-3.5" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Preview */}
        <p className="mb-1.5 line-clamp-1 text-xs text-muted-foreground leading-relaxed">
          {conversation.preview || "هنوز پیامی وجود ندارد"}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {model && (
              <Badge
                variant="secondary"
                className="h-4 px-1.5 text-[10px] font-medium"
              >
                {model.name}
              </Badge>
            )}
            {conversation.activity?.map((act) => {
              const cfg = ACTIVITY_ICONS[act];
              return (
                <cfg.icon
                  key={act}
                  className="size-2.5 text-muted-foreground/70"
                  aria-label={cfg.label}
                />
              );
            })}
          </div>
          <span className="shrink-0 text-[10px] text-muted-foreground/60">
            {timeAgo(conversation.updatedAt)}
          </span>
        </div>
      </button>
    </div>
  );
}
