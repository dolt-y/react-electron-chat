import { useEffect, useMemo, useState } from "react";
import styles from "./list.module.scss";
import instance from "../../utils/request";
import service from "../../service";
import { ResizableSidebar } from "../chat/contact/ResizableSidebar";
import type { FriendProfile } from "../../shared/types/friend";

type FriendApiUser = {
  id: number
  username: string
  avatarUrl: string | null
  status: "online" | "offline" | "away" | "busy" | null
  bio: string | null
  phone: string | null
  email: string | null
  location?: string | null
}

type FriendListItem = {
  id: number
  createdAt: string | null
  friend: FriendApiUser
}

interface FriendListProps {
  currentUserId?: number,
  listClassName?: string,
  detailClassName?: string,
}

export const FriendList: React.FC<FriendListProps> = ({ currentUserId }) => {
  const [friends, setFriends] = useState<FriendProfile[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null)
  const [isChatMode, setIsChatMode] = useState(false)
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: "me" | "friend"; time: Date }>>([])
  const [inputMessage, setInputMessage] = useState("")

  const getOnlineText = (online?: boolean) => {
    if (online) return "在线"
    return "离线"
  }

  const pickByOnline = (online: boolean | undefined, onlineClass: string, offlineClass: string) => {
    if (online) return onlineClass
    return offlineClass
  }

  useEffect(() => {
    if (!currentUserId) {
      setFriends([])
      setSelectedFriendId(null)
      return
    }

    const fetchFriends = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await instance.get<FriendListItem[]>(service.friendships, { userId: currentUserId })
        if (res.success) {
          const normalized: FriendProfile[] = res.result.map(({ friend, createdAt }) => ({
            id: friend.id,
            username: friend.username,
            avatar: friend.avatarUrl,
            online: friend.status === "online",
            signature: friend.bio,
            phone: friend.phone,
            email: friend.email,
            location: friend.location,
            createdAt,
          }))

          setFriends(normalized)
          setSelectedFriendId((prev) => {
            if (!normalized.length) return null
            if (prev && normalized.some((n: { id: number }) => n.id === prev)) {
              return prev
            }
            return normalized[0].id
          })
        } else {
          setError(res.message || "获取通讯录失败")
          setFriends([])
          setSelectedFriendId(null)
        }
      } catch (err) {
        setError("通讯录接口异常")
        setFriends([])
        setSelectedFriendId(null)
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [currentUserId])

  const filtered = useMemo(
    () => friends.filter((f) => f.username.toLowerCase().includes(search.toLowerCase())),
    [friends, search],
  )

  useEffect(() => {
    if (!filtered.length) {
      setSelectedFriendId(null)
      return
    }
    setSelectedFriendId((prev) => {
      if (prev && filtered.some((f) => f.id === prev)) return prev
      return filtered[0].id
    })
  }, [filtered])

  const activeFriend = useMemo(() => {
    if (!selectedFriendId) return null
    return filtered.find((f) => f.id === selectedFriendId) || null
  }, [filtered, selectedFriendId])

  let subtitle = "请先登录查看通讯录"
  if (currentUserId) {
    subtitle = `共有 ${friends.length} 位好友`
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeFriend) return

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "me" as const,
      time: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
  }

  const renderState = (message: string) => (
    <div className={styles.state}>
      <p>{message}</p>
    </div>
  )

  const renderList = () => {
    if (!currentUserId) return renderState("登录后即可查看通讯录")
    if (loading) return renderState("加载中...")
    if (error) return renderState(error)
    if (filtered.length === 0) return renderState("暂无好友或无匹配结果")

    return (
      <div className={styles.list}>
        {filtered.map((friend) => {
          const isActive = selectedFriendId === friend.id
          const isOnline = !!friend.online
          const itemClassName = [styles.item, isActive && styles.active].filter(Boolean).join(" ")
          const statusDotClassName = [
            styles.statusDot,
            pickByOnline(isOnline, styles.online, styles.offline),
          ]
            .filter(Boolean)
            .join(" ")

          return (
            <div
              key={friend.id}
              className={itemClassName}
              onClick={() => {
                setSelectedFriendId(friend.id)
                setIsChatMode(false)
              }}
            >
              <div className={styles.avatarWrap}>
                <img src={friend.avatar || "/placeholder.svg"} className={styles.avatar} alt={friend.username} />
                <span className={statusDotClassName} />
              </div>
              <div className={styles.content}>
                <div className={styles.contentHeader}>
                  <span className={styles.name}>{friend.username}</span>
                  <span className={styles.status}>{getOnlineText(isOnline)}</span>
                </div>
                <p className={styles.signature}>{friend.signature || "这位好友还没有签名~"}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderChatWindow = () => {
    if (!activeFriend) return null

    let chatContent = (
      <div className={styles.emptyChat}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p>暂无消息，快来和好友聊天吧</p>
      </div>
    )

    if (messages.length > 0) {
      chatContent = messages.map((msg) => {
        const isMine = msg.sender === "me"
        const messageClassName = [
          styles.messageItem,
          isMine && styles.myMessage,
          !isMine && styles.friendMessage,
        ]
          .filter(Boolean)
          .join(" ")

        return (
          <div key={msg.id} className={messageClassName}>
            {msg.sender === "friend" && (
              <img src={activeFriend.avatar || "/placeholder.svg"} className={styles.msgAvatar} alt="" />
            )}
            <div className={styles.messageBubble}>
              <p>{msg.text}</p>
              <span className={styles.messageTime}>
                {msg.time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {msg.sender === "me" && (
              <img src="/placeholder.svg?height=40&width=40" className={styles.msgAvatar} alt="" />
            )}
          </div>
        )
      })
    }

    return (
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <button className={styles.backBtn} onClick={() => setIsChatMode(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className={styles.chatHeaderInfo}>
            <img
              src={activeFriend.avatar || "/placeholder.svg"}
              className={styles.chatAvatar}
              alt={activeFriend.username}
            />
            <div>
              <h4>{activeFriend.username}</h4>
              <span className={styles.chatStatus}>{getOnlineText(activeFriend.online)}</span>
            </div>
          </div>
        </div>

        <div className={styles.chatMessages}>{chatContent}</div>

        <div className={styles.chatInput}>
          <button className={styles.toolBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9 9h.01M15 9h.01" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="输入消息..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button className={styles.sendBtn} onClick={handleSendMessage} disabled={!inputMessage.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  const renderDetail = () => {
    if (!currentUserId) return <div className={styles.detailEmpty} />
    if (!activeFriend) return <div className={styles.detailEmpty} />

    if (isChatMode) {
      return renderChatWindow()
    }

    let createdAtText = "未知"
    if (activeFriend.createdAt) {
      createdAtText = new Date(activeFriend.createdAt).toLocaleDateString()
    }

    return (
      <div className={styles.detailContent}>
        <div className={styles.profileSection}>
          <img
            src={activeFriend.avatar || "/placeholder.svg"}
            className={styles.profileAvatar}
            alt={activeFriend.username}
          />
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>{activeFriend.username}</h2>
            <span
              className={[
                styles.profileStatus,
                pickByOnline(activeFriend.online, styles.statusOnline, styles.statusOffline),
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {getOnlineText(activeFriend.online)}
            </span>
            {activeFriend.signature && <p className={styles.profileBio}>{activeFriend.signature}</p>}
          </div>
        </div>

        <div className={styles.actionBar}>
          <button className={styles.btnPrimary} onClick={() => setIsChatMode(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            发消息
          </button>
          <button className={styles.btnSecondary}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            语音通话
          </button>
          <button className={styles.btnSecondary}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            视频通话
          </button>
        </div>

        <div className={styles.infoSection}>
          <h3 className={styles.sectionTitle}>个人信息</h3>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>好友 ID</span>
              <span className={styles.infoValue}>#{activeFriend.id}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>手机号</span>
              <span className={styles.infoValue}>{activeFriend.phone || "未填写"}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>邮箱</span>
              <span className={styles.infoValue}>{activeFriend.email || "未填写"}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>地区</span>
              <span className={styles.infoValue}>{activeFriend.location || "未知"}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>成为好友</span>
              <span className={styles.infoValue}>{createdAtText}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <ResizableSidebar className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <div className={styles.header}>
            <div className={styles.titleRow}>
              <h3>通讯录</h3>
              <span>{subtitle}</span>
            </div>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                placeholder="搜索好友"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={!currentUserId}
              />
            </div>
          </div>
          <div className={styles.body}>{renderList()}</div>
        </div>
      </ResizableSidebar>

      <div className={styles.detailPane}>{renderDetail()}</div>
    </div>
  )
}

export default FriendList
