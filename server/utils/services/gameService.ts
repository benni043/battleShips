import type { Cell, Cord } from "#shared/gameTypes";
import { GameError, GameState } from "#shared/gameTypes";
import { gameRepository } from "~~/server/utils/repositories/gameRepository";
import type { Socket } from "socket.io";

export class GameService {
  postField(gameName: string, gameId: string, id: string, field: Cell[][]) {
    return gameRepository.postField(gameName, gameId, id, field);
  }

  setSocket(id: string, gameId: string, username: string, socket: Socket) {
    return gameRepository.setSocket(id, gameId, username, socket);
  }

  getOpponentSocket(gameId: string) {
    return gameRepository.getOpponentSocket(gameId);
  }

  handleClick(id: string, gameId: string, cord: Cord) {
    return gameRepository.handleClick(id, gameId, cord);
  }

  isStarted(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    return !(!game || game!.state === GameState.WAITING);
  }

  removeGame(gameId: string) {
    return gameRepository.removeGame(gameId);
  }

  getGameByName(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return game;
  }

  getCurrentPlayer(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getCurrentPlayer(gameId);
  }

  getWinner(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getWinner(gameId);
  }

  tryRemove(gameId: string, socket: Socket) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;
    if (
      socket.id !== game.player1.socket?.id &&
      socket.id !== game.player2!.socket?.id
    )
      return GameError.INVALID_ID;

    gameRepository.tryRemove(gameId, socket);
  }

  isGameStarted(gameId: string) {
    const game = gameRepository.getGameById(gameId)!;

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.isGameStarted(gameId);
  }

  getAllGames(): string[] {
    return gameRepository.getAllGames();
  }
}

export const gameService = new GameService();
