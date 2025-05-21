import {
  GameCreationError,
  GameJoinError,
  type GameLobby,
} from "~~/shared/types";
import type { Cell } from "#shared/gameTypes";
import type { Socket } from "socket.io";

export class LobbyService {
  getAvailableGames() {
    return lobbyRepository.getAvailableGames();
  }

  getGameByName(gameName: string): GameLobby | undefined {
    return lobbyRepository.getGameByName(gameName);
  }

  createGame(id: string, gameName: string) {
    if (!this.isGameNameAvailable(gameName))
      return GameCreationError.ALREADY_TAKEN;
    if (!this.isGameNameValid(gameName)) return GameCreationError.INVALID;

    return lobbyRepository.createGame(id, gameName);
  }

  joinGame(id: string, gameName: string) {
    const game = lobbyRepository.getGameByName(gameName);

    if (!game || game.player2.id) return GameJoinError.FULL;

    return lobbyRepository.joinGame(id, gameName);
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

  setGrid(id: string, gameName: string, grid: Cell[][]) {
    lobbyRepository.setGrid(id, gameName, grid);
  }

  setSocket(id: string, gameName: string, socket: Socket) {
    lobbyRepository.setSocket(id, gameName, socket);
  }
}

export const lobbyService = new LobbyService();
