import { Search, Plus } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import styles from "./contact.module.scss";
import instance from "../../../utils/request";
import { ResizableSidebar } from "./ResizableSidebar";
import { formatMessageTime } from "../../../utils/chat/time";
import service from "../../../service";
import type { ChatSession } from "../../../shared/types/chat";

interface ContactProps {
  onSelectChat: (chat: ChatSession | null) => void;
  selectedChat: ChatSession | null;
  className?: string;
  currentUserId?: number;
  chats: ChatSession[];
  onChatsChange: Dispatch<SetStateAction<ChatSession[]>>;
}

export const Contact: React.FC<ContactProps> = ({
  onSelectChat,
  selectedChat,
  className,
  currentUserId,
  chats,
  onChatsChange,
}) => {
  const [searchInput, setSearchInput] = useState("");

  const markChatAsRead = async (chat: ChatSession) => {
    try {
      await instance.post<null>(service.isRead, { chatId: chat.chatId });
      onChatsChange((prev) =>
        prev.map((item) => {
          if (item.chatId !== chat.chatId) return item;
          return { ...item, unreadCount: 0 };
        })
      );
      if (selectedChat?.chatId === chat.chatId) {
        onSelectChat({ ...chat, unreadCount: 0 });
      }
    } catch (err) {
      console.error("标记会话已读失败", err);
    }
  };

  const handleChatClick = (chat: ChatSession) => {
    if (selectedChat?.chatId === chat.chatId) {
      onSelectChat(null);
      return;
    }

    onSelectChat(chat);

    if (chat.unreadCount > 0) {
      markChatAsRead(chat);
    }
  };

  const filteredChats = chats.filter((chat) =>
    (chat.chatName || "群聊").toLowerCase().includes(searchInput.toLowerCase())
  );

  if (!currentUserId) {
    return (
      <ResizableSidebar className={className}>
        <div className={styles["contacts-panel"]}>
          <div className={styles["contacts-header"]}>
            <div className={styles["header-actions"]}>
              <div className={styles["search-box"]}>
                <Search className={styles["search-icon"]} size={16} />
                <input
                  className={styles["search-input"]}
                  placeholder="请先登录"
                  value=""
                  disabled
                />
              </div>
            </div>
          </div>
          <div className={styles["contacts-list"]}>
            <div className={styles["contact-item"]}>
              <div className={styles["contact-info"]}>登录后可获取会话列表</div>
            </div>
          </div>
        </div>
      </ResizableSidebar>
    );
  }

  return (
    <ResizableSidebar className={className}>
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
          {filteredChats.map((chat, index) => {
            const isActive = selectedChat?.chatId === chat.chatId;
            const itemClassName = [styles["contact-item"], isActive && styles["active"]]
              .filter(Boolean)
              .join(" ");
            let lastMessageTime = "";
            if (chat.lastMessage) {
              lastMessageTime = formatMessageTime(chat.lastMessage.createdAt, { withSeconds: false });
            }

            return (
              <div
                key={`${chat.chatId}-${index}`}
                className={itemClassName}
                onClick={() => handleChatClick(chat)}
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
                    {chat.lastMessage?.content || "暂无消息"}
                  </div>
                </div>

                <div className={styles["contact-meta"]}>
                  <div className={styles["message-time"]}>{lastMessageTime}</div>
                  {chat.unreadCount > 0 && (
                    <div className={styles["unread-badge"]}>
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ResizableSidebar>
  );
};
