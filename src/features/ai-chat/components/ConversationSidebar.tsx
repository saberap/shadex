"use client";

import {
  Bot,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  MessageSquarePlus,
  Pin,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/core/utils/cn";
import { ConversationItem } from "./ConversationItem";
import { useChatContext } from "../context/ChatContext";
import type { Conversation } from "../types";

type GroupKey = "pinned" | "today" | "yesterday" | "last7" | "last30" | "older";

const GROUP_LABELS: Record<GroupKey, string> = {
  pinned: "سنجاق‌شده",
  today: "امروز",
  yesterday: "دیروز",
  last7: "۷ روز گذشته",
  last30: "۳۰ روز گذشته",
  older: "قدیمی‌تر",
};

function getGroup(conv: Conversation): GroupKey {
  if (conv.pinned) return "pinned";
  const now = Date.now();
  const ms = now - conv.updatedAt.getTime();
  const hours = ms / 3_600_000;
  if (hours < 24) return "today";
  if (hours < 48) return "yesterday";
  if (hours < 168) return "last7";
  if (hours < 720) return "last30";
  return "older";
}

interface GroupSectionProps {
  label: string;
  conversations: Conversation[];
  icon?: React.ReactNode;
  defaultOpen?: boolean;
}

function GroupSection({ label, conversations, icon, defaultOpen = true }: GroupSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (conversations.length === 0) return null;

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-1.5 px-4 py-1.5 hover:bg-muted/40 transition-colors group"
      >
        {icon}
        <span className="flex-1 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {label}
        </span>
        <span className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
          {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {conversations.map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FolderSectionProps {
  name: string;
  color: string;
  conversations: Conversation[];
}

function FolderSection({ name, color, conversations }: FolderSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-0.5">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/40 mx-2 transition-colors"
        style={{ width: "calc(100% - 1rem)" }}
      >
        <div className={cn("size-2 rounded-sm", color)} />
        {open ? (
          <FolderOpen className="size-3.5 text-muted-foreground" />
        ) : (
          <Folder className="size-3.5 text-muted-foreground" />
        )}
        <span className="flex-1 text-left text-xs font-medium text-foreground/80">{name}</span>
        <span className="text-[10px] text-muted-foreground/60">{conversations.length}</span>
        {open ? (
          <ChevronDown className="size-3 text-muted-foreground/50" />
        ) : (
          <ChevronRight className="size-3 text-muted-foreground/50" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden ps-4"
          >
            {conversations.map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyHistoryState() {
  const { createNewChat } = useChatContext();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-muted">
        <Bot className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">هنوز گفتگویی وجود ندارد</p>
      <p className="text-xs text-muted-foreground mb-4">
        برای شروع یک گفتگوی جدید آغاز کنید.
      </p>
      <Button size="sm" onClick={createNewChat}>
        <MessageSquarePlus className="me-1.5 size-3.5" />
        گفتگوی جدید
      </Button>
    </div>
  );
}

function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Search className="size-6 text-muted-foreground/40 mb-2" />
      <p className="text-sm text-muted-foreground">گفتگویی یافت نشد</p>
    </div>
  );
}

export function ConversationSidebar() {
  const { conversations, folders, searchQuery, setSearchQuery, createNewChat } =
    useChatContext();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return conversations.filter((c) => !c.archived);
    return conversations.filter(
      (c) =>
        !c.archived &&
        (c.title.toLowerCase().includes(q) ||
          c.preview.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  const groups = useMemo(() => {
    const map: Partial<Record<GroupKey, Conversation[]>> = {};
    for (const g of ["pinned", "today", "yesterday", "last7", "last30", "older"] as GroupKey[]) {
      const items = filtered.filter((c) => getGroup(c) === g);
      if (items.length > 0) map[g] = items;
    }
    return map;
  }, [filtered]);

  const folderMap = useMemo(() => {
    const map: Record<string, Conversation[]> = {};
    for (const f of folders) {
      const items = filtered.filter((c) => c.folderId === f.id);
      if (items.length > 0) map[f.id] = items;
    }
    return map;
  }, [filtered, folders]);

  const hasContent = filtered.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex h-full min-h-0 w-full flex-col border-r border-border/60 bg-muted/20">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-3 p-3 pt-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold text-foreground">گفتگوها</span>
          <Button
            size="sm"
            onClick={createNewChat}
            className="h-7 gap-1.5 px-2.5 text-xs"
          >
            <MessageSquarePlus className="size-3.5" />
            گفتگوی جدید
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجو در گفتگوها…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 rounded-lg ps-8 pe-8 text-xs bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Conversation list */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="py-2">
          {!hasContent ? (
            isSearching ? <SearchEmptyState /> : <EmptyHistoryState />
          ) : (
            <>
              {/* Folders */}
              {!isSearching && folders.some((f) => folderMap[f.id]?.length) && (
                <div className="mb-2">
                  <div className="px-4 py-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      پوشه‌ها
                    </span>
                  </div>
                  {folders.map((folder) => {
                    const items = folderMap[folder.id];
                    if (!items?.length) return null;
                    return (
                      <FolderSection
                        key={folder.id}
                        name={folder.name}
                        color={folder.color}
                        conversations={items}
                      />
                    );
                  })}
                  <Separator className="mt-2" />
                </div>
              )}

              {/* Date groups */}
              {(["pinned", "today", "yesterday", "last7", "last30", "older"] as GroupKey[]).map(
                (key) => {
                  const items = groups[key];
                  if (!items) return null;
                  return (
                    <GroupSection
                      key={key}
                      label={GROUP_LABELS[key]}
                      conversations={items}
                      icon={
                        key === "pinned" ? (
                          <Pin className="size-3 text-muted-foreground/60 rotate-45" />
                        ) : undefined
                      }
                      defaultOpen={["pinned", "today", "yesterday"].includes(key)}
                    />
                  );
                }
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
