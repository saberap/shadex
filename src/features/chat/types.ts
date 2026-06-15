export type UserStatus = "online" | "away" | "busy" | "offline";

export interface ChatUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatarColor: string;
  initials: string;
  status: UserStatus;
}

export type MessageType = "text" | "image" | "file" | "system";
export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  kind: "image" | "file";
  previewColor?: string;
}

export interface ReplyReference {
  messageId: string;
  authorId: string;
  authorName: string;
  preview: string;
  type: MessageType;
}

export interface ForwardReference {
  fromConversationId: string;
  fromConversationName: string;
  originalAuthorId: string;
  originalAuthorName: string;
}

export interface Message {
  id: string;
  conversationId: string;
  authorId: string;
  type: MessageType;
  content: string;
  attachments?: MessageAttachment[];
  replyTo?: ReplyReference;
  forwardedFrom?: ForwardReference;
  status: MessageStatus;
  edited?: boolean;
  createdAt: Date;
}

export type ConversationKind = "direct" | "group";

export interface Conversation {
  id: string;
  kind: ConversationKind;
  name: string;
  description?: string;
  participantIds: string[];
  groupId: string;
  pinned: boolean;
  muted: boolean;
  archived: boolean;
  unreadCount: number;
  lastMessageId?: string;
  lastReadAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationGroup {
  id: string;
  name: string;
  icon: GroupIconName;
  description?: string;
}

export type GroupIconName =
  | "favorites"
  | "teams"
  | "clients"
  | "projects"
  | "archived"
  | "direct";

export interface TypingState {
  conversationId: string;
  userId: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  type?: MessageType;
  replyTo?: ReplyReference;
  forwardedFrom?: ForwardReference;
  attachments?: MessageAttachment[];
}
