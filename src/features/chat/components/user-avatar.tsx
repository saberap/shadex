"use client";

import {
  Avatar,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { cn } from "@/core/utils/cn";
import { statusColor } from "../utils";
import type { ChatUser } from "../types";

interface UserAvatarProps {
  user: ChatUser;
  size?: "sm" | "default" | "lg";
  showStatus?: boolean;
  className?: string;
}

export function UserAvatar({
  user,
  size = "default",
  showStatus = false,
  className,
}: UserAvatarProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <Avatar size={size} className="ring-1 ring-border/40">
        <AvatarFallback className={cn("font-medium", user.avatarColor)}>
          {user.initials}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-background",
            size === "sm" ? "size-2" : size === "lg" ? "size-2.5" : "size-2.5",
            statusColor(user.status)
          )}
        />
      )}
    </span>
  );
}
