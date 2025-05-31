import { LobbyError } from "#shared/lobbyTypes";
import { lobbyRepository } from "~~/server/utils/repositories/lobbyRepository";

export class LobbyService {
  getAvailableLobbies() {
    return lobbyRepository.getAvailableLobbies();
  }

  createLobby(lobbyName: string, id: string, name: string) {
    if (!this.isLobbyNameValid(lobbyName)) return LobbyError.INVALID_GAME;

    return lobbyRepository.createLobby(lobbyName, id, name);
  }

  joinLobby(lobbyId: string, id: string, name: string) {
    const lobby = lobbyRepository.getLobbyById(lobbyId);

    if (!lobby) return LobbyError.INVALID_GAME;
    if (lobby.player2 !== undefined) return LobbyError.FULL;

    return lobbyRepository.joinLobby(lobbyId, id, name);
  }

  private isLobbyNameValid(lobbyName: string): boolean {
    const minLength = 3;
    const maxLength = 20;
    const validNameRegex = /^[a-zA-Z0-9]+$/;

    return (
      lobbyName.length >= minLength &&
      lobbyName.length <= maxLength &&
      validNameRegex.test(lobbyName)
    );
  }

  removeLobby(lobbyId: string) {
    lobbyRepository.removeLobby(lobbyId);
  }
}

export const lobbyService = new LobbyService();
