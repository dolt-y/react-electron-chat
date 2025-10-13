// utils/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:8080', { autoConnect: false });

    socket.on('connect', () => {
      console.log('✅ 连接成功:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ 连接断开:', reason);
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
