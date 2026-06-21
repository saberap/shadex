"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronsUpDown,
  Command,
  Files,
  HelpCircle,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appConfig } from "@/core/config";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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
  useSidebar,
} from "@/shared/components/ui/sidebar";
import Image from "next/image";

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
  { label: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
  { label: "تحلیل‌ها", href: "/analytics", icon: BarChart3 },
  { label: "کاربران", href: "/users", icon: Users },
  { label: "محصولات", href: "/products", icon: Package },
  { label: "پیام‌ها", href: "/messages", icon: MessageSquare, badge: 3 },
  { label: "چت هوش مصنوعی", href: "/ai-chat", icon: Bot },
];

const pages: NavGroup = {
  label: "صفحه‌ها",
  icon: Files,
  items: [{ label: "قیمت‌گذاری", href: "/pricing" }],
};

const components: NavGroup = {
  label: "کامپوننت‌ها",
  icon: LayoutGrid,
  items: [
    { label: "جدول داده", href: "/components/data-grid" },
    { label: "آپلود فایل", href: "/components/file-upload" },
  ],
};

const auth: NavGroup = {
  label: "احراز هویت",
  icon: Shield,
  items: [
    { label: "ورود", href: "/login" },
    { label: "ثبت‌نام", href: "/register" },
    { label: "فراموشی رمز عبور", href: "/forgot-password" },
  ],
};

const settings: NavGroup = {
  label: "تنظیمات",
  icon: Settings,
  items: [
    { label: "عمومی", href: "/settings" },
    { label: "صورتحساب", href: "/settings/billing" },
    { label: "اعلان‌ها", href: "/settings/notifications" },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();

  const isSectionActive = (items: { href: string }[]) =>
    items.some((item) => pathname === item.href);

  return (
    <Sidebar collapsible="icon" side={appConfig.direction === "rtl" ? "right" : "left"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Image src="/images/logo/mofid.svg" className="rounded-md" width={35} height={35} alt="Logo" />
                </div>
                <div className="flex flex-col gap-0.5 justify-start leading-none">
                  <span className="font-semibold">کارگزاری مفید</span>
                  <span className="text-xs text-muted-foreground text-right">نسخه ۱.۰.۰</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>برنامه</SidebarGroupLabel>
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
          <SidebarGroupLabel>صفحه‌ها</SidebarGroupLabel>
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
          <SidebarGroupLabel>سیستم</SidebarGroupLabel>
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
                  tooltip="مرکز راهنما"
                  isActive={pathname === "/help"}
                >
                  <Link href="/help">
                    <HelpCircle />
                    <span>مرکز راهنما</span>
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
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function UserMenu() {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          tooltip="صابر علی‌پور"
          className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          <Avatar size="sm">
            <AvatarFallback className="text-xs">صع</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-0.5 leading-none text-right">
            <span className="truncate text-sm font-medium">صابر علی‌پور</span>
            <span className="truncate text-xs text-muted-foreground">
              alipournet@gmail.com
            </span>
          </div>
          <ChevronsUpDown className="ms-auto size-4 text-muted-foreground" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={8}
        className="min-w-56 p-0"
      >
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-2.5 px-2 py-2.5">
            <Avatar size="default">
              <AvatarFallback className="text-sm">صع</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
              <span className="truncate text-sm font-medium text-foreground">
                صابر علی‌پور
              </span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                alipournet@gmail.com
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                آنلاین
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-0 my-0" />
        <div className="p-1">
          <DropdownMenuItem asChild className="px-2 py-1.5">
            <Link href="/settings">
              <User className="size-4" />
              <span>مشاهده پروفایل</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" className="px-2 py-1.5">
            <LogOut className="size-4" />
            <span>خروج</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
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
            <ChevronLeft className="mr-auto transition-transform duration-150 group-data-[state=open]/collapsible:-rotate-90" />
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
