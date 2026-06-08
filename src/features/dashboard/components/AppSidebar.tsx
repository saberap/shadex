"use client";

import {
  BarChart3,
  Bell,
  ChevronDown,
  Command,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/core/utils/cn";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";

const navMain = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Users", href: "/users", icon: Users },
  { label: "Products", href: "/products", icon: Package },
  { label: "Messages", href: "/messages", icon: MessageSquare, badge: 3 },
];

const navAuth = [
  { label: "Sign In", href: "/login" },
  { label: "Sign Up", href: "/register" },
  { label: "Forgot Password", href: "/forgot-password" },
];

const navSettings = [
  { label: "General", href: "/settings" },
  { label: "Billing", href: "/settings/billing", icon: CreditCard },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
];

interface AppSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

function SidebarInner({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const [authOpen, setAuthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4 shrink-0">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Command className="size-4" />
        </div>
        <span className="text-sm font-semibold text-sidebar-foreground">Shadex Admin</span>
      </div>

      <Separator className="opacity-50 shrink-0" />

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto">
        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          General
        </p>

        {navMain.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="h-5 px-1.5 text-xs">{item.badge}</Badge>
              )}
            </Link>
          );
        })}

        <p className="mt-4 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Pages
        </p>

        <Collapsible open={authOpen} onOpenChange={setAuthOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors">
              <Shield className="size-4 shrink-0" />
              <span className="flex-1 text-left">Auth</span>
              <ChevronDown className={cn("size-3.5 transition-transform", authOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-6 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
              {navAuth.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-sm transition-colors",
                    pathname === item.href
                      ? "text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-sidebar-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <p className="mt-4 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Other
        </p>

        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors">
              <Settings className="size-4 shrink-0" />
              <span className="flex-1 text-left">Settings</span>
              <ChevronDown className={cn("size-3.5 transition-transform", settingsOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-6 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
              {navSettings.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-sm transition-colors",
                    pathname === item.href
                      ? "text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-sidebar-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Link
          href="/help"
          onClick={onLinkClick}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
        >
          <HelpCircle className="size-4 shrink-0" />
          Help Center
        </Link>
      </nav>

      <Separator className="opacity-50 shrink-0" />

      {/* User footer */}
      <div className="p-3 shrink-0">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-sidebar-accent/60 transition-colors cursor-pointer group">
          <Avatar size="sm">
            <AvatarFallback className="text-xs font-semibold">SA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">Saber Alipour</p>
            <p className="text-xs text-muted-foreground truncate">alipournet@gmail.com</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
            asChild
          >
            <Link href="/login">
              <LogOut className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar({ mobileOpen = false, onClose }: AppSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border">
        <SidebarInner />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onClose?.()}>
        <SheetContent side="left" className="w-60 p-0 bg-sidebar border-sidebar-border">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation menu</SheetTitle>
          </SheetHeader>
          <SidebarInner onLinkClick={onClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
