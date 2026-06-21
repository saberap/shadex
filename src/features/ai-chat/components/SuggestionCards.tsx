"use client";

import {
  BarChart3,
  Brain,
  Code2,
  Database,
  FileSearch,
  Image,
} from "lucide-react";
import { motion } from "framer-motion";
import { useChatContext } from "../context/ChatContext";

const suggestions = [
  {
    icon: BarChart3,
    title: "تحلیل داده",
    prompt: "این مجموعه‌داده را تحلیل کن و بینش‌های کلیدی، روندها و توصیه‌های عملی ارائه بده.",
  },
  {
    icon: Image,
    title: "تولید تصویر",
    prompt: "یک پرامپت دقیق برای ساخت یک تصویر حرفه‌ای برای پروژه‌ام تولید کن.",
  },
  {
    icon: Code2,
    title: "نوشتن کد",
    prompt: "یک تابع TypeScript تمیز و آماده تولید با مدیریت خطای مناسب و تایپ‌ها بنویس.",
  },
  {
    icon: Brain,
    title: "طوفان فکری",
    prompt: "۱۰ ایده خلاقانه و نوآورانه برای بهبود تعامل کاربر در یک محصول SaaS ارائه بده.",
  },
  {
    icon: Database,
    title: "ساخت کوئری SQL",
    prompt: "یک کوئری SQL بهینه با راهنمایی‌های ایندکس‌گذاری مناسب برای کوئری روی یک مجموعه‌داده بزرگ بنویس.",
  },
  {
    icon: FileSearch,
    title: "خلاصه‌سازی سند",
    prompt: "این سند را خلاصه کن و ۵ نکته مهم را به‌صورت فهرستی استخراج کن.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function SuggestionCards() {
  const { sendMessage } = useChatContext();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
    >
      {suggestions.map((s) => (
        <motion.button
          key={s.title}
          variants={item}
          onClick={() => sendMessage(s.prompt)}
          className="group flex flex-col gap-2.5 rounded-xl border border-border/60 bg-card p-4 text-left hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm transition-all duration-200"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <s.icon className="size-4" />
          </div>
          <p className="text-sm font-medium text-foreground leading-tight">{s.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {s.prompt}
          </p>
        </motion.button>
      ))}
    </motion.div>
  );
}
