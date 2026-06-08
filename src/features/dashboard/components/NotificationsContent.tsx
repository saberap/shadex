"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CreditCard,
  Info,
  Package,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/core/utils/cn";

type NotifType = "success" | "info" | "warning" | "error";

interface Notification {
  id: number;
  type: NotifType;
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "success",
    icon: CreditCard,
    title: "Payment received",
    description: "You received a payment of $1,999.00 from Olivia Martin.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    icon: Users,
    title: "New user registered",
    description: "Jackson Lee created a new account and is waiting for approval.",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    icon: AlertTriangle,
    title: "Storage limit approaching",
    description: "You have used 87% of your 50 GB storage quota.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    type: "success",
    icon: Package,
    title: "Order fulfilled",
    description: "Order #4821 has been shipped and is on its way.",
    time: "3 hr ago",
    read: true,
  },
  {
    id: 5,
    type: "info",
    icon: Settings,
    title: "System maintenance",
    description: "Scheduled maintenance is planned for Jun 10, 2026 at 02:00 UTC.",
    time: "5 hr ago",
    read: true,
  },
  {
    id: 6,
    type: "error",
    icon: AlertTriangle,
    title: "Webhook delivery failed",
    description: "3 webhook events failed to deliver to https://api.example.com/hook.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 7,
    type: "success",
    icon: CheckCircle2,
    title: "Subscription renewed",
    description: "Your Pro plan subscription has been successfully renewed.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 8,
    type: "info",
    icon: Info,
    title: "New feature available",
    description: "Advanced analytics with custom date ranges is now available.",
    time: "3 days ago",
    read: true,
  },
];

const typeStyle: Record<NotifType, { bg: string; icon: string }> = {
  success: { bg: "bg-emerald-50 dark:bg-emerald-950/40", icon: "text-emerald-600 dark:text-emerald-400" },
  info:    { bg: "bg-blue-50 dark:bg-blue-950/40",     icon: "text-blue-600 dark:text-blue-400" },
  warning: { bg: "bg-amber-50 dark:bg-amber-950/40",   icon: "text-amber-600 dark:text-amber-400" },
  error:   { bg: "bg-red-50 dark:bg-red-950/40",       icon: "text-red-600 dark:text-red-400" },
};

export function NotificationsContent() {
  const [items, setItems] = useState(initialNotifications);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismiss = (id: number) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  const markRead = (id: number) =>
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const unread = items.filter((n) => !n.read);
  const read = items.filter((n) => n.read);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge className="h-5 px-1.5 text-xs">{unreadCount} new</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                <CheckCircle2 className="size-3" />
                Mark all read
              </Button>
            </div>
          </div>
          <CardDescription>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
              : "You're all caught up."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {unread.length > 0 && (
            <>
              <div className="px-4 sm:px-6 py-2 bg-muted/40 border-y">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New
                </p>
              </div>
              <NotificationList items={unread} onDismiss={dismiss} onRead={markRead} />
            </>
          )}

          {read.length > 0 && (
            <>
              <div className="px-4 sm:px-6 py-2 bg-muted/40 border-y">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Earlier
                </p>
              </div>
              <NotificationList items={read} onDismiss={dismiss} onRead={markRead} />
            </>
          )}

          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Bell className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationList({
  items,
  onDismiss,
  onRead,
}: {
  items: Notification[];
  onDismiss: (id: number) => void;
  onRead: (id: number) => void;
}) {
  return (
    <div className="divide-y">
      {items.map((n) => {
        const style = typeStyle[n.type];
        return (
          <div
            key={n.id}
            className={cn(
              "flex items-start gap-3 px-4 sm:px-6 py-4 transition-colors hover:bg-muted/30 cursor-pointer",
              !n.read && "bg-muted/20"
            )}
            onClick={() => onRead(n.id)}
          >
            <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full", style.bg)}>
              <n.icon className={cn("size-4", style.icon)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={cn("text-sm truncate", !n.read && "font-semibold")}>
                  {n.title}
                </p>
                {!n.read && (
                  <span className="size-1.5 rounded-full bg-primary shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {n.description}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100 mt-0.5"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(n.id);
              }}
            >
              <X className="size-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
