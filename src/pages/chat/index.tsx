import type React from "react"

import { useState, type JSX } from "react"
import './index.scss'

interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

interface Message {
  id: string
  content: string
  timestamp: string
  sent: boolean
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "张三",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    lastMessage: "好的，期待见面！",
    timestamp: "10:04",
    unread: 0,
    online: true,
  },
  {
    id: "2",
    name: "李四",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    lastMessage: "今天天气不错呢，要不要出去走走？",
    timestamp: "09:30",
    unread: 3,
    online: true,
  },
  {
    id: "3",
    name: "王五",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    lastMessage: "文件已发送，请查收",
    timestamp: "昨天",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "小明",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face",
    lastMessage: "明天的会议准备好了吗？需要我提前准备什么资料？",
    timestamp: "前天",
    unread: 0,
    online: false,
  },
  {
    id: "6",
    name: "小红",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    lastMessage: "周末一起看电影吧！",
    timestamp: "前天",
    unread: 2,
    online: true,
  },
]

const messages: Message[] = [
  { id: "1", content: "你好！", timestamp: "10:00", sent: true },
  { id: "2", content: "你好！你最近怎么样？", timestamp: "10:01", sent: false },
  { id: "3", content: "我很好，谢谢！工作比较忙，你呢？", timestamp: "10:02", sent: true },
  { id: "4", content: "我也还不错，我们下周见面吗？有个项目想和你聊聊", timestamp: "10:03", sent: false },
  { id: "5", content: "好的，期待见面！我们约个时间吧", timestamp: "10:04", sent: true },
  { id: "6", content: "那就周三下午2点，老地方见面？", timestamp: "10:05", sent: false },
  { id: "7", content: "没问题，到时候见！", timestamp: "10:06", sent: true },
]

export default function Chat():JSX.Element {
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      console.log("发送消息:", inputMessage)
      setInputMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="wechat-container">
      {/* 左侧用户信息面板 */}
      <div className="sidebar-left">
        <div className="user-avatar">
          <img src="/placeholder.svg?height=40&width=40&text=我" alt="我的头像" />
        </div>

        <div className="nav-buttons">
          <button className="nav-btn active" title="聊天">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </button>
          <button className="nav-btn" title="通讯录">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 17.1 6H16c-.8 0-1.54.37-2.03.97L12 9.5 10.03 6.97C9.54 6.37 8.8 6 8 6H6.9c-1.3 0-2.4.84-2.86 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z" />
            </svg>
          </button>
          <button className="nav-btn" title="收藏">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        </div>

        <div className="nav-bottom">
          <button className="nav-btn" title="设置">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 中间会话列表 */}
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>微信</h2>
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input type="text" placeholder="搜索" />
          </div>
        </div>

        <div className="contacts-list">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact.id === contact.id ? "active" : ""}`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="contact-avatar">
                <img src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                {contact.online && <div className="online-indicator"></div>}
              </div>

              <div className="contact-info">
                <div className="contact-header">
                  <h3 className="contact-name">{contact.name}</h3>
                  <span className="contact-time">{contact.timestamp}</span>
                </div>
                <div className="contact-footer">
                  <p className="last-message">{contact.lastMessage}</p>
                  {contact.unread > 0 && <span className="unread-badge">{contact.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧聊天窗口 */}
      <div className="chat-window">
        {/* 聊天头部 */}
        <div className="chat-header">
          <div className="chat-user-info">
            <img
              src={selectedContact.avatar || "/placeholder.svg"}
              alt={selectedContact.name}
              className="chat-avatar"
            />
            <div className="chat-user-details">
              <h2 className="chat-user-name">{selectedContact.name}</h2>
              <p className="chat-user-status">{selectedContact.online ? "在线" : "离线"}</p>
            </div>
          </div>

          <div className="chat-actions">
            <button className="action-btn" title="语音通话">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
              </svg>
            </button>
            <button className="action-btn" title="视频通话">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
              </svg>
            </button>
            <button className="action-btn" title="更多">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 消息区域 */}
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sent ? "sent" : "received"}`}>
                {!message.sent && (
                  <img
                    src={selectedContact.avatar || "/placeholder.svg"}
                    alt={selectedContact.name}
                    className="message-avatar"
                  />
                )}
                <div className="message-bubble">
                  <div className="message-content">{message.content}</div>
                </div>
                <div className="message-time">{message.timestamp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="input-area">
          <div className="input-toolbar">
            <button className="toolbar-btn" title="表情">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M16.5,9C17.33,9 18,8.33 18,7.5C18,6.67 17.33,6 16.5,6C15.67,6 15,6.67 15,7.5C15,8.33 15.67,9 16.5,9M7.5,9C8.33,9 9,8.33 9,7.5C9,6.67 8.33,6 7.5,6C6.67,6 6,6.67 6,7.5C6,8.33 6.67,9 7.5,9M12,17.5C14.33,17.5 16.31,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5Z" />
              </svg>
            </button>
            <button className="toolbar-btn" title="文件">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z" />
              </svg>
            </button>
          </div>

          <div className="input-box">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息..."
              rows={1}
            />
            <button className="send-btn" onClick={handleSendMessage} disabled={!inputMessage.trim()}>
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
