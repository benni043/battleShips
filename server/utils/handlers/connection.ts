import type { Server, Socket } from "socket.io";
import { handleGameEvents } from "~~/server/utils/handlers/game/gameHandler";

export function registerConnectionHandlers(socket: Socket, io: Server) {
  handleLobbyEvents(socket, io);
  handleGameEvents(socket, io);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
}
