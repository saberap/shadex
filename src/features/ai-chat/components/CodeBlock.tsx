"use client";

import { Check, ChevronDown, ChevronRight, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/core/utils/cn";
import type { CodeContent } from "../types";

const LANG_COLORS: Record<string, string> = {
  typescript: "text-blue-400",
  javascript: "text-yellow-400",
  python: "text-green-400",
  sql: "text-orange-400",
  bash: "text-gray-300",
  json: "text-purple-400",
  shell: "text-gray-300",
};

export function CodeBlock({ language, code, filename }: CodeContent) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const langColor = LANG_COLORS[language.toLowerCase()] ?? "text-muted-foreground";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = language === "typescript" ? "ts" : language === "javascript" ? "js" : language;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-zinc-950 dark:bg-zinc-900 text-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="text-muted-foreground hover:text-white transition-colors"
            aria-label={collapsed ? "Expand code" : "Collapse code"}
          >
            {collapsed ? (
              <ChevronRight className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>
          {filename && (
            <span className="text-xs text-zinc-400 font-medium">{filename}</span>
          )}
          <span className={cn("text-xs font-semibold uppercase tracking-wider", langColor)}>
            {language}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-zinc-400 hover:text-white hover:bg-white/10"
            onClick={handleDownload}
            aria-label="Download code"
          >
            <Download className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-zinc-400 hover:text-white hover:bg-white/10"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="size-3 text-green-400" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Code body */}
      {!collapsed && (
        <div className="overflow-x-auto">
          <pre className="p-4 text-xs leading-relaxed text-zinc-200 font-mono">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
