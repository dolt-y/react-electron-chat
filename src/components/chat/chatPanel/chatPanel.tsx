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
  senderAvatar?: string;
  createdAt: string;
  url?: string;
  fileName?: string;
  fileSize?: string;
}

interface ChatPanelProps {
  selectedChat: Chat | null;
  className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  selectedChat,
  className,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const PAGE_SIZE = 10;
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const loadingRef = useRef(false);

  // 缓存：每个会话的消息列表 & scrollTop
  const messagesCache = useRef<
    Record<number, { messages: Message[]; scrollTop: number }>
  >({});
  const pageCache = useRef<Record<number, number>>({});
  const hasMoreCache = useRef<Record<number, boolean>>({});

  // -------------------------------
  // 获取消息
  // -------------------------------
  const fetchMessages = async (chatId: number, page: number) => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;

    // 防止重复请求
    if (loadingRef.current || hasMoreCache.current[chatId] === false) return;

    loadingRef.current = true;

    try {
      const res = await instance.post("/chat/messages", {
        chatId,
        page,
        pageSize: PAGE_SIZE,
      });

      if (res.success) {
        const newMessages: Message[] = res.result;

        // 初始化缓存
        if (!messagesCache.current[chatId]) {
          messagesCache.current[chatId] = { messages: [], scrollTop: 0 };
          pageCache.current[chatId] = 1;
          hasMoreCache.current[chatId] = true;
        }

        const currentCache = messagesCache.current[chatId];
        const prevScrollHeight = container.scrollHeight;

        if (page === 1) {
          // 首次加载
          currentCache.messages = newMessages;
          setTimeout(() => scrollToBottom(), 50);
        } else {
          // 上拉加载历史消息，保持 scrollTop
          currentCache.messages = [...newMessages, ...currentCache.messages];
          setTimeout(() => {
            container.scrollTop = container.scrollHeight - prevScrollHeight;
          }, 50);
        }

        pageCache.current[chatId] = page;
        if (newMessages.length < PAGE_SIZE) hasMoreCache.current[chatId] = false;
      } else {
        console.error("获取消息失败", res.message);
      }
    } catch (err) {
      console.error("接口请求失败", err);
    } finally {
      loadingRef.current = false;
    }
  };

  // -------------------------------
  // 监听会话切换
  // -------------------------------
  useEffect(() => {
    if (!selectedChat) return;
    const chatId = selectedChat.chatId;

    // 首次点击会话，初始化缓存
    if (!messagesCache.current[chatId]) {
      messagesCache.current[chatId] = { messages: [], scrollTop: 0 };
      pageCache.current[chatId] = 1;
      hasMoreCache.current[chatId] = true;

      fetchMessages(chatId, 1);
    } else {
      // 切换已有会话，恢复 scrollTop
      setTimeout(() => {
        const container = messagesContainerRef.current;
        if (container) container.scrollTop = messagesCache.current[chatId].scrollTop;
      }, 50);
    }
  }, [selectedChat]);

  // -------------------------------
  // 滚动到底部
  // -------------------------------
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

  // -------------------------------
  // 上拉加载历史消息
  // -------------------------------
  const handleScroll = () => {
    if (!messagesContainerRef.current || !selectedChat) return;
    const container = messagesContainerRef.current;
    const chatId = selectedChat.chatId;

    if (messagesCache.current[chatId])
      messagesCache.current[chatId].scrollTop = container.scrollTop;

    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      if (
        container.scrollTop < 50 &&
        !loadingRef.current &&
        hasMoreCache.current[chatId]
      ) {
        const nextPage = (pageCache.current[chatId] || 1) + 1;
        fetchMessages(chatId, nextPage);
      }
    }, 200);
  };

  // -------------------------------
  // 切换详情面板
  // -------------------------------
  const handleSwitchDetails = () => setShowDetails(!showDetails);

  // -------------------------------
  // 发送消息
  // -------------------------------
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "me",
      type: "text",
      content: messageInput,
      createdAt: new Date().toISOString(),
    };
    setMessageInput("");

    const cache =
      messagesCache.current[selectedChat.chatId] || { messages: [], scrollTop: 0 };
    cache.messages = [...cache.messages, newMessage];
    messagesCache.current[selectedChat.chatId] = cache;

    scrollToBottom();
  };

  // -------------------------------
  // 渲染消息
  // -------------------------------
  const renderMessages = () => {
    if (!selectedChat) return null;
    const cache = messagesCache.current[selectedChat.chatId];
    if (!cache) return null;

    return cache.messages.map((message) => (
      <div
        key={message.id}
        className={`${styles.message} ${
          message.sender === "me" ? styles.messageSent : ""
        }`}
      >
        {message.sender === "other" && (
          <img
            className={styles.messageAvatar}
            src={message.senderAvatar || "/placeholder.svg"}
          />
        )}
        <div className={styles.messageContent}>
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
          <div className={styles.messageTime}>
            {new Date(message.createdAt).toLocaleTimeString()}
          </div>
        </div>
      </div>
    ));
  };

  // -------------------------------
  // 空状态 UI
  // -------------------------------
  if (!selectedChat) {
    return (
      <div className={`${styles.chatPanel} ${className || ""}`}>
        <div className={styles.emptyState}></div>
      </div>
    );
  }

  return (
    <div className={`${styles.chatPanel} ${className || ""}`}>
      <div className={styles.chatHeader}>
        <div className={styles.chatUserInfo}>
          <img
            src={selectedChat.chatAvatar || "/placeholder.svg"}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <div>
            <h3>{selectedChat.chatName || "未选择"}</h3>
            <span
              className={`${styles.status} ${
                selectedChat.online ? styles.online : styles.offline
              }`}
            >
              {selectedChat.online ? "在线" : "离线"}
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
          <button className={styles.actionButton} onClick={handleSwitchDetails}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <div
        className={styles.messagesArea}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        <div className={styles.messagesContainer}>{renderMessages()}</div>
      </div>

      <div className={styles.messageInputArea}>
        <div className={styles.inputToolbar}>
          <button className={styles.toolbarButton}>
            <Smile size={18} />
          </button>
          <button className={styles.toolbarButton}>
            <Paperclip size={18} />
          </button>
          <button className={styles.toolbarButton}>
            <ImageIcon size={18} />
          </button>
        </div>
        <div className={styles.inputContainer}>
          <textarea
            className={styles.messageInput}
            placeholder="输入消息..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSendMessage())
            }
            rows={1}
          />
          <button className={styles.sendButton} onClick={handleSendMessage}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {showDetails && selectedChat && (
        <div className={styles.detailsPanel}>
          <div className={styles.userProfile}>
            <img
              className={styles.profileAvatar}
              src={selectedChat.chatAvatar || "/placeholder.svg"}
            />
            <h3>{selectedChat.chatName}</h3>
            <p className={styles.userStatus}>
              {selectedChat.online ? "在线" : "离线"}
            </p>
          </div>
          <div className={styles.profileActions}>
            <button className={styles.profileAction}>
              <Phone size={16} />
              语音通话
            </button>
            <button className={styles.profileAction}>
              <Video size={16} />
              视频通话
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
