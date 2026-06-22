"use client";

import {
  Badge,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ScrollArea,
  Separator,
  Skeleton,
} from "@repo/ui";
import {
  Calendar,
  Clock,
  Coins,
  FileText,
  Info,
  Layers,
  MessageSquare,
  Settings2,
  Share2,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { useChatContext } from "../context/ChatContext";
import { MODELS } from "../data";

function DetailRow({
  icon: Icon,
  label,
  value,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  badge?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
        {value ? (
          <p className="text-xs font-medium text-foreground truncate">
            {value}
          </p>
        ) : (
          <Skeleton className="h-3 w-20" />
        )}
      </div>
      {badge && (
        <Badge variant="secondary" className="h-4 px-1.5 text-[10px] shrink-0">
          {badge}
        </Badge>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:opacity-80 transition-opacity">
        <div className="flex items-center gap-2">
          <Icon className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">{title}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {open ? "−" : "+"}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString("fa-IR", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(n: number) {
  return n.toLocaleString("fa-IR");
}

export function ConversationDetails() {
  const { activeConversation, messages, tokensUsed } = useChatContext();
  const convMessages = activeConversation
    ? (messages[activeConversation.id] ?? [])
    : [];
  const model = MODELS.find((m) => m.id === activeConversation?.model);
  const attachments = convMessages.flatMap((m) => m.attachments ?? []);
  const estimatedCost =
    model?.cost === "high"
      ? (tokensUsed * 0.000015).toFixed(4)
      : model?.cost === "medium"
        ? (tokensUsed * 0.000008).toFixed(4)
        : (tokensUsed * 0.0000005).toFixed(4);

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/10">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border/50 px-4 h-14">
        <Info className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">جزئیات</span>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-0.5">
          {!activeConversation ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Metadata */}
              <Section title="فراداده" icon={Info}>
                <DetailRow
                  icon={Sparkles}
                  label="مدل"
                  value={model?.name}
                  badge={model?.provider}
                />
                <Separator className="my-0.5" />
                <DetailRow
                  icon={Calendar}
                  label="ایجاد شده"
                  value={formatDate(activeConversation.createdAt)}
                />
                <DetailRow
                  icon={Clock}
                  label="آخرین فعالیت"
                  value={formatDate(activeConversation.updatedAt)}
                />
                <DetailRow
                  icon={MessageSquare}
                  label="پیام‌ها"
                  value={`${formatNumber(convMessages.length)} پیام`}
                />
                {activeConversation.shared && (
                  <DetailRow
                    icon={Share2}
                    label="نمایان بودن"
                    value="پیوند اشتراکی فعال است"
                  />
                )}
              </Section>

              <Separator />

              {/* Token usage */}
              <Section title="مصرف" icon={Coins}>
                <DetailRow
                  icon={Layers}
                  label="توکن‌های استفاده‌شده"
                  value={formatNumber(tokensUsed)}
                />
                <DetailRow
                  icon={Coins}
                  label="هزینه تخمینی"
                  value={`$${estimatedCost}`}
                />
                {/* Mini usage bar */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>مصرف زمینه</span>
                    <span>
                      {formatNumber(tokensUsed)} /{" "}
                      {model?.contextLength ?? "200K"}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/60 transition-all"
                      style={{
                        width: `${Math.min(
                          (tokensUsed /
                            (model?.contextLength?.includes("1M")
                              ? 1_000_000
                              : model?.contextLength?.includes("256K")
                                ? 256_000
                                : 200_000)) *
                            100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </Section>

              <Separator />

              {/* Attached files */}
              <Section
                title="پیوست‌ها"
                icon={FileText}
                defaultOpen={attachments.length > 0}
              >
                {attachments.length === 0 ? (
                  <p className="py-2 text-xs text-muted-foreground">
                    فایلی پیوست نشده است
                  </p>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2"
                      >
                        <FileText className="size-3 shrink-0 text-muted-foreground" />
                        <span className="flex-1 min-w-0 truncate text-xs">
                          {att.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="h-3.5 px-1 text-[9px] uppercase"
                        >
                          {att.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Separator />

              {/* System prompt */}
              <Section title="پرامپت سیستم" icon={Terminal} defaultOpen={false}>
                <div className="mt-1.5 rounded-lg bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    شما یک دستیار هوش مصنوعی مفید برای یک پلتفرم تحلیلی SaaS
                    هستید. به کاربران در تحلیل داده‌ها، نوشتن کد و ارائه بینش‌های
                    عملی کمک کنید. مختصر، دقیق و حرفه‌ای باشید.
                  </p>
                </div>
              </Section>

              <Separator />

              {/* Knowledge sources */}
              <Section title="دانش" icon={Settings2} defaultOpen={false}>
                <p className="py-2 text-xs text-muted-foreground">
                  منبع دانش اضافی اضافه نشده است.
                </p>
              </Section>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
