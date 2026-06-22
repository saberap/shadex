"use client";

import {
  Badge,
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  Skeleton,
} from "@repo/ui";
import {
  Archive,
  Bell,
  BellOff,
  Briefcase,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Inbox,
  type LucideIcon,
  MessageCircle,
  MoreHorizontal,
  Pin,
  PinOff,
  Star,
  Trash2,
  Users2,
} from "lucide-react";
import { useChat } from "../hooks/use-chat";
import {
  type ConversationSummary,
  useConversations,
} from "../hooks/use-conversations";
import type { ChatUser, Conversation, GroupIconName } from "../types";
import { formatConversationTimestamp } from "../utils";
import { ConversationAvatar } from "./conversation-avatar";

const GROUP_ICONS: Record<GroupIconName, LucideIcon> = {
  favorites: Star,
  direct: MessageCircle,
  teams: Users2,
  clients: Briefcase,
  projects: FolderKanban,
  archived: Archive,
};

interface ChatListProps {
  onSelect?: () => void;
}

export function ChatList({ onSelect }: ChatListProps) {
  const {
    activeConversationId,
    setActiveConversationId,
    collapsedGroups,
    toggleGroup,
    users,
    currentUser,
  } = useChat();
  const { groups, searchQuery } = useConversations();

  if (groups.length === 0) {
    return <EmptyState searching={Boolean(searchQuery.trim())} />;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 overflow-hidden px-3 pb-6">
      {groups.map(({ group, items }, index) => {
        const Icon = GROUP_ICONS[group.icon];
        const collapsed = Boolean(collapsedGroups[group.id]);
        const unreadCount = items.reduce(
          (sum, summary) => sum + summary.conversation.unreadCount,
          0,
        );

        return (
          <div key={group.id} className="flex flex-col">
            {index > 0 && <Separator className="mb-3 opacity-60" />}
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              className="group/section flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              aria-expanded={!collapsed}
            >
              <Icon className="size-3.5" />
              <span className="uppercase tracking-wide">{group.name}</span>
              <span className="ms-auto flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-4 min-w-4 px-1 text-[10px] font-medium"
                  >
                    {unreadCount}
                  </Badge>
                )}
                <span className="text-muted-foreground/60">{items.length}</span>
                {collapsed ? (
                  <ChevronRight className="size-3.5 transition-transform" />
                ) : (
                  <ChevronDown className="size-3.5 transition-transform" />
                )}
              </span>
            </button>

            {!collapsed && (
              <div className="mt-1 flex flex-col gap-0.5">
                {items.map((summary) => (
                  <ConversationRow
                    key={summary.conversation.id}
                    summary={summary}
                    active={summary.conversation.id === activeConversationId}
                    users={users}
                    currentUserId={currentUser.id}
                    onSelect={() => {
                      setActiveConversationId(summary.conversation.id);
                      onSelect?.();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ConversationRowProps {
  summary: ConversationSummary;
  active: boolean;
  users: Record<string, ChatUser>;
  currentUserId: string;
  onSelect: () => void;
}

function ConversationRow({
  summary,
  active,
  users,
  currentUserId,
  onSelect,
}: ConversationRowProps) {
  const { conversation, displayName, lastMessage, preview } = summary;
  const hasUnread = conversation.unreadCount > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      data-active={active}
      className={cn(
        "group/row relative flex w-full min-w-0 cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3 py-2 text-start outline-none transition-colors",
        "hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/40",
        active && "bg-muted text-foreground",
      )}
    >
      <ConversationAvatar
        conversation={conversation}
        users={users}
        currentUserId={currentUserId}
        showStatus={conversation.kind === "direct"}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              hasUnread
                ? "font-semibold text-foreground"
                : "font-medium text-foreground/90",
            )}
          >
            {displayName}
          </span>
          {conversation.pinned && (
            <Pin className="size-3 shrink-0 text-muted-foreground/70" />
          )}
          {conversation.muted && (
            <BellOff className="size-3 shrink-0 text-muted-foreground/70" />
          )}
          <span className="shrink-0 text-[10px] text-muted-foreground group-hover/row:opacity-0 group-focus-within/row:opacity-0">
            {lastMessage
              ? formatConversationTimestamp(lastMessage.createdAt)
              : ""}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-xs",
              hasUnread ? "text-foreground/80" : "text-muted-foreground",
            )}
          >
            {lastMessage?.authorId === currentUserId && (
              <span className="me-1 text-muted-foreground/70">شما:</span>
            )}
            {preview}
          </span>
          {hasUnread && (
            <Badge className="ms-auto h-4 min-w-4 shrink-0 px-1 text-[10px]">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
      <ConversationRowActions conversation={conversation} />
    </button>
  );
}

interface ConversationRowActionsProps {
  conversation: Conversation;
}

function ConversationRowActions({ conversation }: ConversationRowActionsProps) {
  const { togglePinned, toggleMuted, toggleArchived, markAsRead } = useChat();

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: stop-propagation overlay, not interactive
    // biome-ignore lint/a11y/useKeyWithClickEvents: stop-propagation overlay only
    <div
      className="pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/row:pointer-events-auto group-hover/row:opacity-100 group-focus-within/row:pointer-events-auto group-focus-within/row:opacity-100 data-[state=open]:pointer-events-auto data-[state=open]:opacity-100"
      onClick={stop}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 rounded-md bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border/60 hover:bg-background hover:text-foreground"
            aria-label="گزینه‌های گفتگو"
            onClick={stop}
            onPointerDown={stop}
          >
            <MoreHorizontal className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-44"
          onClick={stop}
        >
          {conversation.unreadCount > 0 && (
            <DropdownMenuItem onSelect={() => markAsRead(conversation.id)}>
              <CheckCheck className="size-4" />
              علامت‌گذاری به عنوان خوانده‌شده
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => togglePinned(conversation.id)}>
            {conversation.pinned ? (
              <>
                <PinOff className="size-4" />
                حذف سنجاق
              </>
            ) : (
              <>
                <Pin className="size-4" />
                سنجاق کردن
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toggleMuted(conversation.id)}>
            {conversation.muted ? (
              <>
                <Bell className="size-4" />
                فعال‌سازی صدا
              </>
            ) : (
              <>
                <BellOff className="size-4" />
                بی‌صدا
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => toggleArchived(conversation.id)}>
            <Archive className="size-4" />
            {conversation.archived ? "خروج از آرشیو" : "آرشیو"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => toggleArchived(conversation.id)}
          >
            <Trash2 className="size-4" />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function EmptyState({ searching }: { searching: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        {searching ? "گفتگویی یافت نشد" : "هنوز گفتگویی وجود ندارد"}
      </p>
      <p className="text-xs text-muted-foreground">
        {searching
          ? "عبارت دیگری را امتحان کنید."
          : "برای شروع، یک گفتگوی جدید آغاز کنید."}
      </p>
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 py-4">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton, no unique id available
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-2.5 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
