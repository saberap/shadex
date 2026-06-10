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
    title: "Analyze Data",
    prompt: "Analyze this dataset and provide key insights, trends, and actionable recommendations.",
  },
  {
    icon: Image,
    title: "Generate Image",
    prompt: "Generate a detailed prompt for creating a professional image for my project.",
  },
  {
    icon: Code2,
    title: "Write Code",
    prompt: "Write a clean, production-ready TypeScript function with proper error handling and types.",
  },
  {
    icon: Brain,
    title: "Brainstorm Ideas",
    prompt: "Brainstorm 10 creative and innovative ideas for improving user engagement in a SaaS product.",
  },
  {
    icon: Database,
    title: "Create SQL Query",
    prompt: "Write an optimized SQL query with proper indexing hints for querying a large dataset.",
  },
  {
    icon: FileSearch,
    title: "Summarize Document",
    prompt: "Summarize this document and extract the 5 most important points in bullet format.",
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
