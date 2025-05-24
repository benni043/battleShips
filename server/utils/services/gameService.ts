import { Cell, Cord, GameError } from "#shared/gameTypes";
import { gameRepository } from "~~/server/utils/repositories/gameRepository";
import type { Socket } from "socket.io";
import { GameState } from "#shared/gameTypes";

export class GameService {
  postField(gameName: string, id: string, field: Cell[][]) {
    return gameRepository.postField(gameName, id, field);
  }

  setSocket(id: string, gameName: string, socket: Socket) {
    return gameRepository.setSocket(id, gameName, socket);
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

  tryRemove(gameName: string, socket: Socket) {
    const game = gameRepository.getGameByName(gameName);

    if (!game) return GameError.INVALID_GAME;
    if (socket.id !== game.player1.socket!.id && socket.id !== game.player2!.socket!.id)
      return GameError.INVALID_ID;

    gameRepository.tryRemove(gameName, socket);
  }
}

export const gameService = new GameService();
