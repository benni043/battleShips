import type {Socket} from "socket.io";
import type {GameLobby} from "#shared/types";
import type {Cell} from "#shared/gameTypes";

export class GamePresentation {

    constructor(game: GameLobby) {
        console.log("created game")

        this.handlePostField(game.socketPlayer1);
        this.handlePostField(game.socketPlayer2!);

        // game.socketPlayer1.emit("send-field");
        // game.socketPlayer2!.emit("send-field");
    }

    handlePostField(socket: Socket) {
        socket.on("post-field", (grid: string) => {
            const parse: Cell[][] = JSON.parse(grid);

            console.log(socket.id);
        })

        socket.emit("send-field");
    }

}