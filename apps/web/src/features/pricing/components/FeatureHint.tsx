"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import { Info } from "lucide-react";

type FeatureHintProps = {
  hint: string;
};

export function FeatureHint({ hint }: FeatureHintProps) {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="اطلاعات بیشتر"
            className="text-current/40 hover:text-current/70 transition-colors"
          >
            <Info className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">{hint}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
