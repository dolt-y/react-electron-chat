import { useEffect, useRef, useCallback } from "react";
import { connectSocket } from "../utils/socket";
import { Socket } from "socket.io-client";
import { getAuthToken } from "../utils/auth";
import type { SocketChatMessage } from "../shared/types/chat";

export const useChatSocket = () => {
    const socketRef = useRef<Socket>(connectSocket());
    const currentRoomRef = useRef<number | null>(null);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const token = getAuthToken();
        if (!token) {
            console.warn("缺少认证 token，暂不建立 Socket 连接");
            return;
        }
        socket.auth = { token };

        const handleConnect = () => console.log("✅ Socket 已连接", socket.id);
        const handleDisconnect = (reason: string) => console.log("❌ Socket 断开连接:", reason);
        const handleError = (err: any) => console.error("Socket 错误:", err);
        const handleConnectError = (err: Error) => console.error("Socket 连接失败:", err.message);

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("error", handleError);
        socket.io.on("error", handleConnectError);

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("error", handleError);
            socket.io.off("error", handleConnectError);
        };
    }, []);

    const joinRoom = useCallback((chatId: number) => {
        const socket = socketRef.current;
        if (!socket || !chatId) return;

        if (currentRoomRef.current === chatId) return;
        socket.emit("joinChat", { chatId });
        currentRoomRef.current = chatId;
    }, []);

    const sendMessage = useCallback(
        (chatId: number, content: string, type: SocketChatMessage["type"] = "text") => {
            const socket = socketRef.current;
            if (!socket || !content.trim()) return;

            socket.emit("message", { chatId, content, type });
        },
        []
    );

    return {
        socket: socketRef.current,
        joinRoom,
        sendMessage,
    };
};
