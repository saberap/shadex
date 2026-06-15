"use client";

import { useMemo, useState } from "react";
import { Forward, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { cn } from "@/core/utils/cn";
import { useChat } from "../hooks/use-chat";
import {
  getConversationDisplayName,
  getMessagePreview,
} from "../utils";
import { ConversationAvatar } from "./conversation-avatar";

export function MessageForwardDialog() {
  const {
    forwardingMessage,
    conversations,
    users,
    currentUser,
    cancelForward,
    confirmForward,
  } = useChat();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const open = forwardingMessage !== null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations
      .filter((c) => !c.archived)
      .filter((c) => {
        if (!q) return true;
        const name = getConversationDisplayName(c, users, currentUser.id);
        return name.toLowerCase().includes(q);
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [conversations, users, currentUser, query]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          cancelForward();
          setSelected(null);
          setQuery("");
        }
      }}
    >
      <DialogContent className="max-w-md p-0 gap-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Forward className="size-4" />
            Forward message
          </DialogTitle>
          <DialogDescription className="text-xs">
            Choose a conversation to forward this message to.
          </DialogDescription>
        </DialogHeader>

        {forwardingMessage && (
          <div className="mx-5 mt-3 rounded-lg border bg-muted/40 p-3 text-xs">
            <div className="mb-1 font-medium text-foreground">
              {users[forwardingMessage.authorId]?.name ?? "Unknown"}
            </div>
            <p className="line-clamp-3 text-muted-foreground">
              {getMessagePreview(forwardingMessage)}
            </p>
          </div>
        )}

        <div className="relative px-5 pt-4">
          <Search className="pointer-events-none absolute left-7 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="h-9 rounded-lg pl-8 text-xs"
          />
        </div>

        <ScrollArea className="mt-2 max-h-72">
          <div className="flex flex-col gap-0.5 px-3 py-2">
            {filtered.length === 0 ? (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                No conversations found
              </div>
            ) : (
              filtered.map((c) => {
                const active = selected === c.id;
                const name = getConversationDisplayName(c, users, currentUser.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelected(c.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                      "hover:bg-muted/60",
                      active && "bg-muted"
                    )}
                  >
                    <ConversationAvatar
                      conversation={c}
                      users={users}
                      currentUserId={currentUser.id}
                      size="sm"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-xs font-medium text-foreground">
                        {name}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {c.kind === "group"
                          ? `${c.participantIds.length} members`
                          : (users[c.participantIds.find((id) => id !== currentUser.id) ?? ""]?.role ?? "")}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "size-3 shrink-0 rounded-full border",
                        active
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      )}
                    />
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="m-0 rounded-b-xl border-t px-5 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => cancelForward()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!selected}
            onClick={() => {
              if (selected) {
                confirmForward(selected);
                setSelected(null);
                setQuery("");
              }
            }}
          >
            <Forward className="size-3.5" />
            Forward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
