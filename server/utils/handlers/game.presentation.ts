import type {Socket} from "socket.io";
import {gameService} from "~/server/utils/services/game.service";
import type {GameLobby} from "#shared/types";

export class GamePresentation {

    constructor(game: GameLobby, socket: Socket) {
        socket.on("get-game", () => {
            return gameService.getGame();
        })
        
        socket.on("post-game-field", () => {
            
        })
    }

}