import {gameRepository} from "~/server/utils/persistence/game.repository";

export class GameService {

    getGame() {
        return gameRepository.getGame();
    }

}

export const gameService = new GameService();