"use client";

import {
  Download,
  Menu,
  MoreHorizontal,
  PanelRight,
  Share2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { cn } from "@/core/utils/cn";
import { ModelSelector } from "./ModelSelector";
import { useChatContext } from "../context/ChatContext";
import { MODELS } from "../data";

// Plain div avoids the `data-vertical:self-stretch` override that Separator injects,
// which breaks vertical centering inside flex containers.
function VDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-5 w-px shrink-0 bg-border", className)}
    />
  );
}

export function ChatHeader() {
  const {
    activeConversation,
    clearMessages,
    toggleHistory,
    toggleDetails,
    historyOpen,
    detailsOpen,
  } = useChatContext();

  const model = MODELS.find((m) => m.id === activeConversation?.model);

  return (
    <header className="shrink-0 flex items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 sm:px-6 h-14">
      {/* Mobile: toggle history drawer */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 lg:hidden"
            onClick={toggleHistory}
            aria-label="Toggle conversation history"
          >
            <Menu className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Conversations</TooltipContent>
      </Tooltip>

      {/* Desktop: sidebar toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden size-8 lg:flex",
              !historyOpen && "text-muted-foreground"
            )}
            onClick={toggleHistory}
            aria-label="Toggle sidebar"
          >
            <Menu className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle history</TooltipContent>
      </Tooltip>

      <VDivider className="hidden lg:block" />

      {/* Title */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {activeConversation ? (
          <>
            <h1 className="truncate text-sm font-semibold text-foreground">
              {activeConversation.title}
            </h1>
            {model && (
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex h-5 px-1.5 text-[10px] shrink-0"
              >
                {model.name}
              </Badge>
            )}
            {activeConversation.shared && (
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex h-5 px-1.5 text-[10px] shrink-0 bg-blue-500/10 text-blue-600"
              >
                Shared
              </Badge>
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">New Conversation</span>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Model selector */}
        <div className="hidden sm:block">
          <ModelSelector compact />
        </div>

        <VDivider className="mx-1 h-4 hidden sm:block" />

        {/* Share */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="Share conversation"
            >
              <Share2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>

        {/* Export */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground hidden sm:flex"
              aria-label="Export conversation"
            >
              <Download className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export</TooltipContent>
        </Tooltip>

        {/* More */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="More options"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>
              <Share2 className="mr-2 size-3.5" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 size-3.5" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={clearMessages}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-3.5" />
              Clear chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Details panel toggle */}
        <VDivider className="mx-1 h-4 hidden xl:block" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden size-8 xl:flex",
                detailsOpen ? "text-foreground" : "text-muted-foreground"
              )}
              onClick={toggleDetails}
              aria-label="Toggle details panel"
            >
              <PanelRight className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Conversation details</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
