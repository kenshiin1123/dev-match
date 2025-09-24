import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_ORIGIN, {
      auth: { token },
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
