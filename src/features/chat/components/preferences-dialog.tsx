"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Eye,
  Keyboard,
  MessageSquare,
  Palette,
  Settings2,
  Volume2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/core/utils/cn";

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
    value: ChatPreferences[K]
  ) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    writePreferences(prefs);
    toast.success("Preferences saved");
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
            Preferences
          </DialogTitle>
          <DialogDescription className="text-xs">
            Customize how messages, notifications, and the interface behave.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-6 px-5 py-4">
            <Section
              icon={<Bell className="size-3.5" />}
              title="Notifications"
              description="How and when you're alerted about new messages."
            >
              <SettingRow
                label="Notifications"
                description="Enable all message notifications."
              >
                <Switch
                  checked={prefs.notificationsEnabled}
                  onCheckedChange={(v) => update("notificationsEnabled", v)}
                />
              </SettingRow>

              <SettingRow
                label="Sound"
                description="Play a sound when a new message arrives."
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
                label="Desktop notifications"
                description="Show a system notification when the app isn't focused."
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
              title="Privacy"
              description="Control what others can see about your activity."
            >
              <SettingRow
                label="Read receipts"
                description="Let others know when you've read their messages."
              >
                <Switch
                  checked={prefs.readReceipts}
                  onCheckedChange={(v) => update("readReceipts", v)}
                />
              </SettingRow>
              <SettingRow
                label="Typing indicator"
                description="Show others when you're typing a message."
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
              title="Appearance"
              description="Adjust how the chat looks and feels."
            >
              <SettingRow
                label="Show avatars"
                description="Display avatars next to incoming messages."
              >
                <Switch
                  checked={prefs.showAvatars}
                  onCheckedChange={(v) => update("showAvatars", v)}
                />
              </SettingRow>

              <SettingRow
                label="Density"
                description="How much breathing room between rows."
              >
                <Select
                  value={prefs.density}
                  onValueChange={(v) => update("density", v as Density)}
                >
                  <SelectTrigger size="sm" className="w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              <SettingRow
                label="Theme"
                description="Match system, or force light or dark."
              >
                <Select
                  value={prefs.theme}
                  onValueChange={(v) => update("theme", v as Theme)}
                >
                  <SelectTrigger size="sm" className="w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </Section>

            <Separator />

            <Section
              icon={<MessageSquare className="size-3.5" />}
              title="Messaging"
              description="Tune how the composer behaves."
            >
              <SettingRow
                label="Send with"
                description="Choose how messages are sent."
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
                    <SelectItem value="enter">Enter to send</SelectItem>
                    <SelectItem value="shift-enter">
                      Shift + Enter to send
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
            className="mr-auto"
            onClick={handleReset}
          >
            Reset to defaults
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSave}>
            Save changes
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
      <div className="flex flex-col gap-2 pl-8">{children}</div>
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
        disabled && "opacity-50"
      )}
    >
      <div className="flex min-w-0 items-start gap-2">
        {icon && (
          <span className="mt-0.5 text-muted-foreground">{icon}</span>
        )}
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
