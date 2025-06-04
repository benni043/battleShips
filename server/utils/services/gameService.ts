import type { Cell, Cord } from "#shared/gameTypes";
import { GameError, GameState } from "#shared/gameTypes";
import { gameRepository } from "~~/server/utils/repositories/gameRepository";
import type { Socket } from "socket.io";
import type { LobbyPlayer } from "~~/server/utils/types/lobbyTypes";

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

  setReady(gameId: string, playerId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.setReady(gameId, playerId);
  }

  getReady(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getReady(gameId);
  }

  setSocket(id: string, gameId: string, socket: Socket) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    gameRepository.setSocket(id, gameId, socket);

    if (
      game.player1.socket &&
      game.player2?.socket &&
      game.state === GameState.WAITING
    )
      gameRepository.changeGameState(gameId, GameState.STARTED);
  }

  getOpponentSocket(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getOpponentSocket(gameId);
  }

  getAllRunningGamesForPlayer(playerId: string) {
    return gameRepository.getAllRunningGamesForPlayer(playerId);
  }

  handleClick(id: string, gameId: string, cord: Cord) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.handleClick(id, gameId, cord);
  }

  getGameById(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return game;
  }

  getMyField(gameId: string, playerId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getMyField(gameId, playerId);
  }

  getOpponentField(gameId: string, playerId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getOpponentField(gameId, playerId);
  }

  getOpponentUserName(gameId: string, playerId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getOpponentUserName(gameId, playerId);
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

  remove(gameId: string) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.removeGame(gameId);
  }

  tryRemove(gameId: string, socket: Socket) {
    const game = gameRepository.getGameById(gameId);

    if (!game) return GameError.INVALID_GAME;
    //todo with login
    // if (
    //   socket.id !== game.player1.socket?.id &&
    //   socket.id !== game.player2!.socket?.id
    // )
    //   return GameError.INVALID_ID;

    return gameRepository.tryRemove(gameId, socket);
  }

  getGameState(gameId: string) {
    const game = gameRepository.getGameById(gameId)!;

    if (!game) return GameError.INVALID_GAME;

    return gameRepository.getGameState(gameId);
  }
}

export const gameService = new GameService();
