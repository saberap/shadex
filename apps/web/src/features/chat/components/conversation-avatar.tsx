"use client";

import { Avatar, AvatarFallback, cn } from "@repo/ui";
import { Users } from "lucide-react";
import type { ChatUser, Conversation } from "../types";
import { getConversationPartner, statusColor } from "../utils";

interface ConversationAvatarProps {
  conversation: Conversation;
  users: Record<string, ChatUser>;
  currentUserId: string;
  size?: "sm" | "default" | "lg";
  showStatus?: boolean;
  className?: string;
}

export function ConversationAvatar({
  conversation,
  users,
  currentUserId,
  size = "default",
  showStatus = false,
  className,
}: ConversationAvatarProps) {
  if (conversation.kind === "direct") {
    const partner = getConversationPartner(conversation, users, currentUserId);
    if (!partner) return null;
    return (
      <span className={cn("relative inline-flex shrink-0", className)}>
        <Avatar size={size} className="ring-1 ring-border/40">
          <AvatarFallback className={cn("font-medium", partner.avatarColor)}>
            {partner.initials}
          </AvatarFallback>
        </Avatar>
        {showStatus && (
          <span
            aria-hidden
            className={cn(
              "absolute -bottom-0.5 -end-0.5 rounded-full ring-2 ring-background",
              size === "sm" ? "size-2" : "size-2.5",
              statusColor(partner.status),
            )}
          />
        )}
      </span>
    );
  }

  const initials = conversation.name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <Avatar size={size} className="ring-1 ring-border/40">
        <AvatarFallback className="bg-muted text-foreground/70 font-medium">
          {initials || <Users className="size-4" />}
        </AvatarFallback>
      </Avatar>
    </span>
  );
}
