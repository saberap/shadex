"use client";

import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from "@repo/ui";
import {
  Bell,
  Eye,
  Keyboard,
  MessageSquare,
  Palette,
  Settings2,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Density = "comfortable" | "compact";
type SendBehavior = "enter" | "shift-enter";
type Theme = "system" | "light" | "dark";

interface ChatPreferences {
  notificationsEnabled: boolean;
  sounds: boolean;
  desktopNotifications: boolean;
  readReceipts: boolean;
  showTyping: boolean;
  showAvatars: boolean;
  density: Density;
  sendBehavior: SendBehavior;
  theme: Theme;
}

const DEFAULTS: ChatPreferences = {
  notificationsEnabled: true,
  sounds: true,
  desktopNotifications: false,
  readReceipts: true,
  showTyping: true,
  showAvatars: true,
  density: "comfortable",
  sendBehavior: "enter",
  theme: "system",
};

const STORAGE_KEY = "shadex-chat-preferences";

function readPreferences(): ChatPreferences {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<ChatPreferences>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function writePreferences(prefs: ChatPreferences) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function PreferencesDialog({
  open,
  onOpenChange,
}: PreferencesDialogProps) {
  const [prefs, setPrefs] = useState<ChatPreferences>(DEFAULTS);

  useEffect(() => {
    if (open) setPrefs(readPreferences());
  }, [open]);

  const update = <K extends keyof ChatPreferences>(
    key: K,
    value: ChatPreferences[K],
  ) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    writePreferences(prefs);
    toast.success("تنظیمات ذخیره شد");
    onOpenChange(false);
  };

  const handleReset = () => {
    setPrefs(DEFAULTS);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Settings2 className="size-4" />
            تنظیمات
          </DialogTitle>
          <DialogDescription className="text-xs">
            رفتار پیام‌ها، اعلان‌ها و رابط کاربری را شخصی‌سازی کنید.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-6 px-5 py-4">
            <Section
              icon={<Bell className="size-3.5" />}
              title="اعلان‌ها"
              description="چگونگی و زمان دریافت اعلان پیام‌های جدید."
            >
              <SettingRow
                label="اعلان‌ها"
                description="فعال‌سازی همه اعلان‌های پیام."
              >
                <Switch
                  checked={prefs.notificationsEnabled}
                  onCheckedChange={(v) => update("notificationsEnabled", v)}
                />
              </SettingRow>

              <SettingRow
                label="صدا"
                description="پخش صدا هنگام دریافت پیام جدید."
                icon={<Volume2 className="size-3.5" />}
                disabled={!prefs.notificationsEnabled}
              >
                <Switch
                  checked={prefs.sounds}
                  onCheckedChange={(v) => update("sounds", v)}
                  disabled={!prefs.notificationsEnabled}
                />
              </SettingRow>

              <SettingRow
                label="اعلان‌های دسکتاپ"
                description="نمایش اعلان سیستمی زمانی که برنامه در فوکوس نیست."
                disabled={!prefs.notificationsEnabled}
              >
                <Switch
                  checked={prefs.desktopNotifications}
                  onCheckedChange={(v) => update("desktopNotifications", v)}
                  disabled={!prefs.notificationsEnabled}
                />
              </SettingRow>
            </Section>

            <Separator />

            <Section
              icon={<Eye className="size-3.5" />}
              title="حریم خصوصی"
              description="کنترل کنید دیگران چه چیزی از فعالیت شما می‌بینند."
            >
              <SettingRow
                label="رسید خوانده‌شدن"
                description="به دیگران اطلاع دهید پیامشان را خوانده‌اید."
              >
                <Switch
                  checked={prefs.readReceipts}
                  onCheckedChange={(v) => update("readReceipts", v)}
                />
              </SettingRow>
              <SettingRow
                label="نشانگر تایپ"
                description="به دیگران نشان دهید در حال نوشتن پیام هستید."
              >
                <Switch
                  checked={prefs.showTyping}
                  onCheckedChange={(v) => update("showTyping", v)}
                />
              </SettingRow>
            </Section>

            <Separator />

            <Section
              icon={<Palette className="size-3.5" />}
              title="ظاهر"
              description="ظاهر و حس چت را تنظیم کنید."
            >
              <SettingRow
                label="نمایش آواتارها"
                description="نمایش آواتار کنار پیام‌های دریافتی."
              >
                <Switch
                  checked={prefs.showAvatars}
                  onCheckedChange={(v) => update("showAvatars", v)}
                />
              </SettingRow>

              <SettingRow label="تراکم" description="میزان فاصله بین ردیف‌ها.">
                <Select
                  value={prefs.density}
                  onValueChange={(v) => update("density", v as Density)}
                >
                  <SelectTrigger size="sm" className="w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">راحت</SelectItem>
                    <SelectItem value="compact">فشرده</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              <SettingRow
                label="پوسته"
                description="هماهنگ با سیستم، یا روشن یا تاریک."
              >
                <Select
                  value={prefs.theme}
                  onValueChange={(v) => update("theme", v as Theme)}
                >
                  <SelectTrigger size="sm" className="w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">سیستم</SelectItem>
                    <SelectItem value="light">روشن</SelectItem>
                    <SelectItem value="dark">تاریک</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </Section>

            <Separator />

            <Section
              icon={<MessageSquare className="size-3.5" />}
              title="پیام‌رسانی"
              description="رفتار جعبه نگارش پیام را تنظیم کنید."
            >
              <SettingRow
                label="ارسال با"
                description="انتخاب کنید پیام‌ها چگونه ارسال شوند."
                icon={<Keyboard className="size-3.5" />}
              >
                <Select
                  value={prefs.sendBehavior}
                  onValueChange={(v) =>
                    update("sendBehavior", v as SendBehavior)
                  }
                >
                  <SelectTrigger size="sm" className="w-44 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enter">Enter برای ارسال</SelectItem>
                    <SelectItem value="shift-enter">
                      Shift + Enter برای ارسال
                    </SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </Section>
          </div>
        </ScrollArea>

        <DialogFooter className="m-0 rounded-b-xl border-t px-5 py-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="me-auto"
            onClick={handleReset}
          >
            بازنشانی به پیش‌فرض‌ها
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            لغو
          </Button>
          <Button type="button" size="sm" onClick={handleSave}>
            ذخیره تغییرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ icon, title, description, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="text-[11px] text-muted-foreground">
            {description}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 ps-8">{children}</div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

function SettingRow({
  label,
  description,
  icon,
  disabled,
  children,
}: SettingRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg px-2 py-1.5 transition-opacity",
        disabled && "opacity-50",
      )}
    >
      <div className="flex min-w-0 items-start gap-2">
        {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
        <div className="flex min-w-0 flex-col">
          <Label className="text-xs font-medium">{label}</Label>
          {description && (
            <span className="text-[11px] text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
