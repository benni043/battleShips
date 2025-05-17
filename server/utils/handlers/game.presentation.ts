import type {Socket} from "socket.io";
import {gameService} from "~/server/utils/services/game.service";
import type {GameLobby} from "#shared/types";
import type {Cell} from "#shared/gameTypes";

export class GamePresentation {

    constructor(game: GameLobby, socket: Socket) {
        console.log(socket.id);

        socket.on("get-game", () => {
            return gameService.getGame();
        })

        socket.on("post-field", (grid: string) => {
            const parse: Cell[][] = JSON.parse(grid);

            console.log(parse);
        })
    }

    foo() {
        console.log()
    }

}