import { useRef, useState, useEffect, type JSX } from "react";
import { Paperclip, Smile, Phone, Video, ImageIcon } from "lucide-react";
import styles from "./ChatPanel.module.scss";
import { type Chat } from "../contact/contact";
import instance from "../../../utils/request";
import { ResizableSidebar } from "../contact/ResizableSidebar";
import { MessageItem } from "./message";
import { ChatHeader } from "./chatHeader";
import { formatMessageTime } from "../../../utils/chat/time";
import { Socket } from "socket.io-client";
import service from "../../../service";
import type { SocketChatMessage } from "../../../hook/useChatSocket";
export interface Message {
	messageId: number;
	senderId: number;
	type: "text" | "image" | "file" | "video" | "audio";
	isRead: boolean;
	content: string;
	senderAvatar?: string;
	senderUsername?: string;
	createdAt: string;
	url?: string;
	fileName?: string;
	fileSize?: string;
}

interface ChatPanelProps {
	selectedChat: Chat | null;
	className?: string;
	onSendMessage?: (chatId: number, content: string) => void;
	currentUserId?: number;
	socket?: Socket | null;
}

const PAGE_SIZE = 10;
const TIME_GAP_MS = 5 * 60 * 1000;

export const ChatPanel: React.FC<ChatPanelProps> = ({ selectedChat, className, onSendMessage, currentUserId, socket }) => {
	const [messagesState, setMessagesState] = useState<Message[]>([]);
	const [messageInput, setMessageInput] = useState("");
	const [showDetails, setShowDetails] = useState(false);

	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const scrollTimer = useRef<NodeJS.Timeout | null>(null);
	const loadingRef = useRef(false);

	const detailsRef = useRef<HTMLDivElement | null>(null);

	// 缓存：每个会话的消息列表 & scrollTop & 页码 & hasMore
	const messagesCache = useRef<Record<number, { messages: Message[]; scrollTop: number }>>({});
	const pageCache = useRef<Record<number, number>>({});
	const hasMoreCache = useRef<Record<number, boolean>>({});

	// -------------------------------
	// 获取消息
	// -------------------------------
	const fetchMessages = async (chatId: number, page: number) => {
		if (!messagesContainerRef.current || loadingRef.current || hasMoreCache.current[chatId] === false)
			return;

		loadingRef.current = true;
		try {
			const res = await instance.post(service.messages, { chatId, page, pageSize: PAGE_SIZE });
			if (res.success) {
				const newMessages: Message[] = res.result;
				console.log("获取到的消息列表", res);
				if (!messagesCache.current[chatId]) {
					messagesCache.current[chatId] = { messages: [], scrollTop: 0 };
					pageCache.current[chatId] = 1;
					hasMoreCache.current[chatId] = true;
				}
				const cache = messagesCache.current[chatId];
				cache.messages = page === 1 ? newMessages : [...newMessages, ...cache.messages];
				pageCache.current[chatId] = page;
				if (newMessages.length < PAGE_SIZE) hasMoreCache.current[chatId] = false;

				setMessagesState([...cache.messages]);
				if (page === 1) {
					setTimeout(scrollToBottom, 20);
				}
			} else {
				console.log("获取消息失败", res);
			}
		} finally {
			loadingRef.current = false;
		}
	};

	// -------------------------------
	// 滚动到底部
	// -------------------------------
	const scrollToBottom = () => {
		const container = messagesContainerRef.current;
		const chatId = selectedChat?.chatId;
		if (container && chatId && messagesCache.current[chatId]) {
			container.scrollTop = container.scrollHeight;
			messagesCache.current[chatId].scrollTop = container.scrollTop;
		}
	};

	// -------------------------------
	// 监听会话切换
	// -------------------------------
	useEffect(() => {
		if (!selectedChat) {
			setMessagesState([]);
			return;
		}
		const chatId = selectedChat.chatId;
		const cache = messagesCache.current[chatId];
		if (cache) {
			setMessagesState([...cache.messages]);
		}
		fetchMessages(chatId, 1);
	}, [selectedChat]);

	// -------------------------------
	// 监听 socket 消息
	// -------------------------------
	useEffect(() => {
		if (!socket || !selectedChat) return;

		const handleSocketMessage = (msg: SocketChatMessage) => {
			if (msg.chatId !== selectedChat.chatId) return;

			const cache = messagesCache.current[msg.chatId] || { messages: [], scrollTop: 0 };
			const incoming: Message = {
				messageId: Date.now(),
				senderId: msg.senderId,
				type: msg.type,
				isRead: false,
				content: msg.content,
				senderUsername: msg.senderUsername,
				createdAt: msg.createdAt,
			};
			cache.messages = [...cache.messages, incoming];
			messagesCache.current[msg.chatId] = cache;
			setMessagesState([...cache.messages]);
			setTimeout(scrollToBottom, 20);
		};

		socket.on("message", handleSocketMessage);
		return () => {
			socket.off("message", handleSocketMessage);
		};
	}, [socket, selectedChat]);


	// -------------------------------
	// 点击空白关闭详情面板
	// -------------------------------
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
				setShowDetails(false);
			}
		};
		if (showDetails) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showDetails]);

	// -------------------------------
	// 上拉加载历史消息
	// -------------------------------
	const handleScroll = () => {
		const container = messagesContainerRef.current;
		const chatId = selectedChat?.chatId;
		if (!container || !chatId) {
			console.log("container or chatId is null");
			return;
		}

		if (messagesCache.current[chatId]) {
			messagesCache.current[chatId].scrollTop = container.scrollTop;
		}

		if (scrollTimer.current) clearTimeout(scrollTimer.current);
		scrollTimer.current = setTimeout(() => {
			if (container.scrollTop < 50) {
				const nextPage = (pageCache.current[chatId] || 1) + 1;
				fetchMessages(chatId, nextPage);
			}
		}, 200);
	};


	// -------------------------------
	// 发送消息
	// -------------------------------
	const handleSendMessage = () => {
		if (!messageInput.trim() || !selectedChat) return;

		const chatId = selectedChat.chatId;

		setMessageInput("");
		onSendMessage?.(chatId, messageInput.trim());
	};

	const renderMessages = () => {
		if (!selectedChat || messagesState.length === 0) return null;

		const ordered = [...messagesState].sort(
			(a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
		);
		const nodes: JSX.Element[] = [];
		let lastShownTime = 0;

		ordered.forEach((msg, idx) => {
			const msgTime = Date.parse(msg.createdAt);
			const showTime =
				isNaN(msgTime) || lastShownTime === 0 || msgTime - lastShownTime > TIME_GAP_MS;

			if (showTime) {
				nodes.push(
					<div
						key={`time-${selectedChat.chatId}-${idx}-${msg.createdAt}`}
						className={styles.timeSeparator}
					>
						{formatMessageTime(msg.createdAt)}
					</div>
				);
				if (!isNaN(msgTime)) lastShownTime = msgTime;
			}
			nodes.push(
				<MessageItem
					key={`msg-${selectedChat.chatId}-${msg.messageId}-${idx}`}
					message={msg}
					currentUserId={currentUserId}
				/>
			);
		});

		return nodes;
	};


	// -------------------------------
	// 空状态
	// -------------------------------
	if (!selectedChat)
		return <div className={`${styles.chatPanel} ${className || ""}`}><div className={styles.emptyState}></div></div>;

	return (
		<div className={`${styles.chatPanel} ${className || ""}`}>
			<ChatHeader chat={selectedChat} onToggleDetails={() => setShowDetails(!showDetails)} />
			<div className={styles.messagesArea} ref={messagesContainerRef} onScroll={handleScroll}>
				<div className={styles.messagesContainer}>{renderMessages()}</div>
			</div>

			<ResizableSidebar defaultSize={140} minSize={140} maxSize={300} direction="top">
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
							onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
							rows={1}
						/>
					</div>
				</div>
			</ResizableSidebar>

			{showDetails && (
				<div ref={detailsRef} onClick={(e) => e.stopPropagation()} className={styles.detailsPanel}>
					<div className={styles.userProfile}>
						<img className={styles.profileAvatar} src={selectedChat.chatAvatar || "/placeholder.svg"} />
						<h3>{selectedChat.chatName}</h3>
						<p className={styles.userStatus}>{selectedChat.online ? "在线" : "离线"}</p>
					</div>
					<div className={styles.profileActions}>
						<button className={styles.profileAction}><Phone size={16} />语音通话</button>
						<button className={styles.profileAction}><Video size={16} />视频通话</button>
					</div>
				</div>
			)}
		</div>
	);
};
