"use client";

import { useMemo, useState } from "react";
import { Check, MessageSquarePlus, Search, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { cn } from "@/core/utils/cn";
import { useChat } from "../hooks/use-chat";
import { statusColor } from "../utils";
import { UserAvatar } from "./user-avatar";
import type { ChatUser } from "../types";

type Mode = "direct" | "group";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewConversationDialog({
  open,
  onOpenChange,
}: NewConversationDialogProps) {
  const {
    userList,
    currentUser,
    conversations,
    setActiveConversationId,
    createConversation,
  } = useChat();

  const [mode, setMode] = useState<Mode>("direct");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState("");

  const reset = () => {
    setMode("direct");
    setQuery("");
    setSelected(new Set());
    setGroupName("");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const candidates = useMemo<ChatUser[]>(() => {
    const q = query.trim().toLowerCase();
    return userList
      .filter((u) => u.id !== currentUser.id && u.username !== "system")
      .filter((u) => {
        if (!q) return true;
        return (
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        );
      });
  }, [userList, currentUser, query]);

  const toggle = (userId: string) => {
    setSelected((prev) => {
      if (mode === "direct") {
        return new Set([userId]);
      }
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleModeChange = (next: string) => {
    setMode(next as Mode);
    setSelected(new Set());
  };

  const canCreate =
    mode === "direct"
      ? selected.size === 1
      : selected.size >= 1 && groupName.trim().length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    const ids = Array.from(selected);

    if (mode === "direct") {
      const partnerId = ids[0];
      const existing = conversations.find(
        (c) =>
          c.kind === "direct" &&
          !c.archived &&
          c.participantIds.includes(partnerId) &&
          c.participantIds.includes(currentUser.id) &&
          c.participantIds.length === 2
      );
      if (existing) {
        setActiveConversationId(existing.id);
        handleOpenChange(false);
        return;
      }
      const partner = userList.find((u) => u.id === partnerId);
      const id = createConversation({
        kind: "direct",
        name: partner?.name ?? "Conversation",
        participantIds: [currentUser.id, partnerId],
        groupId: "direct",
      });
      setActiveConversationId(id);
    } else {
      const id = createConversation({
        kind: "group",
        name: groupName.trim(),
        participantIds: [currentUser.id, ...ids],
        groupId: "teams",
      });
      setActiveConversationId(id);
    }
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="flex items-center gap-2 text-base">
            <MessageSquarePlus className="size-4" />
            New conversation
          </DialogTitle>
          <DialogDescription className="text-xs">
            Start a direct message or create a group chat with your teammates.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 pt-4">
          <Tabs value={mode} onValueChange={handleModeChange}>
            <TabsList className="w-full">
              <TabsTrigger value="direct" className="flex-1 gap-1.5">
                <MessageSquarePlus className="size-3.5" />
                Direct
              </TabsTrigger>
              <TabsTrigger value="group" className="flex-1 gap-1.5">
                <Users className="size-3.5" />
                Group
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {mode === "group" && (
          <div className="px-5 pt-4">
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name (e.g. Design Sync)"
              className="h-9 text-sm"
              maxLength={60}
            />
          </div>
        )}

        <div className="px-5 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people…"
              className="h-9 rounded-lg pl-8 text-xs"
            />
          </div>
        </div>

        <ScrollArea className="mt-2 h-72">
          <div className="flex flex-col gap-0.5 px-3 py-2">
            {candidates.length === 0 ? (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                No people match your search
              </div>
            ) : (
              candidates.map((user) => {
                const active = selected.has(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggle(user.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                      "hover:bg-muted/60",
                      active && "bg-muted"
                    )}
                  >
                    <UserAvatar user={user} size="sm" showStatus />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-xs font-medium text-foreground">
                        {user.name}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span
                        aria-hidden
                        className={`size-1.5 rounded-full ${statusColor(
                          user.status
                        )}`}
                      />
                      <span className="capitalize">{user.status}</span>
                    </div>
                    <div
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {active && <Check className="size-3" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="m-0 rounded-b-xl border-t px-5 py-3">
          <div className="mr-auto text-[11px] text-muted-foreground">
            {mode === "direct"
              ? selected.size === 1
                ? "1 person selected"
                : "Pick one person"
              : `${selected.size} selected`}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!canCreate}
            onClick={handleCreate}
          >
            {mode === "direct" ? "Start chat" : "Create group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
