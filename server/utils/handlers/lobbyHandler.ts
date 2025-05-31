import type { Server, Socket } from "socket.io";
import { lobbyService } from "~~/server/utils/services/lobbyService";
import type { LobbyResponse } from "#shared/lobbyTypes";
import { LobbyError } from "#shared/lobbyTypes";

export function handleLobbyEvents(socket: Socket, io: Server) {
  socket.on("join-lobby", (cb) => {
    console.log(`User: ${socket.id} connected to lobby`);

    socket.join("lobby");
    cb(lobbyService.getAvailableLobbies());
  });

  socket.on("create-game", (lobbyName, id, cb) => {
    const lobby = lobbyService.createLobby(lobbyName, id);

    if (lobby === LobbyError.INVALID_GAME) {
      cb(lobby);
      return;
    }

    cb({ lobbyId: lobby.lobbyId, lobbyName: lobby.lobbyName } as LobbyResponse);
    io.to("lobby").emit("new-game", lobby);
  });

  socket.on("join-game", (lobbyId, id, cb) => {
    const lobby = lobbyService.joinLobby(lobbyId, id);

    if (lobby === LobbyError.INVALID_GAME || lobby === LobbyError.FULL) {
      cb(lobby);
      return;
    }

    cb({ lobbyId: lobby.lobbyId, lobbyName: lobby.lobbyName } as LobbyResponse);
    io.to("lobby").emit("remove-game", lobby);
  });
}
