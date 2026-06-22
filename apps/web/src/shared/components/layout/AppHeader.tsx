"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Input,
  Separator,
  SidebarTrigger,
} from "@repo/ui";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function AppHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 sm:px-6">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="h-5 data-vertical:self-center"
      />

      <div className="relative max-w-xs flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 start-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="جستجو..."
          className="h-8 bg-muted/40 ps-8 text-sm"
        />
        <kbd className="pointer-events-none absolute top-1/2 end-2.5 hidden h-5 -translate-y-1/2 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium select-none sm:flex">
          ⌘K
        </kbd>
      </div>

      <div className="ms-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="تغییر تم"
        >
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="اعلان‌ها"
        >
          <Bell className="size-4" />
          <Badge className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
            ۴
          </Badge>
        </Button>

        <Avatar size="sm">
          <AvatarFallback className="text-xs font-semibold">صع</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
