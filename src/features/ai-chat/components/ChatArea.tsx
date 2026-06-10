"use client";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

export function ChatArea() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  );
}
