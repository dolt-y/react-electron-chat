import React from "react";
import { Phone, Video, MoreHorizontal } from "lucide-react";
import styles from "./chatHeader.module.scss";
import type { ChatSession } from "../../../shared/types/chat";

interface ChatHeaderProps {
    chat: ChatSession;
    onToggleDetails: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onToggleDetails }) => {
    let statusText = "离线";
    let statusClass = styles.offline;
    if (chat.online) {
        statusText = "在线";
        statusClass = styles.online;
    }
    return (
        <div className={styles.chatHeader}>
            <div className={styles.chatUserInfo}>
                <img
                    src={chat.chatAvatar || "/placeholder.svg"}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
                <div>
                    <h3>{chat.chatName || "未选择"}</h3>
                    <span className={[styles.status, statusClass].filter(Boolean).join(" ")}>
                        {statusText}
                    </span>
                </div>
            </div>

            <div className={styles.chatActions}>
                <button className={styles.actionButton}>
                    <Phone size={18} />
                </button>
                <button className={styles.actionButton}>
                    <Video size={18} />
                </button>
                <button className={styles.actionButton} onClick={onToggleDetails}>
                    <MoreHorizontal size={18} />
                </button>
            </div>
        </div>
    );
};
