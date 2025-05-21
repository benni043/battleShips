import type { Server, Socket } from "socket.io";
import { handleGamePlaceEvents } from "~~/server/utils/handlers/game/gamePlaceHandler";
import { handleGameEvents } from "~~/server/utils/handlers/game/gameHandler";

export function registerConnectionHandlers(socket: Socket, io: Server) {
  console.log(`User connected: ${socket.id}`);

  handleLobbyEvents(socket, io);
  handleGamePlaceEvents(socket, io);
  handleGameEvents(socket, io);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
}
