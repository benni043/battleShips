import {gameRepository} from "~/server/utils/persistence/game.repository";
import type {Cell, Cord} from "#shared/gameTypes";
import type {GameLobby} from "#shared/types";

export class GameService {

    setGame(game: Cell[][], id: string) {
        gameRepository.setGame(game, id);
    }

    setGameLobby(gameLobby: GameLobby) {
        gameRepository.setGameLobby(gameLobby);
    }

    handleClick(cord: Cord, id: string) {
        return gameRepository.handleClick(cord, id);
    }

}

export const gameService = new GameService();