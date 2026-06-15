"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CHAT_CONVERSATIONS,
  CHAT_GROUPS,
  CHAT_MESSAGES,
  CHAT_USERS,
  CURRENT_USER_ID,
} from "../data";
import type {
  ChatUser,
  Conversation,
  ConversationGroup,
  ForwardReference,
  Message,
  MessageAttachment,
  ReplyReference,
  SendMessagePayload,
  TypingState,
} from "../types";

function clone<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clone) as unknown as T;
  if (value instanceof Date) return new Date(value.getTime()) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      out[key] = clone((value as Record<string, unknown>)[key]);
    }
    return out as T;
  }
  return value;
}

let messageIdCounter = 10_000;
function nextMessageId() {
  messageIdCounter += 1;
  return `m-new-${messageIdCounter}`;
}

interface ChatStoreState {
  users: Record<string, ChatUser>;
  userList: ChatUser[];
  currentUser: ChatUser;
  groups: ConversationGroup[];
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
  activeConversationId: string | null;
  searchQuery: string;
  collapsedGroups: Record<string, boolean>;
  typing: TypingState[];
  pendingReply: ReplyReference | null;
  forwardingMessage: Message | null;
}

export interface CreateConversationInput {
  kind: import("../types").ConversationKind;
  name: string;
  participantIds: string[];
  groupId: string;
  description?: string;
}

interface ChatStoreActions {
  setActiveConversationId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  toggleGroup: (groupId: string) => void;
  togglePinned: (conversationId: string) => void;
  toggleMuted: (conversationId: string) => void;
  toggleArchived: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  sendMessage: (payload: SendMessagePayload) => void;
  setPendingReply: (reply: ReplyReference | null) => void;
  startForward: (message: Message) => void;
  cancelForward: () => void;
  confirmForward: (targetConversationId: string) => void;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  createConversation: (input: CreateConversationInput) => string;
}

export type ChatStore = ChatStoreState & ChatStoreActions;

const ChatContext = createContext<ChatStore | null>(null);

const TYPING_USERS_BY_CONVERSATION: Record<string, string> = {
  "c-amelia": "user-amelia",
  "c-mira": "user-mira",
  "c-design": "user-priya",
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const users = useMemo(() => {
    const map: Record<string, ChatUser> = {};
    for (const user of CHAT_USERS) map[user.id] = user;
    return map;
  }, []);
  const currentUser = users[CURRENT_USER_ID];

  const [conversations, setConversations] = useState<Conversation[]>(() =>
    clone(CHAT_CONVERSATIONS)
  );
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, Message[]>
  >(() => {
    const map: Record<string, Message[]> = {};
    for (const message of clone(CHAT_MESSAGES)) {
      (map[message.conversationId] ??= []).push(message);
    }
    for (const id of Object.keys(map)) {
      map[id].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    return map;
  });

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >("c-amelia");
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({ archived: true });
  const [typing, setTyping] = useState<TypingState[]>([]);
  const [pendingReply, setPendingReply] = useState<ReplyReference | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(
    null
  );

  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  const clearTypingFor = useCallback((conversationId: string) => {
    setTyping((prev) => prev.filter((t) => t.conversationId !== conversationId));
  }, []);

  const triggerSimulatedTyping = useCallback(
    (conversationId: string) => {
      const userId = TYPING_USERS_BY_CONVERSATION[conversationId];
      if (!userId) return;
      const existing = typingTimers.current[conversationId];
      if (existing) clearTimeout(existing);

      setTyping((prev) => {
        const without = prev.filter((t) => t.conversationId !== conversationId);
        return [...without, { conversationId, userId }];
      });

      typingTimers.current[conversationId] = setTimeout(() => {
        clearTypingFor(conversationId);
      }, 2400);
    },
    [clearTypingFor]
  );

  useEffect(() => {
    return () => {
      for (const id of Object.keys(typingTimers.current)) {
        clearTimeout(typingTimers.current[id]);
      }
    };
  }, []);

  const toggleGroup = useCallback((groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  }, []);

  const togglePinned = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, pinned: !c.pinned } : c
      )
    );
  }, []);

  const toggleMuted = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, muted: !c.muted } : c
      )
    );
  }, []);

  const toggleArchived = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              archived: !c.archived,
              groupId: !c.archived ? "archived" : "direct",
            }
          : c
      )
    );
  }, []);

  const createConversation = useCallback(
    (input: CreateConversationInput): string => {
      const id = `c-new-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      const now = new Date();
      const conversation: Conversation = {
        id,
        kind: input.kind,
        name: input.name,
        description: input.description,
        participantIds: input.participantIds,
        groupId: input.groupId,
        pinned: false,
        muted: false,
        archived: false,
        unreadCount: 0,
        lastReadAt: now,
        createdAt: now,
        updatedAt: now,
      };
      setConversations((prev) => [conversation, ...prev]);
      setMessagesByConversation((prev) => ({ ...prev, [id]: [] }));
      return id;
    },
    []
  );

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, unreadCount: 0, lastReadAt: new Date() }
          : c
      )
    );
  }, []);

  const appendMessage = useCallback(
    (message: Message) => {
      setMessagesByConversation((prev) => {
        const list = prev[message.conversationId] ?? [];
        return {
          ...prev,
          [message.conversationId]: [...list, message],
        };
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === message.conversationId
            ? {
                ...c,
                lastMessageId: message.id,
                updatedAt: message.createdAt,
                unreadCount:
                  message.authorId === CURRENT_USER_ID ? 0 : c.unreadCount,
              }
            : c
        )
      );
    },
    []
  );

  const sendMessage = useCallback(
    (payload: SendMessagePayload) => {
      const message: Message = {
        id: nextMessageId(),
        conversationId: payload.conversationId,
        authorId: CURRENT_USER_ID,
        type: payload.type ?? "text",
        content: payload.content,
        attachments: payload.attachments,
        replyTo: payload.replyTo,
        forwardedFrom: payload.forwardedFrom,
        status: "sending",
        createdAt: new Date(),
      };
      appendMessage(message);
      setPendingReply(null);

      setTimeout(() => {
        setMessagesByConversation((prev) => {
          const list = prev[payload.conversationId] ?? [];
          return {
            ...prev,
            [payload.conversationId]: list.map((m) =>
              m.id === message.id ? { ...m, status: "sent" } : m
            ),
          };
        });
      }, 450);

      setTimeout(() => {
        setMessagesByConversation((prev) => {
          const list = prev[payload.conversationId] ?? [];
          return {
            ...prev,
            [payload.conversationId]: list.map((m) =>
              m.id === message.id ? { ...m, status: "delivered" } : m
            ),
          };
        });
      }, 1100);

      setTimeout(() => {
        triggerSimulatedTyping(payload.conversationId);
      }, 1500);
    },
    [appendMessage, triggerSimulatedTyping]
  );

  const startForward = useCallback((message: Message) => {
    setForwardingMessage(message);
  }, []);

  const cancelForward = useCallback(() => {
    setForwardingMessage(null);
  }, []);

  const confirmForward = useCallback(
    (targetConversationId: string) => {
      if (!forwardingMessage) return;
      const original = forwardingMessage;
      const author = users[original.authorId];
      const originConversation = conversations.find(
        (c) => c.id === original.conversationId
      );
      const forwarded: ForwardReference = {
        fromConversationId: original.conversationId,
        fromConversationName: originConversation?.name ?? "Conversation",
        originalAuthorId: original.authorId,
        originalAuthorName: author?.name ?? "Unknown",
      };
      sendMessage({
        conversationId: targetConversationId,
        content: original.content,
        type: original.type === "system" ? "text" : original.type,
        attachments: original.attachments
          ? (clone(original.attachments) as MessageAttachment[])
          : undefined,
        forwardedFrom: forwarded,
      });
      setForwardingMessage(null);
      setActiveConversationId(targetConversationId);
    },
    [conversations, forwardingMessage, sendMessage, users]
  );

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      setMessagesByConversation((prev) => {
        const next: Record<string, Message[]> = { ...prev };
        for (const conversationId of Object.keys(next)) {
          next[conversationId] = next[conversationId].map((m) =>
            m.id === messageId ? { ...m, content, edited: true } : m
          );
        }
        return next;
      });
    },
    []
  );

  const deleteMessage = useCallback((messageId: string) => {
    setMessagesByConversation((prev) => {
      const next: Record<string, Message[]> = { ...prev };
      for (const conversationId of Object.keys(next)) {
        next[conversationId] = next[conversationId].filter(
          (m) => m.id !== messageId
        );
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!activeConversationId) return;
    markAsRead(activeConversationId);
  }, [activeConversationId, markAsRead]);

  const value = useMemo<ChatStore>(
    () => ({
      users,
      userList: CHAT_USERS,
      currentUser,
      groups: CHAT_GROUPS,
      conversations,
      messagesByConversation,
      activeConversationId,
      searchQuery,
      collapsedGroups,
      typing,
      pendingReply,
      forwardingMessage,
      setActiveConversationId,
      setSearchQuery,
      toggleGroup,
      togglePinned,
      toggleMuted,
      toggleArchived,
      markAsRead,
      sendMessage,
      setPendingReply,
      startForward,
      cancelForward,
      confirmForward,
      editMessage,
      deleteMessage,
      createConversation,
    }),
    [
      users,
      currentUser,
      conversations,
      messagesByConversation,
      activeConversationId,
      searchQuery,
      collapsedGroups,
      typing,
      pendingReply,
      forwardingMessage,
      toggleGroup,
      togglePinned,
      toggleMuted,
      toggleArchived,
      markAsRead,
      sendMessage,
      startForward,
      cancelForward,
      confirmForward,
      editMessage,
      deleteMessage,
      createConversation,
    ]
  );

  return createElement(ChatContext.Provider, { value }, children);
}

export function useChat(): ChatStore {
  const store = useContext(ChatContext);
  if (!store) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return store;
}

export function useActiveConversation() {
  const { conversations, activeConversationId } = useChat();
  return useMemo(
    () =>
      activeConversationId
        ? conversations.find((c) => c.id === activeConversationId) ?? null
        : null,
    [conversations, activeConversationId]
  );
}

export function useActiveMessages() {
  const { messagesByConversation, activeConversationId } = useChat();
  return useMemo(
    () =>
      activeConversationId
        ? messagesByConversation[activeConversationId] ?? []
        : [],
    [messagesByConversation, activeConversationId]
  );
}
