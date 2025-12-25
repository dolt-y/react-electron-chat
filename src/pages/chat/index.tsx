import { useEffect, useRef, useState, type JSX } from "react";
import { Sidebar } from "../../components/chat/sidebar/sidebar";
import { Contact, type Chat } from "../../components/chat/contact/contact";
import { FriendList } from "../../components/friend/list";
import { ChatPanel } from "../../components/chat/chatPanel/chatPanel";
import styles from "./ChatPage.module.scss";
import { useChatSocket } from "../../hook/useChatSocket"
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "../../utils/auth";
import type { AuthUser } from "../../interface/auth";
export default function ChatPage(): JSX.Element {
  const navigate = useNavigate();
  const [currentUser] = useState<AuthUser | null>(() => getAuthUser());
  const { joinRoom, sendMessage, socket } = useChatSocket();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [activeTab, setActiveTab] = useState<string>("messages");
  const lastChatRef = useRef<Chat | null>(null);
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

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
      {activeTab === "friends" && <FriendList />}
    </div>
  );
}
