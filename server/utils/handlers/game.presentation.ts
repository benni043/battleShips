import type {Socket} from "socket.io";
import type {GameLobby} from "#shared/types";
import type {Cell} from "#shared/gameTypes";

export class GamePresentation {

    constructor(game: GameLobby) {
        this.handlePostField(game.socketPlayer1);
        this.handlePostField(game.socketPlayer2!);

        game.socketPlayer2?.on("ready", () => {
            io.to(game.gameName).emit("send-field");
        })
    }

    handlePostField(socket: Socket) {
        socket.on("post-field", (grid: string, cb) => {
            const parse: Cell[][] = JSON.parse(grid);

            cb();
        })
    }

}