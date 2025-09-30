import { useRef, useState } from "react";
import { Sidebar } from "../../components/chat/sidebar/sidebar";
import { Contact, type Chat } from "../../components/chat/contact/contact";
import { FriendList } from "../../components/frilend/list";
import { ChatPanel } from "../../components/chat/chatPanel/chatPanel";
import styles from "./chatPage.module.scss";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [activeTab, setActiveTab] = useState<"messages" | "friends">("messages");
  const lastChatRef = useRef<Chat | null>(null);
  const handleChangeTab = (tab: "messages" | "friends") => {
    setActiveTab(tab);
    if (tab === "friends") {
      // 切换到好友列表时,保存当前聊天状态
      lastChatRef.current = selectedChat;
      setSelectedChat(null);
    } else {
      // 切换回消息列表时,恢复上一次的聊天状态
      setSelectedChat(lastChatRef.current);
    }
  };

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
          />
          <ChatPanel
            className={styles.chatPanel}
            selectedChat={selectedChat}
          />
        </>
      )}

      {activeTab === "friends" && <FriendList />}
    </div>
  );
}