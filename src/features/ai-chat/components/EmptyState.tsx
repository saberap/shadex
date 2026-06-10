"use client";

import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { SuggestionCards } from "./SuggestionCards";
import { useChatContext } from "../context/ChatContext";
import { MODELS } from "../data";

export function EmptyState() {
  const { selectedModel } = useChatContext();
  const model = MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center text-center mb-10 max-w-md"
      >
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm ring-1 ring-primary/20">
          <Bot className="size-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          How can I help you today?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {model ? (
            <>
              Powered by <span className="font-medium text-foreground">{model.name}</span>.{" "}
              Ask anything, generate code, analyze data, or explore ideas.
            </>
          ) : (
            "Ask anything, generate code, analyze data, or explore ideas."
          )}
        </p>
      </motion.div>

      <div className="w-full max-w-2xl">
        <SuggestionCards />
      </div>
    </div>
  );
}
