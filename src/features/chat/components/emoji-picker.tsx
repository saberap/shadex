"use client";

import { memo, useEffect, useState } from "react";
import {
  Apple,
  Cat,
  Clock,
  Flag,
  Lightbulb,
  Music,
  Plane,
  Search,
  Smile,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/core/utils/cn";

type EmojiCategoryId =
  | "smileys"
  | "animals"
  | "food"
  | "activities"
  | "travel"
  | "objects"
  | "symbols"
  | "recent";

interface EmojiCategory {
  id: EmojiCategoryId;
  label: string;
  icon: LucideIcon;
  emojis: string[];
}

const CATEGORIES: EmojiCategory[] = [
  {
    id: "smileys",
    label: "خنده‌ها و افراد",
    icon: Smile,
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
      "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
      "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
      "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨",
      "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢",
      "🥳", "🥺", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮",
      "😯", "😲", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😢",
      "😭", "😤", "😠", "😡", "🤬", "🤯", "😈", "👿", "💀", "👻",
      "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞",
      "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "👍", "👎",
      "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏",
    ],
  },
  {
    id: "animals",
    label: "حیوانات و طبیعت",
    icon: Cat,
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨",
      "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊",
      "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉",
      "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞",
      "🌸", "💮", "🏵️", "🌹", "🥀", "🌺", "🌻", "🌼", "🌷", "🌱",
      "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂",
    ],
  },
  {
    id: "food",
    label: "خوراک و نوشیدنی",
    icon: Apple,
    emojis: [
      "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐",
      "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑",
      "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅",
      "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳",
      "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕",
      "☕", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍻", "🥂", "🍷",
    ],
  },
  {
    id: "activities",
    label: "فعالیت‌ها",
    icon: Music,
    emojis: [
      "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
      "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🪁",
      "🎯", "🎳", "🎮", "🎰", "🧩", "🎨", "🎭", "🎪", "🎬", "🎤",
      "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🪕", "🎻", "🎲",
    ],
  },
  {
    id: "travel",
    label: "سفر و مکان‌ها",
    icon: Plane,
    emojis: [
      "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐",
      "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴", "🛹", "🛼",
      "🚂", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚀", "🛰️", "🚁",
      "🏖️", "🏝️", "⛰️", "🏔️", "🗻", "🌋", "🏕️", "🏠", "🏡", "🏢",
    ],
  },
  {
    id: "objects",
    label: "اشیاء",
    icon: Lightbulb,
    emojis: [
      "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴", "💶",
      "💷", "💰", "💳", "💎", "⚖️", "🧰", "🔧", "🔨", "🪓", "⛏️",
      "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "💾", "💿", "📀", "🎥",
      "📷", "📸", "📹", "📼", "🔋", "🔌", "📺", "📻", "📞", "☎️",
      "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "📕", "📗", "📘", "📙",
    ],
  },
  {
    id: "symbols",
    label: "نمادها",
    icon: Flag,
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️",
      "✅", "❌", "⭕", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫",
      "⚪", "🟤", "🔶", "🔷", "🔸", "🔹", "♻️", "⚠️", "🚸", "🔔",
      "✨", "⭐", "🌟", "💫", "⚡", "☄️", "🔥", "💥", "☀️", "🌈",
    ],
  },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const RECENT_KEY = "shadex-chat-recent-emojis";
const RECENT_LIMIT = 24;

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [active, setActive] = useState<EmojiCategoryId>("smileys");
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(() => readRecent());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handle = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setReady(true));
    });
    return () => window.cancelAnimationFrame(handle);
  }, []);

  const handleSelect = (emoji: string) => {
    const next = [emoji, ...recent.filter((e) => e !== emoji)].slice(
      0,
      RECENT_LIMIT
    );
    setRecent(next);
    writeRecent(next);
    onSelect(emoji);
  };

  const filteredEmojis = query.trim()
    ? CATEGORIES.flatMap((c) => c.emojis).slice(0, 120)
    : null;

  const activeCategory = CATEGORIES.find((c) => c.id === active);

  return (
    <div className="flex w-72 flex-col">
      <div className="px-2 pt-2">
        <div className="relative">
          <Search className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی ایموجی…"
            className="h-8 rounded-md ps-7 text-xs"
            aria-label="جستجوی ایموجی"
          />
        </div>
      </div>

      <Separator className="mt-2" />

      {!query && (
        <div className="flex items-center gap-0.5 px-1 py-1">
          {recent.length > 0 && (
            <CategoryTab
              icon={Clock}
              label="اخیر"
              active={active === "recent"}
              onClick={() => setActive("recent")}
            />
          )}
          {CATEGORIES.map((c) => (
            <CategoryTab
              key={c.id}
              icon={c.icon}
              label={c.label}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>
      )}

      <Separator />

      <ScrollArea className="h-56">
        <div className="px-2 py-2">
          <p className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {query
              ? "نتایج"
              : active === "recent"
              ? "اخیراً استفاده‌شده"
              : activeCategory?.label}
          </p>
          {ready ? (
            <>
              <EmojiGrid
                emojis={
                  filteredEmojis ??
                  (active === "recent"
                    ? recent
                    : activeCategory?.emojis ?? [])
                }
                onSelect={handleSelect}
              />
              {(
                filteredEmojis ??
                (active === "recent" ? recent : activeCategory?.emojis ?? [])
              ).length === 0 && (
                <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                  {query ? "ایموجی‌ای یافت نشد" : "هنوز چیزی اینجا نیست"}
                </p>
              )}
            </>
          ) : (
            <div className="h-44" />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function CategoryTab({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
        active && "bg-muted text-foreground"
      )}
    >
      <Icon className="size-3.5" />
    </button>
  );
}

const EmojiGrid = memo(function EmojiGrid({
  emojis,
  onSelect,
}: {
  emojis: string[];
  onSelect: (emoji: string) => void;
}) {
  return (
    <div className="grid grid-cols-8 gap-0.5">
      {emojis.map((emoji, i) => (
        <button
          key={`${emoji}-${i}`}
          type="button"
          onClick={() => onSelect(emoji)}
          className="flex size-7 items-center justify-center rounded-md text-base hover:bg-muted"
          aria-label={`افزودن ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
});
