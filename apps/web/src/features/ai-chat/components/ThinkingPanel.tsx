"use client";

import { cn } from "@repo/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ThinkingStep } from "../types";

interface ThinkingPanelProps {
  steps?: ThinkingStep[];
  isActive?: boolean;
}

export function ThinkingPanel({ steps, isActive = false }: ThinkingPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={expanded}
      >
        <div
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full",
            isActive
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Brain className="size-3" />
        </div>
        <span className="flex-1 text-xs font-medium text-muted-foreground">
          {isActive ? (
            <span className="flex items-center gap-1.5">
              در حال فکر کردن
              <ThinkingDots />
            </span>
          ) : (
            `استدلال (${steps?.length ?? 0} مرحله)`
          )}
        </span>
        {!isActive && (
          <span className="text-muted-foreground">
            {expanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </span>
        )}
      </button>

      <AnimatePresence>
        {expanded && steps && steps.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-border/50 px-4 py-3 space-y-2">
              {steps.map((step, i) => (
                <div key={step.id} className="flex gap-2.5">
                  <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <span className="text-[9px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block size-1 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}
