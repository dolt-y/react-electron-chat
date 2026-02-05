import { File } from "lucide-react";
import styles from "./message.module.scss";
import type { ChatMessage } from "../../../shared/types/chat";

interface MessageItemProps {
  message: ChatMessage;
  currentUserId?: number;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, currentUserId }) => {
  const isMe = currentUserId !== undefined && message.senderId === currentUserId;
  return (
    <div className={`${styles.message} ${isMe ? styles.messageSent : ""}`}>
      <img className={styles.messageAvatar} src={message.senderAvatar || "/placeholder.svg"} alt="头像" />
      <div className={styles.messageContent}>
        <div className={`${styles.messageSender} ${isMe ? styles.senderRight : styles.senderLeft}`}>
          {isMe ? "" : message.senderUsername}
        </div>

        {message.type === "text" && (
          <div className={`${styles.messageBubble} ${isMe ? styles.messageSent : ""}`}>
            {message.content}
          </div>
        )}
        {message.type === "image" && (
          <div className={`${styles.messageBubble} ${isMe ? styles.messageSent : ""}`}>
            <img src={message.url || message.content} alt="聊天图片" />
          </div>
        )}
        {["file", "video", "audio"].includes(message.type) && (
          <div className={`${styles.messageBubble} ${isMe ? styles.messageSent : ""} ${styles.fileMessage}`}>
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
