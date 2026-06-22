"use client";

import {
  Avatar,
  AvatarFallback,
  Button,
  cn,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { motion } from "framer-motion";
import {
  Bot,
  Check,
  ChevronDown,
  Copy,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Message } from "../types";
import { CodeBlock } from "./CodeBlock";
import { ThinkingPanel } from "./ThinkingPanel";

interface MessageBubbleProps {
  message: Message;
}

// Simple markdown renderer
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      result.push(
        <ul key={key++} className="my-1.5 ms-4 space-y-0.5 list-disc">
          {listItems}
        </ul>,
      );
      listItems = [];
    }
  };

  const renderInline = (t: string, k: number): React.ReactNode => {
    const parts = t.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    return (
      <span key={k}>
        {parts.map((part, pi) => {
          if (part.startsWith("**") && part.endsWith("**"))
            return (
              <strong key={pi} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          if (part.startsWith("`") && part.endsWith("`"))
            return (
              <code
                key={pi}
                className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono"
              >
                {part.slice(1, -1)}
              </code>
            );
          if (part.startsWith("*") && part.endsWith("*"))
            return <em key={pi}>{part.slice(1, -1)}</em>;
          return part;
        })}
      </span>
    );
  };

  for (const line of lines) {
    if (line.startsWith("# ")) {
      flushList();
      result.push(
        <h2
          key={key++}
          className="mt-3 mb-1.5 text-base font-semibold text-foreground"
        >
          {line.slice(2)}
        </h2>,
      );
    } else if (line.startsWith("## ")) {
      flushList();
      result.push(
        <h3
          key={key++}
          className="mt-2.5 mb-1 text-sm font-semibold text-foreground"
        >
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("### ")) {
      flushList();
      result.push(
        <h4
          key={key++}
          className="mt-2 mb-0.5 text-sm font-medium text-foreground"
        >
          {line.slice(4)}
        </h4>,
      );
    } else if (/^[-*] /.test(line)) {
      listItems.push(
        <li key={key++} className="text-sm leading-relaxed">
          {renderInline(line.slice(2), key)}
        </li>,
      );
    } else if (/^\d+\. /.test(line)) {
      listItems.push(
        <li key={key++} className="text-sm leading-relaxed">
          {renderInline(line.replace(/^\d+\. /, ""), key)}
        </li>,
      );
    } else if (line.trim() === "") {
      flushList();
      result.push(<div key={key++} className="h-1" />);
    } else {
      flushList();
      result.push(
        <p key={key++} className="text-sm leading-relaxed">
          {renderInline(line, key)}
        </p>,
      );
    }
  }
  flushList();
  return result;
}

function StreamingCursor() {
  return (
    <motion.span
      className="inline-block ms-0.5 translate-y-0.5 text-primary text-sm"
      animate={{ opacity: [1, 0] }}
      transition={{ repeat: Infinity, duration: 0.6, repeatType: "reverse" }}
    >
      ▋
    </motion.span>
  );
}

function TableMessage({ tableContent }: Pick<Message, "tableContent">) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  if (!tableContent) return null;

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...tableContent.rows].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    return sortAsc
      ? String(av).localeCompare(String(bv), undefined, { numeric: true })
      : String(bv).localeCompare(String(av), undefined, { numeric: true });
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <ScrollArea className="max-h-72">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {tableContent.columns.map((col) => (
                <TableHead
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer select-none text-xs font-semibold whitespace-nowrap hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <ChevronDown
                        className={cn(
                          "size-3 transition-transform",
                          !sortAsc && "rotate-180",
                        )}
                      />
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((row, ri) => (
              <TableRow key={ri} className="hover:bg-muted/30">
                {tableContent.columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className="text-xs py-2 whitespace-nowrap"
                  >
                    {row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

function ChartMessage({ chartContent }: Pick<Message, "chartContent">) {
  if (!chartContent) return null;

  const _ChartComponent =
    chartContent.type === "line"
      ? LineChart
      : chartContent.type === "area"
        ? AreaChart
        : BarChart;

  const xKey =
    Object.keys(chartContent.data[0] ?? {}).find(
      (k) => typeof chartContent.data[0]?.[k] === "string",
    ) ?? "name";

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <p className="mb-3 text-sm font-medium text-foreground">
        {chartContent.title}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        {chartContent.type === "bar" ? (
          <BarChart
            data={chartContent.data}
            margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 10 }}
              className="text-muted-foreground"
            />
            <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            {chartContent.keys.map((k) => (
              <Bar
                key={k.key}
                dataKey={k.key}
                fill={k.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        ) : chartContent.type === "area" ? (
          <AreaChart
            data={chartContent.data}
            margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <RechartsTooltip contentStyle={{ fontSize: 12 }} />
            {chartContent.keys.map((k) => (
              <Area
                key={k.key}
                type="monotone"
                dataKey={k.key}
                stroke={k.color}
                fill={k.color}
                fillOpacity={0.15}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart
            data={chartContent.data}
            margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <RechartsTooltip contentStyle={{ fontSize: 12 }} />
            {chartContent.keys.map((k) => (
              <Line
                key={k.key}
                type="monotone"
                dataKey={k.key}
                stroke={k.color}
                dot={false}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function AssistantActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 pt-1">
      <Button
        variant="ghost"
        size="icon"
        className="size-6 text-muted-foreground hover:text-foreground"
        onClick={handleCopy}
        aria-label="کپی پاسخ"
      >
        {copied ? (
          <Check className="size-3 text-green-500" />
        ) : (
          <Copy className="size-3" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-6 text-muted-foreground hover:text-foreground",
          liked === true && "text-green-500",
        )}
        onClick={() => setLiked((p) => (p === true ? null : true))}
        aria-label="پاسخ خوب"
      >
        <ThumbsUp className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-6 text-muted-foreground hover:text-foreground",
          liked === false && "text-destructive",
        )}
        onClick={() => setLiked((p) => (p === false ? null : false))}
        aria-label="پاسخ بد"
      >
        <ThumbsDown className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 text-muted-foreground hover:text-foreground"
        aria-label="تولید مجدد پاسخ"
      >
        <RefreshCw className="size-3" />
      </Button>
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const displayText = message.isStreaming
    ? (message.streamingText ?? "")
    : message.content;

  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex justify-end px-4 sm:px-6"
      >
        <div className="flex max-w-[80%] flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">شما</span>
            <Avatar size="sm" className="size-6">
              <AvatarFallback className="text-[9px] font-semibold bg-primary/10 text-primary">
                <User className="size-3" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Assistant message
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex gap-3 px-4 sm:px-6"
    >
      <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
        <Bot className="size-4 text-primary" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Thinking panel */}
        {message.thinkingSteps && message.thinkingSteps.length > 0 && (
          <ThinkingPanel steps={message.thinkingSteps} />
        )}

        {/* Content */}
        {message.type === "code" && message.codeContent && (
          <div className="space-y-2">
            {message.content && (
              <div className="space-y-0.5">
                {renderMarkdown(message.content)}
              </div>
            )}
            <CodeBlock {...message.codeContent} />
          </div>
        )}

        {message.type === "table" && message.tableContent && (
          <div className="space-y-2">
            {message.content && (
              <div className="space-y-0.5">
                {renderMarkdown(message.content)}
              </div>
            )}
            <TableMessage tableContent={message.tableContent} />
          </div>
        )}

        {message.type === "chart" && message.chartContent && (
          <div className="space-y-2">
            {message.content && (
              <div className="space-y-0.5">
                {renderMarkdown(message.content)}
              </div>
            )}
            <ChartMessage chartContent={message.chartContent} />
          </div>
        )}

        {message.type === "text" && (
          <div className="space-y-0.5">
            {renderMarkdown(displayText)}
            {message.isStreaming && <StreamingCursor />}
          </div>
        )}

        {/* Action bar (only for completed messages) */}
        {!message.isStreaming && <AssistantActions content={message.content} />}
      </div>
    </motion.div>
  );
}
