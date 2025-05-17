import type {Cell} from "#shared/gameTypes";

export class GameRepository {

    private game: Cell[][] = []

    getGame() {
        return this.game;
    }
}

export const gameRepository = new GameRepository();