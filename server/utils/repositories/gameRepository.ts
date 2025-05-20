import type {Cell, Cord} from "#shared/gameTypes";
import {GameError} from "#shared/gameTypes";
import type {GameLobby} from "#shared/types";

export class GameRepository {
    private gameLobby: GameLobby | undefined;

    private player1Field: Cell[][] = [];
    private player2Field: Cell[][] = [];

    private isPlayer1Active = true;

    getGameName() {
        return this.gameLobby!.gameName!;
    }

    getOpponentSocket() {
        if (this.isPlayer1Active) return this.gameLobby!.socketPlayer1;
        else return this.gameLobby!.socketPlayer2!;
    }

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

    private isAShipOnCord(cord: Cord, id: string) {
        if (
            cord.y < 0 ||
            cord.y >= this.player1Field.length ||
            cord.x < 0 ||
            cord.x >= this.player1Field[cord.y].length
        ) {
            return GameError.INVALID_CORD;
        }

        if (id === this.gameLobby?.socketPlayer1.id) {
            return this.player2Field[cord.x][cord.y].shipData;
        } else if (id === this.gameLobby?.socketPlayer2?.id) {
            return this.player1Field[cord.x][cord.y].shipData;
        }

        console.error(`Unknown game ID: ${id}`);
        return GameError.INVALID_ID;
    }

    handleClick(cord: Cord, id: string) {
        if (id === this.gameLobby!.socketPlayer1.id && this.isPlayer1Active) {
            const isShip = this.isAShipOnCord(cord, id);

            if (isShip === GameError.INVALID_CORD || isShip === GameError.INVALID_ID)
                return isShip;

            this.isPlayer1Active = false;

            return isShip;
        } else if (
            id === this.gameLobby!.socketPlayer2?.id &&
            !this.isPlayer1Active
        ) {
            const cell = this.isAShipOnCord(cord, id);

            if (cell === GameError.INVALID_CORD || cell === GameError.INVALID_ID)
                return cell;

            this.isPlayer1Active = true;

            return cell;
        }

        return GameError.WRONG_PLAYER;
    }
}
