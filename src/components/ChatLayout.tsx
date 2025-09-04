import React from 'react';
import './ChatLayout.scss';
import ContactList from './ContactList';
import ChatWindow from './ChatWindow';
import ContactInfo from './ContactInfo';

const ChatLayout: React.FC = () => {
  return (
    <div className="chat-layout">
      <div className="chat-layout__left">
        <ContactList />
      </div>
      <div className="chat-layout__center">
        <ChatWindow />
      </div>
      <div className="chat-layout__right">
        <ContactInfo />
      </div>
    </div>
  );
};

export default ChatLayout;
