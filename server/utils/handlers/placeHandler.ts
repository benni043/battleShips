import type { Namespace, Socket } from "socket.io";
import { gameService } from "~~/server/utils/services/gameService";

export function handlePlaceEvents(socket: Socket, io: Namespace) {
  socket.on("join", (gameId: string) => {
    console.log(`User: ${socket.id} connected to place`);

    socket.join(gameId);
  });

  socket.on("ready", (gameId: string, playerId: string) => {
    gameService.setReady(gameId, playerId);

    if (gameService.getReady(gameId)) io.to(gameId).emit("start");
  });

  socket.on("manuel-disconnect", (gameId: string) => {
    if (!gameService.getReady(gameId)) {
      gameService.remove(gameId);
      socket.to(gameId).emit("opponent-disconnected");
    }
  });
}
