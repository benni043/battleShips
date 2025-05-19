import type {Socket} from "socket.io";
import type {GameLobby} from "#shared/types";
import type {Cell, Cord} from "#shared/gameTypes";
import {gameService} from "~~/server/utils/services/game";

export class Game {

    constructor(game: GameLobby) {
        gameService.setGameLobby(game);

        this.handlePostField(game.socketPlayer1);
        this.handlePostField(game.socketPlayer2!);

        game.socketPlayer2?.on("ready", () => {
            io.to(game.gameName).emit("send-field");
        })

        this.handleClick(game.socketPlayer1);
        this.handleClick(game.socketPlayer2!);
    }

    handlePostField(socket: Socket) {
        socket.on("post-field", (grid: string, cb) => {
            const parse: Cell[][] = JSON.parse(grid);

            gameService.setGame(parse, socket.id);

            cb();
        })
    }

    handleClick(socket: Socket) {
        socket.on("click", (cord: Cord, cb) => {
            cb(gameService.handleClick(cord, socket.id));
        })
    }

}