import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import styles from './contact.module.scss';
import instance from "../../../utils/request";

interface LastMessage {
    content: string;
    type: string;
    createdAt: string;
}

interface Chat {
    chatId: number;
    chatType: string;
    chatName: string | null;
    chatAvatar: string | null;
    lastMessage: LastMessage;
    unreadCount: number;
}

export const Contact = () => {
    const [searchInput, setSearchInput] = useState("");
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [chatList, setChatList] = useState<Chat[]>([]);

    // 请求接口
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await instance.get('/chat/sessionList', { userId: 1 });
                if (res.success) {
                    const data: Chat[] = res.result; // 注意接口是 result
                    setChatList(data);
                    setSelectedChat(data[0] || null); // 默认选中第一条
                } else {
                    console.error('接口返回失败', res.message);
                }
            } catch (err) {
                console.error('获取聊天列表失败', err);
            }
        };
        fetchChats();
    }, []);

    // 搜索过滤
    const filteredChats = chatList.filter(chat =>
        (chat.chatName || '群聊').toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className={styles["contacts-panel"]}>
            <div className={styles["contacts-header"]}>
                <h2>聊天</h2>
                <div className={styles["search-box"]}>
                    <Search className={styles["search-icon"]} size={16} />
                    <input
                        className={styles["search-input"]}
                        placeholder="搜索联系人"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles["contacts-list"]}>
                {filteredChats.map(chat => (
                    <div
                        key={chat.chatId}
                        className={`${styles["contact-item"]} ${selectedChat?.chatId === chat.chatId ? styles["active"] : ""}`}
                        onClick={() => setSelectedChat(chat)}
                    >
                        <div className={styles["contact-avatar"]}>
                            <img
                                src={chat.chatAvatar || "/placeholder.svg"}
                                // alt={chat.chatName || "群聊"}
                                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                            />
                            {/* 如果需要在线状态，可以在这里增加 */}
                        </div>

                        <div className={styles["contact-info"]}>
                            <div className={styles["contact-name"]}>{chat.chatName || "群聊"}</div>
                            <div className={styles["last-message"]}>{chat.lastMessage.content}</div>
                        </div>

                        <div className={styles["contact-meta"]}>
                            <div className={styles["message-time"]}>
                                {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {chat.unreadCount > 0 && (
                                <div className={styles["unread-badge"]}>{chat.unreadCount}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
