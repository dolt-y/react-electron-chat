import { useState, type JSX } from "react"
import { Send, Paperclip, Smile, Phone, Video, MoreHorizontal, ImageIcon, File } from "lucide-react"
import "./chat.scss"
import { contacts, messages } from "./mock"
import { Sidebar } from "../../components/chat/sidebar/sidebar";
import { Contact } from "../../components/chat/contact/contact";
export default function ChatPage(): JSX.Element {
  const [selectedContact] = useState(contacts[0])
  const [messageInput, setMessageInput] = useState("")
  const [showDetails, setShowDetails] = useState(false)

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("发送消息:", messageInput)
      setMessageInput("")
    }
  }
  const handleSwitchDetails = () => {
    setShowDetails(!showDetails)
  }
  return (
    <div className="chat-container">
      {/* 侧边导航栏 */}
      <Sidebar />
      {/* 左侧联系人列表 */}
      <Contact />
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
