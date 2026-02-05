import { useEffect, useRef, useState, useCallback, type JSX } from "react";
import { Sidebar } from "../../components/chat/sidebar/sidebar";
import { Contact } from "../../components/chat/contact/contact";
import { FriendList } from "../../components/friend/list";
import { ChatPanel } from "../../components/chat/chatPanel/chatPanel";
import styles from "./ChatPage.module.scss";
import { useChatSocket } from "../../hook/useChatSocket";
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "../../utils/auth";
import type { AuthUser } from "../../interface/auth";
import instance from "../../utils/request";
import service from "../../service";
import type { ChatSession, SocketChatMessage } from "../../shared/types/chat";
export default function ChatPage(): JSX.Element {
  const navigate = useNavigate();
  const [currentUser] = useState<AuthUser | null>(() => getAuthUser());
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [chatList, setChatList] = useState<ChatSession[]>([]);
  const handleIncomingMessage = useCallback((msg: SocketChatMessage) => {
    setChatList((prev) =>
      prev.map((chat) =>
        chat.chatId === msg.chatId
          ? {
              ...chat,
              lastMessage: {
                content: msg.content,
                type: msg.type,
                createdAt: msg.createdAt,
              },
              unreadCount:
                selectedChat?.chatId === msg.chatId ? 0 : (chat.unreadCount || 0) + 1,
            }
          : chat
      )
    );
  }, [selectedChat]);
  const { joinRoom, sendMessage, socket } = useChatSocket();
  const [activeTab, setActiveTab] = useState<string>("messages");
  const lastChatRef = useRef<ChatSession | null>(null);
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser?.id) {
      setChatList([]);
      return;
    }
    const fetchChats = async () => {
      try {
        const res = await instance.get<ChatSession[]>(service.sessionList, { userId: currentUser.id });
        if (res.success) {
          setChatList(res.result || []);
        }
      } catch (err) {
        console.error("获取会话列表失败", err);
      }
    };
    fetchChats();
  }, [currentUser]);

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === "friends") {
      // 切换到好友列表时,保存当前聊天状态
      lastChatRef.current = selectedChat;
      console.log("保存聊天状态:", lastChatRef.current);
      setSelectedChat(null);
    } else {
      // 切换回消息列表时,恢复上一次的聊天状态
      setSelectedChat(lastChatRef.current);
    }
  };
  const handleSendMessage = (chatId: number, content: string) => {
    if (!content.trim()) return;
    sendMessage(chatId, content.trim(), "text");
    setChatList((prev) =>
      prev.map((chat) =>
        chat.chatId === chatId
          ? {
              ...chat,
              lastMessage: {
                content: content.trim(),
                type: "text",
                createdAt: new Date().toISOString(),
              },
              unreadCount: 0,
            }
          : chat
      )
    );
  }
  useEffect(() => {
    console.log("当前房间ID:", selectedChat);
    if (selectedChat) {
      joinRoom(selectedChat.chatId);
    }
  }, [selectedChat, joinRoom]);
  return (
    <div className={styles.chatContainer}>
      <Sidebar
        className={styles.sidebar}
        activeTab={activeTab}
        onChangeTab={handleChangeTab}
      />

      {activeTab === "messages" && (
        <>
          <Contact
            className={styles.contactsPanel}
            onSelectChat={setSelectedChat}
            selectedChat={selectedChat}
            currentUserId={currentUser?.id}
            chats={chatList}
            onChatsChange={setChatList}
          />
          <ChatPanel
            key={selectedChat?.chatId ?? 'no-chat'}
            className={styles.chatPanel}
            selectedChat={selectedChat}
            onSendMessage={handleSendMessage}
            currentUserId={currentUser?.id}
            socket={socket}
          />

        </>
      )}
      {activeTab === "friends" && (
        <FriendList
          currentUserId={currentUser?.id}
          listClassName={styles.contactsPanel}
          detailClassName={styles.chatPanel}
        />
      )}
    </div>
  );
}
