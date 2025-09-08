import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./contact.module.scss";
import instance from "../../../utils/request";
import { ResizableSidebar } from "./ResizableSidebar";

export interface Chat {
  chatId: number;
  chatType: string;
  chatName: string | null;
  chatAvatar: string | null;
  lastMessage: {
    content: string;
    type: string;
    createdAt: string;
  };
  unreadCount: number;
  online: boolean;
}

interface ContactProps {
  onSelectChat: (chat: Chat | null) => void;
  className?: string;
}

export const Contact: React.FC<ContactProps> = ({ onSelectChat }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatList, setChatList] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await instance.get("/chat/sessionList", { userId: 1 });
        if (res.success) {
          const data: Chat[] = res.result;
          setChatList(data);
          console.log("获取聊天列表成功", data);

          // ⚠️ 不默认选中第一个
          // setSelectedChat(data[0] || null);
          // onSelectChat(data[0] || null);
        } else {
          console.error("接口返回失败", res.message);
        }
      } catch (err) {
        console.error("获取聊天列表失败", err);
      }
    };
    fetchChats();
  }, []);

  const filteredChats = chatList.filter((chat) =>
    (chat.chatName || "群聊").toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <ResizableSidebar>
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
          {filteredChats.map((chat, index) => (
            <div
              key={`${chat.chatId}-${index}`}
              className={`${styles["contact-item"]} ${selectedChat?.chatId === chat.chatId ? styles["active"] : ""
                }`}
              onClick={() => {
                if (selectedChat?.chatId === chat.chatId) {
                  // 再次点击 → 清空
                  setSelectedChat(null);
                  onSelectChat(null);
                } else {
                  // 切换新会话
                  setSelectedChat(chat);
                  onSelectChat(chat);
                }
              }}
            >
              <div className={styles["contact-avatar"]}>
                <img
                  src={chat.chatAvatar || "/placeholder.svg"}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles["contact-info"]}>
                <div className={styles["contact-name"]}>
                  {chat.chatName || "群聊"}
                </div>
                <div className={styles["last-message"]}>
                  {chat.lastMessage.content}
                </div>
              </div>

              <div className={styles["contact-meta"]}>
                <div className={styles["message-time"]}>
                  {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {chat.unreadCount > 0 && (
                  <div className={styles["unread-badge"]}>
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResizableSidebar>
  );
};
