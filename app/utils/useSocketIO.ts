import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket(): Socket {
  if (!socket) {
    socket = io({
      path: "/api/socket.io",
    });
  }

  return socket;
}
