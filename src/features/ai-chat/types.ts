export type ModelId =
  | "gpt-4o"
  | "gpt-4-1"
  | "claude-sonnet"
  | "claude-opus"
  | "gemini-2-5-pro"
  | "gemini-flash";

export type MessageRole = "user" | "assistant";
export type MessageType = "text" | "code" | "table" | "chart" | "image";
export type ActivityIcon = "image" | "file" | "voice" | "shared";

export interface Model {
  id: ModelId;
  name: string;
  provider: "OpenAI" | "Anthropic" | "Google";
  description: string;
  contextLength: string;
  speed: "fast" | "medium" | "slow";
  cost: "low" | "medium" | "high";
}

export interface Folder {
  id: string;
  name: string;
  color: string;
}

export interface Conversation {
  id: string;
  title: string;
  model: ModelId;
  preview: string;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  archived: boolean;
  favorite: boolean;
  shared: boolean;
  folderId?: string;
  messageCount: number;
  isGeneratingTitle?: boolean;
  activity?: ActivityIcon[];
}

export interface CodeContent {
  language: string;
  code: string;
  filename?: string;
}

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableContent {
  columns: TableColumn[];
  rows: Record<string, string | number>[];
}

export interface ChartContent {
  type: "line" | "bar" | "area" | "pie";
  title: string;
  data: Record<string, string | number>[];
  keys: { key: string; color: string }[];
}

export interface Attachment {
  id: string;
  name: string;
  type: "pdf" | "docx" | "xlsx" | "csv" | "png" | "jpg" | "zip";
  size: number;
  uploadProgress?: number;
  status: "uploading" | "success" | "error";
}

export interface ThinkingStep {
  id: string;
  content: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  codeContent?: CodeContent;
  tableContent?: TableContent;
  chartContent?: ChartContent;
  imageUrl?: string;
  attachments?: Attachment[];
  thinkingSteps?: ThinkingStep[];
  isStreaming?: boolean;
  streamingText?: string;
  isThinking?: boolean;
  createdAt: Date;
}
