import type { Server, Socket } from "socket.io";
import { gameService } from "~~/server/utils/services/gameService";

export function handlePlaceEvents(socket: Socket, io: Server) {
  socket.on("join", (gameId: string) => {
    socket.join(gameId);
  })

  socket.on("ready", (gameId: string, playerId: string) => {
    const ready = gameService.setReady(gameId, playerId);

    if (gameService.getReady(gameId)) io.to(gameId).emit("start");
  });

  socket.on("place-disconnect", (gameId: string) => {
    // const removed = gameService.tryRemove(gameId, socket);
    console.log("place disconnect");

    if (!gameService.getReady(gameId))
      socket.to(gameId).emit("opponent-disconnected");
  });
}
