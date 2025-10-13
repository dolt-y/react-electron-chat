import { Search, Plus } from "lucide-react";
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
  selectedChat: Chat | null;
  className?: string;
}

export const Contact: React.FC <ContactProps> = ({ 
  onSelectChat, 
  selectedChat,
  className 
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [chatList, setChatList] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await instance.get("/chat/sessionList", { userId: 1 });
        if (res.success) {
          const data: Chat[] = res.result;
          setChatList(data);
          console.log("获取聊天列表成功", data);
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
          <div className={styles["header-actions"]}>
            <div className={styles["search-box"]}>
              <Search className={styles["search-icon"]} size={16} />
              <input
                className={styles["search-input"]}
                placeholder="搜索联系人"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button
              className={styles["add-button"]}
              title="新建会话"
              onClick={() => console.log("新建会话")}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className={styles["contacts-list"]}>
          {filteredChats.map((chat, index) => (
            <div
              key={`${chat.chatId}-${index}`}
              className={`${styles["contact-item"]} ${
                selectedChat?.chatId === chat.chatId ? styles["active"] : ""
              }`}
              onClick={() => {
                if (selectedChat?.chatId === chat.chatId) {
                  onSelectChat(null);
                } else {
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
                  {new Date(chat.lastMessage.createdAt).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
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