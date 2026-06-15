"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  ChevronRight,
  Command,
  Files,
  HelpCircle,
  LayoutDashboard,
  LayoutGrid,
  MessageSquare,
  Package,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";

type NavLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

type NavGroup = {
  label: string;
  icon: LucideIcon;
  items: { label: string; href: string }[];
};

const application: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Users", href: "/users", icon: Users },
  { label: "Products", href: "/products", icon: Package },
  { label: "Messages", href: "/messages", icon: MessageSquare, badge: 3 },
  { label: "AI Chat", href: "/ai-chat", icon: Bot },
];

const pages: NavGroup = {
  label: "Pages",
  icon: Files,
  items: [{ label: "Pricing", href: "/pricing" }],
};

const components: NavGroup = {
  label: "Components",
  icon: LayoutGrid,
  items: [
    { label: "DataGrid", href: "/components/data-grid" },
    { label: "File Upload", href: "/components/file-upload" },
  ],
};

const auth: NavGroup = {
  label: "Auth",
  icon: Shield,
  items: [
    { label: "Sign In", href: "/login" },
    { label: "Sign Up", href: "/register" },
    { label: "Forgot Password", href: "/forgot-password" },
  ],
};

const settings: NavGroup = {
  label: "Settings",
  icon: Settings,
  items: [
    { label: "General", href: "/settings" },
    { label: "Billing", href: "/settings/billing" },
    { label: "Notifications", href: "/settings/notifications" },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();

  const isSectionActive = (items: { href: string }[]) =>
    items.some((item) => pathname === item.href);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Shadex Admin</span>
                  <span className="text-xs text-muted-foreground">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {application.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <CollapsibleNavGroup
                group={components}
                pathname={pathname}
                defaultOpen={isSectionActive(components.items)}
              />
              <CollapsibleNavGroup
                group={pages}
                pathname={pathname}
                defaultOpen={isSectionActive(pages.items)}
              />
              <CollapsibleNavGroup
                group={auth}
                pathname={pathname}
                defaultOpen={isSectionActive(auth.items)}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <CollapsibleNavGroup
                group={settings}
                pathname={pathname}
                defaultOpen={isSectionActive(settings.items)}
              />
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Help Center"
                  isActive={pathname === "/help"}
                >
                  <Link href="/help">
                    <HelpCircle />
                    <span>Help Center</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Saber Alipour" asChild>
              <Link href="/settings">
                <Avatar size="sm">
                  <AvatarFallback className="text-xs">SA</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5 leading-none">
                  <span className="truncate text-sm font-medium">
                    Saber Alipour
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    alipournet@gmail.com
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function CollapsibleNavGroup({
  group,
  pathname,
  defaultOpen,
}: {
  group: NavGroup;
  pathname: string;
  defaultOpen: boolean;
}) {
  return (
    <Collapsible
      asChild
      defaultOpen={defaultOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={group.label}>
            <group.icon />
            <span>{group.label}</span>
            <ChevronRight className="ml-auto transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {group.items.map((item) => (
              <SidebarMenuSubItem key={item.href}>
                <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
