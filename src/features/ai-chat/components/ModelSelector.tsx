"use client";

import { Check, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/core/utils/cn";
import { MODELS } from "../data";
import { useChatContext } from "../context/ChatContext";

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Anthropic: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Google: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const SPEED_DOTS: Record<string, number> = { fast: 3, medium: 2, slow: 1 };
const COST_LABEL: Record<string, string> = { low: "$", medium: "$$", high: "$$$" };

const byProvider = (provider: string) => MODELS.filter((m) => m.provider === provider);

interface ModelSelectorProps {
  compact?: boolean;
}

export function ModelSelector({ compact = false }: ModelSelectorProps) {
  const { selectedModel, setSelectedModel } = useChatContext();
  const current = MODELS.find((m) => m.id === selectedModel) ?? MODELS[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          className={cn(
            "gap-1.5 font-medium",
            compact && "h-7 rounded-lg px-2.5 text-xs"
          )}
        >
          <span>{current.name}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-80"
        sideOffset={6}
      >
        {(["OpenAI", "Anthropic", "Google"] as const).map((provider, pi) => (
          <div key={provider}>
            {pi > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="flex items-center gap-2 py-2">
              <Badge
                variant="secondary"
                className={cn("text-[10px] font-semibold px-1.5 py-0", PROVIDER_COLORS[provider])}
              >
                {provider}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {byProvider(provider).map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className="cursor-pointer px-3 py-2.5"
                >
                  <div className="flex w-full items-start gap-3">
                    <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                      {model.id === selectedModel && (
                        <Check className="size-3.5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{COST_LABEL[model.cost]}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1.5">{model.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">
                          {model.contextLength} ctx
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "size-1.5 rounded-full",
                                i < SPEED_DOTS[model.speed]
                                  ? "bg-primary"
                                  : "bg-muted"
                              )}
                            />
                          ))}
                          <span className="ml-1 text-[10px] text-muted-foreground capitalize">
                            {model.speed}
                          </span>
                        </div>
                        {model.speed === "fast" && (
                          <Zap className="size-3 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
