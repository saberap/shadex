"use client";

import { ChatProvider } from "../context/ChatContext";
import { ChatLayout } from "./ChatLayout";

export function AiChatFeature() {
  return (
    <ChatProvider>
      <div className="flex h-[calc(100svh-3.5rem)] overflow-hidden">
        <ChatLayout />
      </div>
    </ChatProvider>
  );
}
