import type { Cell, Cord } from "#shared/gameTypes";
import { GameError, GameState } from "#shared/gameTypes";
import { gameRepository } from "~~/server/utils/repositories/gameRepository";
import type { Socket } from "socket.io";

export class GameService {
  postField(gameName: string, id: string, field: Cell[][]) {
    return gameRepository.postField(gameName, id, field);
  }

  setSocket(id: string, gameName: string, username: string, socket: Socket) {
    return gameRepository.setSocket(id, gameName, username, socket);
  }

  getOpponentSocket(gameName: string) {
    return gameRepository.getOpponentSocket(gameName);
  }

  handleClick(id: string, gameName: string, cord: Cord) {
    return gameRepository.handleClick(id, gameName, cord);
  }

  isStarted(gameName: string) {
    const game = gameRepository.getGameByName(gameName);

    return !(!game || game!.state === GameState.WAITING);
  }

  removeGame(gameName: string) {
    return gameRepository.removeGame(gameName);
  }

  getGameByName(gameName: string) {
    const game = gameRepository.getGameByName(gameName);

    if (!game) return GameError.INVALID_GAME;

    return game;
  }

  getCurrentPlayer(gameName: string) {
    const game = gameRepository.getGameByName(gameName);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getCurrentPlayer(gameName);
  }

  tryRemove(gameName: string, socket: Socket) {
    const game = gameRepository.getGameByName(gameName);

    if (!game) return GameError.INVALID_GAME;
    if (
      socket.id !== game.player1.socket?.id &&
      socket.id !== game.player2!.socket?.id
    )
      return GameError.INVALID_ID;

    gameRepository.tryRemove(gameName, socket);
  }

  isGameStarted(gameName: string) {
    const game = gameRepository.getGameByName(gameName)!;

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.isGameStarted(gameName);
  }

  getAllGames(): string[] {
    return gameRepository.getAllGames();
  }
}

export const gameService = new GameService();
