import { File } from "lucide-react";
import styles from "./message.module.scss";
import type { Message } from "./chatPanel";

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isMe = message.sender === "me";
  return (
    <div className={`${styles.message} ${isMe ? styles.messageSent : ""}`}>
      <img className={styles.messageAvatar} src={message.senderAvatar || "https://q2.qlogo.cn/headimg_dl?dst_uin=2233296011&spec=100&v=0.5979924341645101"} />
      <div className={styles.messageContent}>
        <div className={`${styles.messageSender} ${isMe ? styles.senderRight : styles.senderLeft}`}>
          {message.senderUsername}
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
        {message.type === "file" && (
          <div className={`${styles.messageBubble} ${isMe ? styles.messageSent : ""} ${styles.fileMessage}`}>
            <File size={24} style={{ color: "#007aff" }} />
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>{message.fileName || "未命名文件"}</div>
              <div className={styles.fileSize}>{message.fileSize || ""}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

