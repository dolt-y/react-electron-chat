import { useEffect, useRef, useState, useCallback } from "react";
import { connectSocket, getSocket } from '../utils/socket'

interface ChatMessage {
    chatId: number;
    senderId: number;
    content: string;
    type: "text" | "image" | "file" | "video" | "audio";
    createdAt: string;
    senderUsername: string;
}

export const useChatSocket = () => {
    const socketRef = useRef(connectSocket());
    const currentRoomRef = useRef<number | null>(null);
    const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
    useEffect(() => {
        const socket = socketRef.current;

        if (!socket.connected) {
            socket.connect();
        }

        socket.on("connect", () => {
            console.log("✅ Socket 已连接", socket.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ Socket 断开连接:", reason);
        });

        socket.on("message", (msg: ChatMessage) => {
            setMessages((prev) => {
                const chatMsgs = prev[msg.chatId] || [];
                return { ...prev, [msg.chatId]: [...chatMsgs, msg] };
            });
        });

        socket.on("error", (err: any) => {
            console.error("Socket 错误:", err);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("message");
            socket.off("error");
        };
    }, []);
    
    // 切换房间
    const joinRoom = useCallback((chatId: number) => {
        const socket = socketRef.current;
        if (!socket) return;

        if (currentRoomRef.current) {
            socket.emit("leaveRoom", currentRoomRef.current);
        }

        socket.emit("joinChat", { chatId });
        currentRoomRef.current = chatId;
    }, []);

    // 发送消息
    const sendMessage = useCallback(
        (chatId: number, senderId: number, content: string, type: ChatMessage["type"] = "text") => {
            const socket = socketRef.current;
            if (!socket) return;

            socket.emit("message", { chatId, senderId, content, type });

            // 乐观更新
            setMessages((prev) => {
                const chatMsgs = prev[chatId] || [];
                return {
                    ...prev,
                    [chatId]: [
                        ...chatMsgs,
                        { chatId, senderId, content, type, createdAt: new Date().toISOString(), senderUsername: "我" },
                    ],
                };
            });
        },
        []
    );

    return {
        socket: socketRef.current,
        messages,
        joinRoom,
        sendMessage,
        currentRoomId: currentRoomRef.current,
    };
};
