import type { Lobby } from "#shared/lobbyTypes";

export class LobbyRepository {
  private readonly lobbies = new Map<string, Lobby>();

  getAvailableLobbies(): string[] {
    return this.lobbies.keys().toArray();
  }

  createLobby(lobbyName: string, id: string) {
    const lobby = {
      lobbyName: lobbyName,
      player1Id: id,
      player2Id: undefined,
    } as Lobby;

    this.lobbies.set(lobbyName, lobby);

    return lobbyName;
  }

  joinLobby(lobbyName: string, id: string) {
    const lobby = this.lobbies.get(lobbyName)!;

    lobby.player2Id = id;

    return lobbyName;
  }

  getLobbyByName(lobbyName: string) {
    return this.lobbies.get(lobbyName);
  }

  removeLobby(lobbyName: string) {
    this.lobbies.delete(lobbyName);
  }
}

export const lobbyRepository = new LobbyRepository();
