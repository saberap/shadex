import type {
  ChatUser,
  Conversation,
  Message,
  UserStatus,
} from "./types";

export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeDay(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "long" });
  }
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: target.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}

export function formatConversationTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = diff / 60000;
  if (minutes < 1) return "now";
  if (minutes < 60) return `${Math.floor(minutes)}m`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}h`;
  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}d`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function statusColor(status: UserStatus): string {
  switch (status) {
    case "online":
      return "bg-emerald-500";
    case "away":
      return "bg-amber-500";
    case "busy":
      return "bg-rose-500";
    case "offline":
    default:
      return "bg-muted-foreground/40";
  }
}

export interface MessageGroup {
  authorId: string;
  messages: Message[];
}

export interface DateGroup {
  dateKey: string;
  label: string;
  groups: MessageGroup[];
}

const MESSAGE_GROUP_WINDOW_MS = 5 * 60 * 1000;

export function groupMessagesByDate(messages: Message[]): DateGroup[] {
  const result: DateGroup[] = [];
  let currentDate: DateGroup | null = null;

  for (const message of messages) {
    const date = message.createdAt;
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (!currentDate || currentDate.dateKey !== dateKey) {
      currentDate = {
        dateKey,
        label: formatRelativeDay(date),
        groups: [],
      };
      result.push(currentDate);
    }

    const lastGroup = currentDate.groups[currentDate.groups.length - 1];
    const lastMessage = lastGroup?.messages[lastGroup.messages.length - 1];
    const withinWindow =
      lastMessage &&
      message.createdAt.getTime() - lastMessage.createdAt.getTime() <
        MESSAGE_GROUP_WINDOW_MS;

    if (
      lastGroup &&
      lastGroup.authorId === message.authorId &&
      message.type !== "system" &&
      lastGroup.messages[0].type !== "system" &&
      withinWindow
    ) {
      lastGroup.messages.push(message);
    } else {
      currentDate.groups.push({
        authorId: message.authorId,
        messages: [message],
      });
    }
  }

  return result;
}

export function getConversationPartner(
  conversation: Conversation,
  users: Record<string, ChatUser>,
  currentUserId: string
): ChatUser | null {
  if (conversation.kind !== "direct") return null;
  const partnerId = conversation.participantIds.find(
    (id) => id !== currentUserId
  );
  return partnerId ? users[partnerId] ?? null : null;
}

export function getConversationDisplayName(
  conversation: Conversation,
  users: Record<string, ChatUser>,
  currentUserId: string
): string {
  if (conversation.kind === "group") return conversation.name;
  const partner = getConversationPartner(conversation, users, currentUserId);
  return partner?.name ?? conversation.name;
}

export function getMessagePreview(message: Message | undefined): string {
  if (!message) return "No messages yet";
  if (message.type === "system") return message.content;
  if (message.type === "image") return "Sent a photo";
  if (message.type === "file") {
    const attachment = message.attachments?.[0];
    return attachment ? `File: ${attachment.name}` : "Sent a file";
  }
  return message.content;
}

export function buildReplyReference(
  message: Message,
  users: Record<string, ChatUser>
): import("./types").ReplyReference {
  const author = users[message.authorId];
  return {
    messageId: message.id,
    authorId: message.authorId,
    authorName: author?.name ?? "Unknown",
    preview: getMessagePreview(message).slice(0, 140),
    type: message.type,
  };
}
