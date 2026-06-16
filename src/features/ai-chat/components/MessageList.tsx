"use client";

import { Bot } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { EmptyState } from "./EmptyState";
import { MessageBubble } from "./MessageBubble";
import { ThinkingPanel } from "./ThinkingPanel";
import { useChatContext } from "../context/ChatContext";

export function MessageList() {
  const { activeConversationId, messages, isThinking } = useChatContext();
  const endRef = useRef<HTMLDivElement>(null);
  const convMessages = activeConversationId
    ? (messages[activeConversationId] ?? [])
    : [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages.length, isThinking]);

  if (convMessages.length === 0 && !isThinking) {
    return (
      <div className="flex-1 overflow-y-auto">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        <AnimatePresence initial={false}>
          {convMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {/* Thinking indicator while waiting for first token */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3 px-4 sm:px-6"
            >
              <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Bot className="size-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <ThinkingPanel isActive />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={endRef} />
      </div>
    </div>
  );
}
