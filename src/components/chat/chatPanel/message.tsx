import { File } from "lucide-react";
import styles from "./message.module.scss";
import type { Message } from "./chatPanel";

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => (
  <div className={`${styles.message} ${message.sender === "me" ? styles.messageSent : ""}`}>
    <img className={styles.messageAvatar} src={message.senderAvatar || "/placeholder.svg"} />

    <div className={styles.messageContent}>
      <div className={`${styles.messageSender} ${message.sender === "me" ? styles.senderRight : styles.senderLeft}`}>
        {message.senderUsername || (message.sender === "me" ? "我" : "匿名")}
      </div>

      {message.type === "text" && (
        <div className={`${styles.messageBubble} ${styles.textMessage}`}>
          {message.content}
        </div>
      )}
      {message.type === "image" && (
        <div className={`${styles.messageBubble} ${styles.imageMessage}`}>
          <img src={message.url || message.content} alt="聊天图片" />
        </div>
      )}
      {message.type === "file" && (
        <div className={`${styles.messageBubble} ${styles.fileMessage}`}>
          <File size={24} style={{ color: "#007aff" }} />
          <div className={styles.fileInfo}>
            <div className={styles.fileName}>
              {message.fileName || "未命名文件"}
            </div>
            <div className={styles.fileSize}>{message.fileSize || ""}</div>
          </div>
        </div>
      )}
    </div>
  </div>
);
