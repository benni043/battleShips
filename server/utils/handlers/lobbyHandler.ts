import type { Server, Socket } from "socket.io";
import { lobbyService } from "~~/server/utils/services/lobbyService";
import type { LobbyResponse } from "#shared/lobbyTypes";

export function handleLobbyEvents(socket: Socket, io: Server) {
  socket.on("join-lobby", (cb) => {
    console.log(`User: ${socket.id} connected to lobby`);

    socket.join("lobby");
    cb(lobbyService.getAvailableLobbies());
  });

  socket.on("create-game", (lobbyName, id, cb) => {
    const lobby = lobbyService.createLobby(lobbyName, id);

    if (lobby === lobbyName) {
      cb({ lobbyName: lobbyName } as LobbyResponse);
      io.to("lobby").emit("new-game", lobby);
      return;
    }

    cb(lobby);
  });

  socket.on("join-game", (lobbyName, id, cb) => {
    const lobby = lobbyService.joinLobby(lobbyName, id);

    if (lobby === lobbyName) {
      cb({ lobbyName: lobbyName } as LobbyResponse);
      io.to("lobby").emit("remove-game", lobby);
      return;
    }

    cb(lobby);
  });
}
