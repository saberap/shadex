"use client";

import { cn } from "@/core/utils/cn";
import { ChatMessage } from "./chat-message";
import { UserAvatar } from "./user-avatar";
import type { ChatUser, Message } from "../types";

interface MessageGroupProps {
  authorId: string;
  messages: Message[];
  author: ChatUser | undefined;
  isOwn: boolean;
}

export function MessageGroup({
  messages,
  author,
  isOwn,
}: MessageGroupProps) {
  if (messages.length === 0) return null;
  if (messages[0].type === "system") {
    return (
      <div className="flex flex-col gap-1.5 py-1">
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m}
            isOwn={false}
            isFirstInGroup
            isLastInGroup
            author={author}
            showHeader={false}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2 py-1",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <div className="mb-1.5 shrink-0">
          {author ? (
            <UserAvatar user={author} size="sm" />
          ) : (
            <div className="size-6 rounded-full bg-muted" />
          )}
        </div>
      )}

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-0.5",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {messages.map((message, idx) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwn={isOwn}
            isFirstInGroup={idx === 0}
            isLastInGroup={idx === messages.length - 1}
            author={author}
            showHeader={idx === 0 && !isOwn}
          />
        ))}
      </div>
    </div>
  );
}
