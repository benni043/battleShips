import {Cell, Cord, FieldType, GameError, HitResponse} from "#shared/gameTypes";
import type {GameLobby} from "#shared/types";

export class Game {

    private gameLobby: GameLobby | undefined;

    private player1Field: Cell[][] = []
    private player2Field: Cell[][] = []

    private isPlayer1Active = true;

    setGame(game: Cell[][], id: string) {
        if (id === this.gameLobby?.socketPlayer1.id) {
            this.player1Field = game;
        } else if (id === this.gameLobby?.socketPlayer2?.id) {
            this.player2Field = game;
        } else {
            console.error(`Unknown game ID: ${id}`);
            return;
        }
    }

    setGameLobby(gameLobby: GameLobby) {
        this.gameLobby = gameLobby;
    }

    private checkCell(cord: Cord, id: string) {
        if (cord.y < 0
            || cord.y >= this.player1Field.length
            || cord.x < 0 || cord.x >= this.player1Field[cord.y].length) {
            return GameError.INVALID_CORD;
        }

        let cell;

        if (id === this.gameLobby?.socketPlayer1.id) {
            cell = this.player1Field[cord.y][cord.x];
        } else if (id === this.gameLobby?.socketPlayer2?.id) {
            cell = this.player2Field[cord.y][cord.x];
        } else {
            console.error(`Unknown game ID: ${id}`);
            return GameError.INVALID_ID;
        }

        if (cell.type.fieldType === FieldType.SHIP) {
            return FieldType.SHIP;
        } else {
            return FieldType.WATER;
        }
    }

    handleClick(cord: Cord, id: string) {
        if (id === this.gameLobby!.socketPlayer1.id && this.isPlayer1Active) {
            const type = this.checkCell(cord, id);

            if (type === GameError.INVALID_CORD
                || type === GameError.INVALID_ID) return type;

            this.isPlayer1Active = false;

            return {cord: cord, fieldType: type} as HitResponse;
        } else if (id === this.gameLobby!.socketPlayer2?.id && !this.isPlayer1Active) {
            const type = this.checkCell(cord, id);

            if (type === GameError.INVALID_CORD
                || type === GameError.INVALID_ID) return type;

            this.isPlayer1Active = true;

            return {cord: cord, fieldType: type} as HitResponse;
        }

        return GameError.WRONG_PLAYER;
    }
}

export const gameRepository = new Game();