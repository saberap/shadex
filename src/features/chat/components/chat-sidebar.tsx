"use client";

import { useState } from "react";
import {
  MessageSquarePlus,
  Search,
  Settings2,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Badge } from "@/shared/components/ui/badge";
import { useChat } from "../hooks/use-chat";
import { useConversations } from "../hooks/use-conversations";
import { ChatList } from "./chat-list";
import { NewConversationDialog } from "./new-conversation-dialog";
import { PreferencesDialog } from "./preferences-dialog";
import { UserAvatar } from "./user-avatar";

interface ChatSidebarProps {
  onSelectConversation?: () => void;
}

export function ChatSidebar({ onSelectConversation }: ChatSidebarProps) {
  const { currentUser, searchQuery, setSearchQuery } = useChat();
  const { totalUnread } = useConversations();
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-card">
      <div className="flex shrink-0 items-center gap-3 px-4 pt-4 pb-3">
        <UserAvatar user={currentUser} size="default" showStatus />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold leading-tight text-foreground">
            Messages
          </span>
          <span className="truncate text-[11px] text-muted-foreground">
            {totalUnread > 0
              ? `${totalUnread} unread`
              : "You're all caught up"}
          </span>
        </div>
        {totalUnread > 0 && (
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
            {totalUnread}
          </Badge>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="New conversation"
              onClick={() => setNewConversationOpen(true)}
            >
              <MessageSquarePlus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">New conversation</TooltipContent>
        </Tooltip>
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 rounded-lg pl-8 pr-8 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <div className="pt-3">
          <ChatList onSelect={onSelectConversation} />
        </div>
      </ScrollArea>

      <Separator />

      <div className="flex shrink-0 items-center gap-2 px-4 py-3">
        <UserAvatar user={currentUser} size="sm" showStatus />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs font-medium text-foreground">
            {currentUser.name}
          </span>
          <span className="truncate text-[11px] text-muted-foreground">
            {currentUser.role}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Preferences"
              onClick={() => setPreferencesOpen(true)}
            >
              <Settings2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Preferences</TooltipContent>
        </Tooltip>
      </div>

      <NewConversationDialog
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
      />
      <PreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
      />
    </div>
  );
}
