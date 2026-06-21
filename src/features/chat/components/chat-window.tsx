"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useChat } from "../hooks/use-chat";
import { groupMessagesByDate } from "../utils";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { MessageGroup } from "./message-group";
import { TypingIndicator } from "./typing-indicator";
import type { Conversation, Message } from "../types";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  loading?: boolean;
  onBack?: () => void;
}

export function ChatWindow({
  conversation,
  messages,
  loading,
  onBack,
}: ChatWindowProps) {
  const { users, currentUser, typing } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  const dateGroups = useMemo(() => groupMessagesByDate(messages), [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, conversation?.id, typing]);

  if (!conversation) {
    return <EmptyChatState />;
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-background">
      <ChatHeader conversation={conversation} onBack={onBack} />

      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-2 pt-8 pb-4 sm:px-4">
          {loading ? (
            <MessagesSkeleton />
          ) : dateGroups.length === 0 ? (
            <EmptyMessagesState />
          ) : (
            dateGroups.map((dateGroup) => (
              <div key={dateGroup.dateKey} className="flex flex-col gap-2">
                <div className="my-2 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border/70" />
                  <span className="rounded-full bg-muted/70 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {dateGroup.label}
                  </span>
                  <span className="h-px flex-1 bg-border/70" />
                </div>
                {dateGroup.groups.map((group, idx) => {
                  const author = users[group.authorId];
                  const isOwn = group.authorId === currentUser.id;
                  return (
                    <MessageGroup
                      key={`${dateGroup.dateKey}-${idx}-${group.messages[0].id}`}
                      authorId={group.authorId}
                      messages={group.messages}
                      author={author}
                      isOwn={isOwn}
                    />
                  );
                })}
              </div>
            ))
          )}

          <TypingIndicator conversationId={conversation.id} />
          <div ref={bottomRef} aria-hidden className="h-px w-full" />
        </div>
      </ScrollArea>

      <ChatInput conversationId={conversation.id} />
    </div>
  );
}

function EmptyChatState() {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center bg-background px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted">
        <MessageSquare className="size-6 text-muted-foreground" />
      </div>
      <h2 className="text-base font-semibold text-foreground">
        یک گفتگو انتخاب کنید
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        برای شروع پیام‌رسانی یک گفتگو از نوار کناری انتخاب کنید، یا یک گفتگوی جدید بسازید تا یک رشته تازه آغاز شود.
      </p>
    </div>
  );
}

function EmptyMessagesState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
        <MessageSquare className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        هنوز پیامی وجود ندارد
      </p>
      <p className="text-xs text-muted-foreground">
        برای آغاز گفتگو اولین پیام را بفرستید.
      </p>
    </div>
  );
}

function MessagesSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`flex items-end gap-2 ${
            i % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          {i % 2 === 0 && <Skeleton className="size-7 rounded-full" />}
          <Skeleton
            className={`h-12 rounded-2xl ${
              i % 2 === 0 ? "w-1/2" : "w-2/5"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
