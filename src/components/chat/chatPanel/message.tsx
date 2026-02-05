import { File } from "lucide-react";
import styles from "./message.module.scss";
import type { ChatMessage } from "../../../shared/types/chat";

interface MessageItemProps {
  message: ChatMessage;
  currentUserId?: number;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, currentUserId }) => {
  const isMe = currentUserId !== undefined && message.senderId === currentUserId;
  const messageClassName = [styles.message, isMe && styles.messageSent].filter(Boolean).join(" ");
  const senderClassName = [
    styles.messageSender,
    isMe && styles.senderRight,
    !isMe && styles.senderLeft,
  ]
    .filter(Boolean)
    .join(" ");
  const bubbleClassName = [styles.messageBubble, isMe && styles.messageSent].filter(Boolean).join(" ");
  const fileBubbleClassName = [
    styles.messageBubble,
    isMe && styles.messageSent,
    styles.fileMessage,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={messageClassName}>
      <img className={styles.messageAvatar} src={message.senderAvatar || "/placeholder.svg"} alt="头像" />
      <div className={styles.messageContent}>
        <div className={senderClassName}>
          {!isMe && message.senderUsername}
        </div>

        {message.type === "text" && (
          <div className={bubbleClassName}>
            {message.content}
          </div>
        )}
        {message.type === "image" && (
          <div className={bubbleClassName}>
            <img src={message.url || message.content} alt="聊天图片" />
          </div>
        )}
        {["file", "video", "audio"].includes(message.type) && (
          <div className={fileBubbleClassName}>
            <File size={24} style={{ color: "#007aff" }} />
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>{message.fileName || "文件消息"}</div>
              <div className={styles.fileSize}>{message.fileSize || ""}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
