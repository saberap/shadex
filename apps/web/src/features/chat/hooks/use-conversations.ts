"use client";

import { useMemo } from "react";
import type { Conversation, ConversationGroup, Message } from "../types";
import { getConversationDisplayName, getMessagePreview } from "../utils";
import { useChat } from "./use-chat";

export interface ConversationSummary {
  conversation: Conversation;
  displayName: string;
  lastMessage: Message | undefined;
  preview: string;
}

export interface GroupedConversations {
  group: ConversationGroup;
  items: ConversationSummary[];
}

export function useConversations(): {
  groups: GroupedConversations[];
  totalUnread: number;
  searchQuery: string;
} {
  const {
    conversations,
    groups,
    messagesByConversation,
    users,
    currentUser,
    searchQuery,
  } = useChat();

  const summaries = useMemo<ConversationSummary[]>(() => {
    return conversations.map((conversation) => {
      const messages = messagesByConversation[conversation.id] ?? [];
      const lastMessage = messages[messages.length - 1];
      return {
        conversation,
        displayName: getConversationDisplayName(
          conversation,
          users,
          currentUser.id,
        ),
        lastMessage,
        preview: getMessagePreview(lastMessage),
      };
    });
  }, [conversations, messagesByConversation, users, currentUser]);

  const filtered = useMemo<ConversationSummary[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return summaries;
    return summaries.filter((s) => {
      if (s.displayName.toLowerCase().includes(q)) return true;
      if (s.preview.toLowerCase().includes(q)) return true;
      if (s.conversation.description?.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [summaries, searchQuery]);

  const grouped = useMemo<GroupedConversations[]>(() => {
    const byGroup = new Map<string, ConversationSummary[]>();

    for (const summary of filtered) {
      const isFavorite = summary.conversation.pinned;
      if (isFavorite && !summary.conversation.archived) {
        const list = byGroup.get("favorites") ?? [];
        list.push(summary);
        byGroup.set("favorites", list);
        continue;
      }
      const groupId = summary.conversation.archived
        ? "archived"
        : summary.conversation.groupId;
      const list = byGroup.get(groupId) ?? [];
      list.push(summary);
      byGroup.set(groupId, list);
    }

    return groups
      .map<GroupedConversations>((group) => ({
        group,
        items: (byGroup.get(group.id) ?? []).sort(
          (a, b) =>
            b.conversation.updatedAt.getTime() -
            a.conversation.updatedAt.getTime(),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered, groups]);

  const totalUnread = useMemo(
    () =>
      conversations.reduce(
        (sum, c) => (c.archived || c.muted ? sum : sum + c.unreadCount),
        0,
      ),
    [conversations],
  );

  return { groups: grouped, totalUnread, searchQuery };
}
