import type { Lobby, LobbyResponse } from "#shared/lobbyTypes";
import { v4 as uuidv4 } from "uuid";

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
      player1: { id: id, name: name },
      player2: undefined,
    };

    this.lobbies.set(uuid, lobby);

    return { lobbyId: uuid, lobbyName: lobby.lobbyName } as LobbyResponse;
  }

  joinLobby(lobbyId: string, id: string, name: string) {
    const lobby = this.lobbies.get(lobbyId)!;

    lobby.player2 = { id: id, name: name };

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
