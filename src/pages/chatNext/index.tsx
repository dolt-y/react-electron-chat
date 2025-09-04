import { useState, type JSX } from "react"
import { Search, Send, Paperclip, Smile, Phone, Video, MoreHorizontal, ImageIcon, File, User, Users, Settings, LogOut } from "lucide-react"
import "./chat-interface.scss"
import { contacts, messages } from "./mock"
import instance from '../../utils/request';
export default function ChatInterface(): JSX.Element {
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [showDetails, setShowDetails] = useState(false)

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchInput.toLowerCase()))

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("发送消息:", messageInput)
      setMessageInput("")
    }
  }
  const handleSwitchDetails = () => {
    setShowDetails(!showDetails)
  }
  // cosnt logout = () => {
  //  instance
  // }
  return (
    <div className="chat-interface">
      {/* 侧边导航栏 */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            <img src="https://q2.qlogo.cn/headimg_dl?dst_uin=2233296011&spec=100&v=0.5979924341645101" alt="用户头像" />
          </div>
        </div>

        <div className="sidebar-menu">
          <button className="menu-item active">
            <User size={20} />
          </button>
          <button className="menu-item">
            <Users size={20} />
          </button>
          <button className="menu-item">
            <Settings size={20} />
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="menu-item">
            <LogOut size={20} />
          </button>
        </div>
      </div>
      {/* 左侧联系人列表 */}
      <div className="contacts-panel">
        <div className="contacts-header">
          <h2>聊天</h2>
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              className="search-input"
              placeholder="搜索联系人"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <div className="contacts-list">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact.id === contact.id ? "active" : ""}`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="contact-avatar">
                <img
                  src={contact.avatar || "/placeholder.svg"}
                  alt={contact.name}
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                {contact.online && <div className="online-indicator" />}
              </div>

              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="last-message">{contact.lastMessage}</div>
              </div>

              <div className="contact-meta">
                <div className="message-time">{contact.time}</div>
                {contact.unread > 0 && <div className="unread-badge">{contact.unread}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 中间聊天区域 */}
      <div className="chat-panel">
        <div className="chat-header">
          <div className="chat-user-info">
            <img
              src={selectedContact.avatar || "/placeholder.svg"}
              alt={selectedContact.name}
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            />
            <div>
              <h3>{selectedContact.name}</h3>
              <span className={`status ${selectedContact.online ? "online" : "offline"}`}>
                {selectedContact.online ? "在线" : "离线"}
              </span>
            </div>
          </div>

          <div className="chat-actions">
            <button className="action-button">
              <Phone size={18} />
            </button>
            <button className="action-button">
              <Video size={18} />
            </button>
            <button className="action-button" onClick={handleSwitchDetails}>
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="messages-area">
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender === "me" ? "message-sent" : ""}`}>
                {message.sender === "other" && (
                  <img
                    className="message-avatar"
                    src={selectedContact.avatar || "/placeholder.svg"}
                    alt={selectedContact.name}
                    style={{ borderRadius: "50%" }}
                  />
                )}

                <div className="message-content">
                  {message.type === "text" && <div className="message-bubble text-message">{message.content}</div>}

                  {message.type === "image" && (
                    <div className="message-bubble image-message">
                      <img src={message.content || "/placeholder.svg"} alt="聊天图片" />
                    </div>
                  )}

                  {message.type === "file" && (
                    <div className="message-bubble file-message">
                      <File size={24} style={{ color: "#007aff" }} />
                      <div className="file-info">
                        <div className="file-name">{message.fileName}</div>
                        <div className="file-size">{message.fileSize}</div>
                      </div>
                    </div>
                  )}

                  <div className="message-time">{message.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="message-input-area">
          <div className="input-toolbar">
            <button className="toolbar-button">
              <Smile size={18} />
            </button>
            <button className="toolbar-button">
              <Paperclip size={18} />
            </button>
            <button className="toolbar-button">
              <ImageIcon size={18} />
            </button>
          </div>

          <div className="input-container">
            <textarea
              className="message-input"
              placeholder="输入消息..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              rows={1}
            />
            <button className="send-button" onClick={handleSendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 右侧详情面板 */}
      {showDetails && (<div className="details-panel">
        <div className="user-profile">
          <img
            className="profile-avatar"
            src={selectedContact.avatar || "/placeholder.svg"}
            alt={selectedContact.name}
            style={{ borderRadius: "50%" }}
          />
          <h3>{selectedContact.name}</h3>
          <p className="user-status">{selectedContact.online ? "在线" : "离线"}</p>
        </div>

        <div className="profile-actions">
          <button className="profile-action">
            <Phone size={16} />
            语音通话
          </button>
          <button className="profile-action">
            <Video size={16} />
            视频通话
          </button>
        </div>

        <div className="shared-content">
          <h4>共享内容</h4>
          <div className="content-tabs">
            <button className="active">图片</button>
            <button>文件</button>
            <button>链接</button>
          </div>

          <div className="shared-images">
            <div className="image-grid">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://picsum.photos/80/80?random=${i + 10}`} alt="共享图片" />
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
