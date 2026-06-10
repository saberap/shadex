"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import { ChatArea } from "./ChatArea";
import { ConversationDetails } from "./ConversationDetails";
import { ConversationSidebar } from "./ConversationSidebar";
import { useChatContext } from "../context/ChatContext";

function useBelowLg() {
  const [belowLg, setBelowLg] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    setBelowLg(mql.matches);
    const handler = (e: MediaQueryListEvent) => setBelowLg(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return belowLg;
}

export function ChatLayout() {
  const { historyOpen, detailsOpen, setHistoryOpen } = useChatContext();
  const belowLg = useBelowLg();

  return (
    <div className="flex h-full overflow-hidden">
      {/* LEFT: Conversation sidebar — always visible on lg+, sheet on mobile */}

      {/* Desktop sidebar */}
      <AnimatePresence initial={false}>
        {historyOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="hidden lg:flex flex-col overflow-hidden shrink-0"
          >
            <ConversationSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sidebar sheet — only open when below lg breakpoint */}
      <Sheet
        open={belowLg && historyOpen}
        onOpenChange={(open) => { if (!open) setHistoryOpen(false); }}
      >
        <SheetContent side="left" className="w-72 p-0">
          <ConversationSidebar />
        </SheetContent>
      </Sheet>

      {/* CENTER: Chat area */}
      <ChatArea />

      {/* RIGHT: Details panel — xl+ only */}
      <AnimatePresence initial={false}>
        {detailsOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="hidden xl:flex flex-col overflow-hidden shrink-0 border-l border-border"
          >
            <ConversationDetails />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
