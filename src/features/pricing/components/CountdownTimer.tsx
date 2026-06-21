"use client";

import { useEffect, useState } from "react";
import { cn } from "@/core/utils/index";

type CountdownTimerProps = {
  durationSeconds: number;
  className?: string;
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRemaining(target: number): Remaining {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

const pad = (n: number) =>
  n
    .toString()
    .padStart(2, "0")
    .replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export function CountdownTimer({
  durationSeconds,
  className,
}: CountdownTimerProps) {
  const [target, setTarget] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const end = Date.now() + durationSeconds * 1000;
    setTarget(end);
    setRemaining(getRemaining(end));
  }, [durationSeconds]);

  useEffect(() => {
    if (target === null) return;
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const segments: { value: string; label: string }[] = [
    { value: remaining ? pad(remaining.days) : "--", label: "روز" },
    { value: remaining ? pad(remaining.hours) : "--", label: "ساعت" },
    { value: remaining ? pad(remaining.minutes) : "--", label: "دقیقه" },
    { value: remaining ? pad(remaining.seconds) : "--", label: "ثانیه" },
  ];

  return (
    <div
      className={cn(
        "rounded-lg bg-primary-foreground/10 ring-1 ring-primary-foreground/15 px-4 py-3",
        className,
      )}
    >
      <div className="text-[10px] font-semibold tracking-[0.18em] text-primary-foreground/60 mb-2">
        پایان پیشنهاد تا
      </div>
      <div
        className="grid grid-cols-4 items-center"
        role="timer"
        aria-live="polite"
      >
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className={cn(
              "flex flex-col items-center gap-1 relative",
              i < segments.length - 1 &&
                "after:content-[':'] after:absolute after:end-0 after:top-1/2 after:-translate-y-[55%] after:text-primary-foreground/40 after:text-2xl after:font-light",
            )}
          >
            <span
              className="text-2xl font-semibold tabular-nums leading-none"
              suppressHydrationWarning
            >
              {seg.value}
            </span>
            <span className="text-[10px] font-medium tracking-[0.14em] text-primary-foreground/60">
              {seg.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
