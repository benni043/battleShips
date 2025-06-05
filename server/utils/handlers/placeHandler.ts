import type { Namespace, Socket } from "socket.io";
import { gameService } from "~~/server/utils/services/gameService";
import { lobbyService } from "~~/server/utils/services/lobbyService";

export function handlePlaceEvents(socket: Socket, lobbyIO: Namespace) {
  socket.on("join", (gameId: string) => {
    console.log(`User: ${socket.id} connected to place`);

    socket.join(gameId);
  });

  socket.on("ready", (gameId: string, playerId: string) => {
    lobbyService.setReady(gameId, playerId);

    if (lobbyService.getReady(gameId)) {
      lobbyIO.to(gameId).emit("start");
      lobbyService.removeLobby(gameId);
    }
  });

  socket.on("manuel-disconnect", (gameId: string) => {
    console.log("dis");

    if (!lobbyService.getReady(gameId)) {
      io.of("lobby").emit("fetch");

      gameService.remove(gameId);
      lobbyService.removeLobby(gameId);
      socket.to(gameId).emit("opponent-disconnected");
    }
  });
}
