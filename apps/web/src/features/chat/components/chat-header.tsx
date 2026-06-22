"use client";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui";
import {
  Archive,
  ArrowLeft,
  BellOff,
  ChevronDown,
  MoreHorizontal,
  Phone,
  Pin,
  Search,
  Star,
  Video,
} from "lucide-react";
import { useChat } from "../hooks/use-chat";
import type { Conversation, UserStatus } from "../types";
import {
  getConversationDisplayName,
  getConversationPartner,
  statusColor,
} from "../utils";
import { ConversationAvatar } from "./conversation-avatar";

const STATUS_LABEL: Record<UserStatus, string> = {
  online: "آنلاین",
  away: "غایب",
  busy: "مشغول",
  offline: "آفلاین",
};

interface ChatHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  const { users, currentUser, togglePinned, toggleMuted, toggleArchived } =
    useChat();

  const displayName = getConversationDisplayName(
    conversation,
    users,
    currentUser.id,
  );

  const partner = getConversationPartner(conversation, users, currentUser.id);
  const participantNames =
    conversation.kind === "group"
      ? conversation.participantIds
          .filter((id) => id !== currentUser.id)
          .map((id) => users[id]?.name.split(" ")[0])
          .filter(Boolean)
          .slice(0, 3)
          .join(", ")
      : null;

  return (
    <div className="flex shrink-0 items-center gap-3 border-b bg-background/95 px-3 py-2.5 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-4">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 lg:hidden"
          onClick={onBack}
          aria-label="بازگشت به گفتگوها"
        >
          <ArrowLeft className="size-4" />
        </Button>
      )}

      <ConversationAvatar
        conversation={conversation}
        users={users}
        currentUserId={currentUser.id}
        showStatus={conversation.kind === "direct"}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </span>
          {conversation.pinned && (
            <Pin className="size-3 shrink-0 text-muted-foreground/70" />
          )}
          {conversation.muted && (
            <BellOff className="size-3 shrink-0 text-muted-foreground/70" />
          )}
          {conversation.archived && (
            <Badge variant="secondary" className="h-4 px-1 text-[10px]">
              آرشیو
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {conversation.kind === "direct" && partner ? (
            <>
              <span
                aria-hidden
                className={`inline-block size-1.5 rounded-full ${statusColor(
                  partner.status,
                )}`}
              />
              <span>{STATUS_LABEL[partner.status]}</span>
              <span aria-hidden>·</span>
              <span>{partner.role}</span>
            </>
          ) : (
            <>
              <span>{conversation.participantIds.length} عضو</span>
              {participantNames && (
                <>
                  <span aria-hidden>·</span>
                  <span className="truncate">{participantNames}</span>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="جستجو در گفتگو"
            >
              <Search className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">جستجو</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="شروع تماس"
            >
              <Phone className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">تماس صوتی</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="شروع تماس تصویری"
            >
              <Video className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">تماس تصویری</TooltipContent>
        </Tooltip>

        <Separator
          orientation="vertical"
          className="mx-1 data-vertical:h-5 data-vertical:self-center"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="گزینه‌های گفتگو"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">گفتگو</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => togglePinned(conversation.id)}>
              <Star className="size-4" />
              {conversation.pinned ? "حذف سنجاق" : "سنجاق کردن"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleMuted(conversation.id)}>
              <BellOff className="size-4" />
              {conversation.muted ? "فعال‌سازی صدا" : "بی‌صدا"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toggleArchived(conversation.id)}>
              <Archive className="size-4" />
              {conversation.archived ? "خروج از آرشیو" : "آرشیو"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ChevronDown className="size-4" />
              مشاهده جزئیات
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
