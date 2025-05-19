import type {Socket} from "socket.io";
import type {GameLobby} from "#shared/types";
import {Cell, Cord, GameError} from "#shared/gameTypes";
import {GameService} from "~~/server/utils/services/gameService";

export class GameHandler {

    gameService: GameService = new GameService();

    constructor(game: GameLobby) {
        this.gameService.setGameLobby(game);

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

            this.gameService.setGame(parse, socket.id);

            cb();
        })
    }

    handleClick(socket: Socket) {
        socket.on("click", (cord: Cord, cb) => {
            const cell = this.gameService.handleClick(cord, socket.id);

            cb(cell);

            if (cell !== GameError.INVALID_ID && cell !== GameError.INVALID_CORD && cell != GameError.WRONG_PLAYER)
                this.gameService.getOpponentSocket().emit("hitResponse", cord);
        })
    }

}