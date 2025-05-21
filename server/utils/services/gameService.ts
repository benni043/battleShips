import type { Cord } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";
import { GameState } from "#shared/types";
import { gameRepository } from "~~/server/utils/repositories/gameRepository";

export class GameService {

  getOpponentSocket(gameName: string) {
    return gameRepository.getOpponentSocket(gameName);
  }

  handleClick(id: string, gameName: string, cord: Cord) {
    const game = lobbyService.getGameByName(gameName);

    if (game?.state === GameState.WAITING) return GameError.NOT_STARTED;

    return gameRepository.handleClick(id, gameName, cord);
  }
}

export const gameService = new GameService();
