"use client";

import { Menu } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { Toaster } from "@/shared/components/ui/sonner";
import { cn } from "@/core/utils/cn";
import {
  ChatProvider,
  useActiveConversation,
  useActiveMessages,
  useChat,
} from "../hooks/use-chat";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { MessageForwardDialog } from "./message-forward";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

function ChatLayoutInner() {
  const activeConversation = useActiveConversation();
  const messages = useActiveMessages();
  const { setActiveConversationId } = useChat();
  const isDesktop = useIsDesktop();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSelectFromSidebar = useCallback(() => {
    if (!isDesktop) setMobileSidebarOpen(false);
  }, [isDesktop]);

  const handleBackToList = useCallback(() => {
    if (isDesktop) return;
    setActiveConversationId(null);
  }, [isDesktop, setActiveConversationId]);

  const showMobileChat = !isDesktop && activeConversation !== null;
  const showMobileSidebar = !isDesktop && activeConversation === null;

  return (
    <div className="flex h-[calc(100svh-3.5rem)] min-h-0 w-full overflow-hidden bg-muted/30">
      <aside
        className={cn(
          "hidden h-full w-[320px] shrink-0 border-r lg:flex"
        )}
      >
        <ChatSidebar onSelectConversation={handleSelectFromSidebar} />
      </aside>

      <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        {!isDesktop && (
          <div className="flex shrink-0 items-center gap-2 border-b bg-background px-3 py-2 lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open conversations"
            >
              <Menu className="size-4" />
            </Button>
            <span className="text-sm font-semibold">
              {activeConversation ? "Conversation" : "Messages"}
            </span>
          </div>
        )}

        {(isDesktop || showMobileChat) && (
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            onBack={handleBackToList}
          />
        )}

        {showMobileSidebar && (
          <div className="flex flex-1 min-h-0">
            <ChatSidebar onSelectConversation={handleSelectFromSidebar} />
          </div>
        )}
      </main>

      <Sheet
        open={mobileSidebarOpen && !isDesktop}
        onOpenChange={setMobileSidebarOpen}
      >
        <SheetContent side="left" className="w-[320px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Conversations</SheetTitle>
          </SheetHeader>
          <ChatSidebar
            onSelectConversation={() => setMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <MessageForwardDialog />
      <Toaster position="bottom-right" />
    </div>
  );
}

export interface ChatLayoutProps {
  className?: string;
}

export function ChatLayout({ className }: ChatLayoutProps) {
  return (
    <div className={cn("h-full w-full", className)}>
      <ChatProvider>
        <ChatLayoutInner />
      </ChatProvider>
    </div>
  );
}
