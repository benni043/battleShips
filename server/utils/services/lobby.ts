import {
  GameCreationError,
  GameJoinError,
  type GameLobby,
} from "~~/shared/types";
import type { Socket } from "socket.io";

export class Lobby {
  getAvailableGames() {
    return lobbyRepository.getAvailableGames();
  }

  getGameByName(gameName: string): GameLobby | undefined {
    return lobbyRepository.getGameByName(gameName);
  }

  createGame(gameName: string, socket: Socket) {
    if (!this.isGameNameAvailable(gameName))
      return GameCreationError.ALREADY_TAKEN;
    if (!this.isGameNameValid(gameName)) return GameCreationError.INVALID;

    return lobbyRepository.createGame(gameName, socket);
  }

  joinGame(gameName: string, socket: Socket) {
    const game = lobbyRepository.getGameByName(gameName);

    if (!game || game.socketPlayer2) return GameJoinError.FULL;

    return lobbyRepository.joinGame(gameName, socket);
  }

  private isGameNameAvailable(gameName: string) {
    const lobbies = lobbyRepository.getAllGames();

    return !lobbies.has(gameName);
  }

  private isGameNameValid(gameName: string): boolean {
    const minLength = 3;
    const maxLength = 20;
    const validNameRegex = /^[a-zA-Z0-9]+$/;

    return (
      gameName.length >= minLength &&
      gameName.length <= maxLength &&
      validNameRegex.test(gameName)
    );
  }
}

export const lobbyService = new Lobby();
