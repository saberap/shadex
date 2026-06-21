import { Check } from "lucide-react";
import { cn } from "@/core/utils/index";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import type { Plan } from "../types";
import { FeatureHint } from "./FeatureHint";

type PricingCardProps = {
  plan: Plan;
  slot?: React.ReactNode;
};

const toPersianDigits = (value: number | string) =>
  String(value).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export function PricingCard({ plan, slot }: PricingCardProps) {
  const isFeatured = Boolean(plan.featured);

  return (
    <Card
      className={cn(
        "gap-0",
        isFeatured && "bg-primary text-primary-foreground ring-0",
      )}
    >
      <CardHeader className="gap-2">
        <h3 className="text-xl font-semibold tracking-tight">{plan.name}</h3>
        <p
          className={cn(
            "text-sm leading-relaxed",
            isFeatured ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {plan.description}
        </p>
      </CardHeader>

      <CardContent className="mt-5 space-y-4">
        <div className="flex items-baseline gap-2">
          {plan.originalPrice ? (
            <span
              className={cn(
                "text-xl font-medium line-through",
                isFeatured
                  ? "text-primary-foreground/40"
                  : "text-muted-foreground/60",
              )}
            >
              ${toPersianDigits(plan.originalPrice)}
            </span>
          ) : null}
          <span className="text-4xl font-bold tracking-tight tabular-nums">
            ${toPersianDigits(plan.price)}
          </span>
          <span
            className={cn(
              "text-sm",
              isFeatured
                ? "text-primary-foreground/60"
                : "text-muted-foreground",
            )}
          >
            /ماه
          </span>
        </div>

        {plan.savings ? (
          <p className="text-sm font-medium text-emerald-400">{plan.savings}</p>
        ) : null}

        <Button
          size="lg"
          className={cn(
            "w-full",
            isFeatured &&
              "bg-background text-foreground hover:bg-background/90",
          )}
        >
          {plan.cta}
        </Button>

        {slot}
      </CardContent>

      <CardContent className="mt-6 space-y-3">
        <p className="text-sm font-semibold">{plan.includedTitle}</p>
        <ul className="space-y-2.5">
          {plan.features.map((feature) => (
            <li
              key={feature.label}
              className="flex items-center gap-2.5 text-sm"
            >
              <Check
                className={cn(
                  "size-4 shrink-0",
                  isFeatured ? "text-emerald-400" : "text-emerald-600",
                )}
                strokeWidth={2.5}
              />
              <span
                className={cn(
                  "flex-1",
                  isFeatured
                    ? "text-primary-foreground/90"
                    : "text-foreground/90",
                )}
              >
                {feature.label}
              </span>
              {feature.hint ? <FeatureHint hint={feature.hint} /> : null}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
