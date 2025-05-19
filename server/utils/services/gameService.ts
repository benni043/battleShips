import type {Cell, Cord} from "#shared/gameTypes";
import type {GameLobby} from "#shared/types";
import {GameRepository} from "~~/server/utils/repositories/gameRepository";

export class GameService {

    gameRepository: GameRepository = new GameRepository();

    getGameName() {
        return this.gameRepository.getGameName();
    }

    getOpponentSocket() {
        return this.gameRepository.getOpponentSocket();
    }

    setGame(game: Cell[][], id: string) {
        this.gameRepository.setGame(game, id);
    }

    setGameLobby(gameLobby: GameLobby) {
        this.gameRepository.setGameLobby(gameLobby);
    }

    handleClick(cord: Cord, id: string) {
        return this.gameRepository.handleClick(cord, id);
    }

}