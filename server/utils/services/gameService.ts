import type { Cell, Cord } from "#shared/gameTypes";
import { GameError, GameState } from "#shared/gameTypes";
import { gameRepository } from "~~/server/utils/repositories/gameRepository";
import type { Socket } from "socket.io";
import type { LobbyPlayer } from "#shared/lobbyTypes";

export class GameService {
  addGame(
    player1: LobbyPlayer,
    player2: LobbyPlayer,
    gameId: string,
    gameName: string,
  ) {
    return gameRepository.addGame(player1, player2, gameId, gameName);
  }

  postField(gameId: string, id: string, field: Cell[][]) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.postField(gameId, id, field);
  }

  setSocket(id: string, gameId: string, socket: Socket) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.setSocket(id, gameId, socket);
  }

  getOpponentSocket(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getOpponentSocket(gameId);
  }

  getOpponent(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getOpponent(gameId);
  }

  handleClick(id: string, gameId: string, cord: Cord) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.handleClick(id, gameId, cord);
  }

  // removeGame(gameId: string) {
  //   const game = gameRepository.getGameById(gameId);
  //
  //   if (!game) return GameError.INVALID_GAME;
  //
  //   return gameRepository.removeGame(gameId);
  // }

  getGameById(gameId: string) {
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

  getGameState(gameId: string) {
    const game = gameRepository.getGameById(gameId)!;

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getGameState(gameId);
  }
}

export const gameService = new GameService();
