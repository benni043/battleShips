import type { Server, Socket } from "socket.io";
import type { GameCreationOrJoinResponse } from "~~/shared/types";
import { GameCreationError, GameJoinError } from "~~/shared/types";
import { lobbyService } from "~~/server/utils/services/lobbyService";

export function handleLobbyEvents(socket: Socket, io: Server) {

  socket.on("join-lobby", (cb) => {
    console.log(`User: ${socket.id} connected to lobby`);

    socket.join("lobby");
    cb(lobbyService.getAvailableGames());
  })

  socket.on("create-game", (id, gameName, cb) => {
    const game = lobbyService.createGame(id, gameName);

    if (game == GameCreationError.ALREADY_TAKEN) {
      cb(GameCreationError.ALREADY_TAKEN);
    } else if (game == GameCreationError.INVALID) {
      cb(GameCreationError.INVALID);
    } else {
      cb({ gameName: gameName } as GameCreationOrJoinResponse);
      io.to("lobby").emit("new-game", game);
    }
  });

  socket.on("join-game", (id, gameName, cb) => {
    const game = lobbyService.joinGame(id, gameName);

    if (game == GameJoinError.FULL) {
      cb(GameJoinError.FULL);
    } else {
      cb({ gameName: gameName } as GameCreationOrJoinResponse);
      io.to("lobby").emit("remove-game", game);
    }
  });
}
