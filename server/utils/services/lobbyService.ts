import { LobbyError } from "#shared/lobbyTypes";
import { lobbyRepository } from "~~/server/utils/repositories/lobbyRepository";
import { gameService } from "~~/server/utils/services/gameService";

export class LobbyService {
  getAvailableLobbies() {
    return lobbyRepository.getAvailableLobbies();
  }

  createLobby(lobbyName: string, id: string) {
    if (!this.isLobbyNameAvailable(lobbyName)) return LobbyError.ALREADY_TAKEN;

    if (!this.isLobbyNameValid(lobbyName)) return LobbyError.INVALID_GAME;

    return lobbyRepository.createLobby(lobbyName, id);
  }

  joinLobby(lobbyName: string, id: string) {
    const lobby = lobbyRepository.getLobbyByName(lobbyName);

    if (!lobby) return LobbyError.INVALID_GAME;
    if (lobby.player2Id !== undefined) return LobbyError.FULL;

    return lobbyRepository.joinLobby(lobbyName, id);
  }

  private isLobbyNameAvailable(lobbyName: string) {
    const lobbies = lobbyRepository.getAvailableLobbies();
    const games = gameService.getAllGames();

    return !lobbies.includes(lobbyName) && !games.includes(lobbyName);
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

  checkData(lobbyName: string, id: string) {
    const lobby = lobbyRepository.getLobbyByName(lobbyName);

    if (!lobby) return LobbyError.INVALID_GAME;

    if (lobby.player1Id !== id && lobby.player2Id !== id)
      return LobbyError.INVALID_ID;
  }

  removeLobby(lobbyName: string) {
    lobbyRepository.removeLobby(lobbyName);
  }
}

export const lobbyService = new LobbyService();
