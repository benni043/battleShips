import type { LobbyResponse } from "#shared/lobbyTypes";
import { v4 as uuidv4 } from "uuid";
import type { Lobby } from "~~/server/utils/types/lobbyTypes";

export class LobbyRepository {
  private readonly lobbies = new Map<string, Lobby>();

  getAvailableLobbies(): LobbyResponse[] {
    return Array.from(this.lobbies.values()).map((lobby) => ({
      lobbyId: lobby.id,
      lobbyName: lobby.lobbyName,
    }));
  }

  createLobby(lobbyName: string, id: string, name: string) {
    const uuid = uuidv4();

    const lobby: Lobby = {
      lobbyName: lobbyName,
      id: uuid,
      player1: { id: id, name: name, ready: false },
      player2: undefined,
    };

    this.lobbies.set(uuid, lobby);

    return lobby;
  }

  setReady(lobbyId: string, playerId: string) {
    const lobby = this.lobbies.get(lobbyId)!;

    if (playerId === lobby.player1.id) lobby.player1.ready = true;
    else lobby.player2!.ready = true;
  }

  getReady(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId)!;

    return lobby.player1.ready && lobby.player2?.ready;
  }

  joinLobby(lobbyId: string, id: string, name: string) {
    const lobby = this.lobbies.get(lobbyId)!;

    lobby.player2 = { id: id, name: name, ready: false };

    return lobby;
  }

  getLobbyById(lobbyId: string) {
    return this.lobbies.get(lobbyId);
  }

  removeLobby(lobbyId: string) {
    this.lobbies.delete(lobbyId);
  }
}

export const lobbyRepository = new LobbyRepository();
