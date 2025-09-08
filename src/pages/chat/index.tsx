import { useState } from "react";
import { Sidebar } from "../../components/chat/sidebar/sidebar";
import { Contact, type Chat } from "../../components/chat/contact/contact";
import { ChatPanel } from "../../components/chat/chatPanel/chatPanel";
import styles from "./chatPage.module.scss";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleSelectChat = (chat: Chat | null) => {
    setSelectedChat(chat);
  };

  return (
    <div className={styles.chatContainer}>
      <Sidebar className={styles.sidebar} />
      <Contact className={styles.contactsPanel} onSelectChat={handleSelectChat} />
      <ChatPanel className={styles.chatPanel} selectedChat={selectedChat} />
    </div>
  );
}
