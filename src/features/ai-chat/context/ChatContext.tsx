"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { aiResponses, mockConversations, mockFolders, mockMessages } from "../data";
import type { Attachment, Conversation, Folder, Message, ModelId } from "../types";

const genId = () => Math.random().toString(36).slice(2, 11);
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

interface ChatContextType {
  conversations: Conversation[];
  folders: Folder[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isStreaming: boolean;
  isThinking: boolean;
  selectedModel: ModelId;
  searchQuery: string;
  historyOpen: boolean;
  detailsOpen: boolean;
  activeConversation: Conversation | null;
  tokensUsed: number;

  selectConversation: (id: string | null) => void;
  createNewChat: () => void;
  deleteConversation: (id: string) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
  archiveConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  duplicateConversation: (id: string) => void;
  sendMessage: (content: string, attachments?: Attachment[]) => void;
  stopStreaming: () => void;
  setSelectedModel: (model: ModelId) => void;
  setSearchQuery: (query: string) => void;
  setHistoryOpen: (open: boolean) => void;
  setDetailsOpen: (open: boolean) => void;
  toggleHistory: () => void;
  toggleDetails: () => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [folders] = useState<Folder[]>(mockFolders);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(mockConversations[0]?.id ?? null);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedModel, setSelectedModelState] =
    useState<ModelId>("claude-sonnet");
  const [searchQuery, setSearchQueryState] = useState("");
  const [historyOpen, setHistoryOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [tokensUsed] = useState(18432);

  const streamingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shouldStopRef = useRef(false);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? null;

  const selectConversation = useCallback((id: string | null) => {
    setActiveConversationId(id);
  }, []);

  const createNewChat = useCallback(() => {
    const newConv: Conversation = {
      id: genId(),
      title: "گفتگوی جدید",
      model: selectedModel,
      preview: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
      archived: false,
      favorite: false,
      shared: false,
      messageCount: 0,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages((prev) => ({ ...prev, [newConv.id]: [] }));
  }, [selectedModel]);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setActiveConversationId((prev) => (prev === id ? null : prev));
  }, []);

  const togglePin = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))
    );
  }, []);

  const archiveConversation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c))
    );
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }, []);

  const duplicateConversation = useCallback(
    (id: string) => {
      const original = conversations.find((c) => c.id === id);
      if (!original) return;
      const newId = genId();
      const newConv: Conversation = {
        ...original,
        id: newId,
        title: `${original.title} (کپی)`,
        createdAt: new Date(),
        updatedAt: new Date(),
        pinned: false,
      };
      setConversations((prev) => [newConv, ...prev]);
      const origMsgs = messages[id] ?? [];
      setMessages((prev) => ({
        ...prev,
        [newId]: origMsgs.map((m) => ({
          ...m,
          id: genId(),
          conversationId: newId,
        })),
      }));
    },
    [conversations, messages]
  );

  const stopStreaming = useCallback(() => {
    shouldStopRef.current = true;
    if (streamingRef.current) {
      clearInterval(streamingRef.current);
      streamingRef.current = null;
    }
    setIsStreaming(false);
    setIsThinking(false);
    setMessages((prev) => {
      const convId = activeConversationId;
      if (!convId) return prev;
      return {
        ...prev,
        [convId]: (prev[convId] ?? []).map((m) =>
          m.isStreaming
            ? {
                ...m,
                isStreaming: false,
                content: m.streamingText ?? m.content,
                streamingText: undefined,
              }
            : m
        ),
      };
    });
  }, [activeConversationId]);

  const sendMessage = useCallback(
    async (content: string, attachments?: Attachment[]) => {
      if (!activeConversationId || !content.trim() || isStreaming) return;
      shouldStopRef.current = false;

      const userMsg: Message = {
        id: genId(),
        conversationId: activeConversationId,
        role: "user",
        content: content.trim(),
        type: "text",
        attachments,
        createdAt: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] ?? []), userMsg],
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                preview: content.trim().slice(0, 80),
                updatedAt: new Date(),
                messageCount: c.messageCount + 1,
              }
            : c
        )
      );

      setIsThinking(true);
      await delay(1100);
      if (shouldStopRef.current) return;
      setIsThinking(false);

      const lower = content.toLowerCase();
      let responseText = aiResponses.default;
      if (
        lower.includes("code") ||
        lower.includes("function") ||
        lower.includes("implement") ||
        lower.includes("write a")
      ) {
        responseText = aiResponses.coding;
      } else if (
        lower.includes("table") ||
        lower.includes("compare") ||
        lower.includes("analyz") ||
        lower.includes("chart") ||
        lower.includes("graph")
      ) {
        responseText = aiResponses.analysis;
      }

      const asstId = genId();
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [
          ...(prev[activeConversationId] ?? []),
          {
            id: asstId,
            conversationId: activeConversationId,
            role: "assistant",
            content: "",
            type: "text",
            isStreaming: true,
            streamingText: "",
            createdAt: new Date(),
          } as Message,
        ],
      }));
      setIsStreaming(true);

      let idx = 0;
      streamingRef.current = setInterval(() => {
        if (shouldStopRef.current) {
          clearInterval(streamingRef.current!);
          setIsStreaming(false);
          return;
        }
        idx++;
        const current = responseText.slice(0, idx);
        setMessages((prev) => ({
          ...prev,
          [activeConversationId]: (prev[activeConversationId] ?? []).map((m) =>
            m.id === asstId ? { ...m, streamingText: current } : m
          ),
        }));
        if (idx >= responseText.length) {
          clearInterval(streamingRef.current!);
          streamingRef.current = null;
          setIsStreaming(false);
          setMessages((prev) => ({
            ...prev,
            [activeConversationId]: (prev[activeConversationId] ?? []).map(
              (m) =>
                m.id === asstId
                  ? {
                      ...m,
                      isStreaming: false,
                      content: responseText,
                      streamingText: undefined,
                    }
                  : m
            ),
          }));
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId
                ? { ...c, messageCount: c.messageCount + 1 }
                : c
            )
          );
        }
      }, 10);
    },
    [activeConversationId, isStreaming]
  );

  const clearMessages = useCallback(() => {
    if (!activeConversationId) return;
    setMessages((prev) => ({ ...prev, [activeConversationId]: [] }));
  }, [activeConversationId]);

  const setSelectedModel = useCallback((model: ModelId) => {
    setSelectedModelState(model);
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setSearchQueryState(q);
  }, []);

  const toggleHistory = useCallback(
    () => setHistoryOpen((p) => !p),
    []
  );
  const toggleDetails = useCallback(
    () => setDetailsOpen((p) => !p),
    []
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        folders,
        activeConversationId,
        messages,
        isStreaming,
        isThinking,
        selectedModel,
        searchQuery,
        historyOpen,
        detailsOpen,
        activeConversation,
        tokensUsed,
        selectConversation,
        createNewChat,
        deleteConversation,
        togglePin,
        toggleFavorite,
        archiveConversation,
        renameConversation,
        duplicateConversation,
        sendMessage,
        stopStreaming,
        setSelectedModel,
        setSearchQuery,
        setHistoryOpen,
        setDetailsOpen,
        toggleHistory,
        toggleDetails,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}
