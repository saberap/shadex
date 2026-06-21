"use client";

import { useChat } from "../hooks/use-chat";
import { UserAvatar } from "./user-avatar";

interface TypingIndicatorProps {
  conversationId: string;
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const { typing, users } = useChat();
  const active = typing.filter((t) => t.conversationId === conversationId);
  if (active.length === 0) return null;

  const user = users[active[0].userId];
  if (!user) return null;

  return (
    <div className="flex w-full items-end gap-2 px-2 py-1">
      <div className="shrink-0">
        <UserAvatar user={user} size="sm" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-3 py-2.5">
        <Dot delay="0ms" />
        <Dot delay="150ms" />
        <Dot delay="300ms" />
      </div>
      <span className="text-[11px] text-muted-foreground">
        {user.name.split(" ")[0]} در حال نوشتن است…
      </span>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
      style={{ animationDelay: delay, animationDuration: "1s" }}
    />
  );
}
