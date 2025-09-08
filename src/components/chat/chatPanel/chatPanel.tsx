import { useRef, useState, useEffect } from "react";
import {
    Send,
    Paperclip,
    Smile,
    Phone,
    Video,
    MoreHorizontal,
    ImageIcon,
    File,
} from "lucide-react";
import styles from "./ChatPanel.module.scss";
import { type Chat } from "../contact/contact";
import instance from "../../../utils/request";

export interface Message {
    id: number;
    sender: "me" | "other";
    type: "text" | "image" | "file";
    content: string;
    time: string;
    fileName?: string;
    fileSize?: string;
}

interface ChatPanelProps {
    selectedChat: Chat | null;
    className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ selectedChat, className }) => {
    const [messageInput, setMessageInput] = useState("");
    const [showDetails, setShowDetails] = useState(false);

    const PAGE_SIZE = 10;
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const scrollTimer = useRef<NodeJS.Timeout | null>(null);

    const messagesCache = useRef<Record<number, { messages: Message[]; scrollTop: number }>>({});
    const pageCache = useRef<Record<number, number>>({});
    const hasMoreCache = useRef<Record<number, boolean>>({});

    const fetchMessages = async (chatId: number, page: number) => {
        try {
            const res = await instance.post("/chat/messages", { chatId, page, pageSize: PAGE_SIZE });
            if (res.success) {
                const newMessages: Message[] = res.result;
                if (!messagesCache.current[chatId]) {
                    messagesCache.current[chatId] = { messages: [], scrollTop: 0 };
                    pageCache.current[chatId] = 1;
                    hasMoreCache.current[chatId] = true;
                }
                const currentCache = messagesCache.current[chatId];
                const container = messagesContainerRef.current;

                if (page === 1) {
                    currentCache.messages = newMessages.reverse();
                } else {
                    const prevScrollHeight = container?.scrollHeight || 0;
                    currentCache.messages = [...newMessages.reverse(), ...currentCache.messages];
                    setTimeout(() => {
                        if (container) container.scrollTop = container.scrollHeight - prevScrollHeight;
                    }, 50);
                }

                if (newMessages.length < PAGE_SIZE) hasMoreCache.current[chatId] = false;
                pageCache.current[chatId] = page;
            } else {
                console.error("获取消息失败", res.message);
            }
        } catch (err) {
            console.error("接口请求失败", err);
        }
    };

    useEffect(() => {
        if (!selectedChat) return;
        const chatId = selectedChat.chatId;

        if (!messagesCache.current[chatId]) {
            fetchMessages(chatId, 1).then(() => scrollToBottom());
        } else {
            setTimeout(() => {
                const container = messagesContainerRef.current;
                if (container && messagesCache.current[chatId]) {
                    container.scrollTop = messagesCache.current[chatId].scrollTop;
                }
            }, 50);
        }
    }, [selectedChat]);

    const scrollToBottom = () => {
        setTimeout(() => {
            const container = messagesContainerRef.current;
            const chatId = selectedChat?.chatId;
            if (container && chatId && messagesCache.current[chatId]) {
                container.scrollTop = container.scrollHeight;
                messagesCache.current[chatId].scrollTop = container.scrollTop;
            }
        }, 50);
    };

    const handleScroll = () => {
        if (!messagesContainerRef.current || !selectedChat) return;
        const container = messagesContainerRef.current;
        const chatId = selectedChat.chatId;
        if (messagesCache.current[chatId]) messagesCache.current[chatId].scrollTop = container.scrollTop;

        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(() => {
            if (container.scrollTop < 50 && hasMoreCache.current[chatId]) {
                const nextPage = (pageCache.current[chatId] || 1) + 1;
                fetchMessages(chatId, nextPage);
                pageCache.current[chatId] = nextPage;
            }
        }, 200);
    };

    const handleSwitchDetails = () => setShowDetails(!showDetails);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedChat) return;
        const newMessage: Message = {
            id: Date.now(),
            sender: "me",
            type: "text",
            content: messageInput,
            time: new Date().toISOString(),
        };
        setMessageInput("");
        const cache = messagesCache.current[selectedChat.chatId] || { messages: [], scrollTop: 0 };
        cache.messages = [...cache.messages, newMessage];
        messagesCache.current[selectedChat.chatId] = cache;
        scrollToBottom();
    };

    const renderMessages = () => {
        if (!selectedChat) return null;
        const cache = messagesCache.current[selectedChat.chatId];
        if (!cache) return null;

        return cache.messages.map((message) => {
            const isMe = message.sender === "me";
            return (
                <div
                    key={message.id}
                    className={`${styles.message} ${isMe ? styles.messageSent : ""}`}
                >
                    {/* 头像 */}
                    <img
                        className={styles.messageAvatar}
                        src={isMe ? "/my-avatar.jpg" : selectedChat.chatAvatar || "/placeholder.svg"}
                        alt="头像"
                    />
                    {/* 消息内容 */}
                    <div className={styles.messageContent}>
                        {message.type === "text" && (
                            <div className={`${styles.messageBubble} ${styles.textMessage}`}>
                                {message.content}
                            </div>
                        )}
                        {message.type === "image" && (
                            <div className={`${styles.messageBubble} ${styles.imageMessage}`}>
                                <img src={message.content} alt="聊天图片" />
                            </div>
                        )}
                        {message.type === "file" && (
                            <div className={`${styles.messageBubble} ${styles.fileMessage}`}>
                                <File size={24} style={{ color: "#007aff" }} />
                                <div className={styles.fileInfo}>
                                    <div className={styles.fileName}>{message.fileName}</div>
                                    <div className={styles.fileSize}>{message.fileSize}</div>
                                </div>
                            </div>
                        )}
                        <div className={styles.messageTime}>
                            {new Date(message.time).toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            );
        });
    };


    return (
        <div className={`${styles.chatPanel} ${className || ""}`}>
            <div className={styles.chatHeader}>
                <div className={styles.chatUserInfo}>
                    <img src={selectedChat?.chatAvatar || "/placeholder.svg"} style={{ width: 40, height: 40, borderRadius: "50%" }} />
                    <div>
                        <h3>{selectedChat?.chatName || "未选择"}</h3>
                        <span className={`${styles.status} ${selectedChat?.online ? styles.online : styles.offline}`}>
                            {selectedChat?.online ? "在线" : "离线"}
                        </span>
                    </div>
                </div>
                <div className={styles.chatActions}>
                    <button className={styles.actionButton}><Phone size={18} /></button>
                    <button className={styles.actionButton}><Video size={18} /></button>
                    <button className={styles.actionButton} onClick={handleSwitchDetails}><MoreHorizontal size={18} /></button>
                </div>
            </div>

            <div className={styles.messagesArea} ref={messagesContainerRef} onScroll={handleScroll}>
                <div className={styles.messagesContainer}>{renderMessages()}</div>
            </div>

            <div className={styles.messageInputArea}>
                <div className={styles.inputToolbar}>
                    <button className={styles.toolbarButton}><Smile size={18} /></button>
                    <button className={styles.toolbarButton}><Paperclip size={18} /></button>
                    <button className={styles.toolbarButton}><ImageIcon size={18} /></button>
                </div>
                <div className={styles.inputContainer}>
                    <textarea
                        className={styles.messageInput}
                        placeholder="输入消息..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        rows={1}
                    />
                    <button className={styles.sendButton} onClick={handleSendMessage}><Send size={18} /></button>
                </div>
            </div>

            {showDetails && selectedChat && (
                <div className={styles.detailsPanel}>
                    <div className={styles.userProfile}>
                        <img className={styles.profileAvatar} src={selectedChat.chatAvatar || "/placeholder.svg"} />
                        <h3>{selectedChat.chatName}</h3>
                        <p className={styles.userStatus}>{selectedChat.online ? "在线" : "离线"}</p>
                    </div>
                    <div className={styles.profileActions}>
                        <button className={styles.profileAction}><Phone size={16} />语音通话</button>
                        <button className={styles.profileAction}><Video size={16} />视频通话</button>
                    </div>
                </div>
            )}
        </div>
    );
};
