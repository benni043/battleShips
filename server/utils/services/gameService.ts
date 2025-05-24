import type { Cell, Cord } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";
import { GameState } from "#shared/types";
import { gameRepository } from "~~/server/utils/repositories/gameRepository";

export class GameService {
  createGame(gameName: string, id: string, field: Cell[][]) {
    return gameRepository.createGame(gameName, id, field);
  }

  // getOpponentSocket(gameName: string) {
  //   return gameRepository.getOpponentSocket(gameName);
  // }
  //
  // handleClick(id: string, gameName: string, cord: Cord) {
  //   return gameRepository.handleClick(id, gameName, cord);
  // }
  //
  // isStarted(gameName: string) {
  //   const game = lobbyService.getGameByName(gameName);
  //
  //   if (game?.state === GameState.WAITING) return GameError.NOT_STARTED;
  // }
}

export const gameService = new GameService();
