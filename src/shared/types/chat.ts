export type ChatMessageType = "text" | "image" | "file" | "video" | "audio";

export interface ChatSession {
  chatId: number;
  chatType: string;
  chatName: string | null;
  chatAvatar: string | null;
  lastMessage?: {
    content: string;
    type: ChatMessageType;
    createdAt: string;
  } | null;
  unreadCount: number;
  online?: boolean;
}

export interface ChatMessage {
  messageId: number;
  senderId: number;
  type: ChatMessageType;
  isRead: boolean;
  content: string;
  senderAvatar?: string;
  senderUsername?: string;
  createdAt: string;
  url?: string;
  fileName?: string;
  fileSize?: string;
}

export interface SocketChatMessage {
  chatId: number;
  senderId: number;
  content: string;
  type: ChatMessageType;
  createdAt: string;
  senderUsername: string;
}
