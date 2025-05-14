import type {Server, Socket} from 'socket.io';
import {lobbyService} from "~/server/utils/services/lobby.service";
import type {GameJoinResponse, GameCreationResponse} from "~/shared/types";
import {GameCreationError, GameJoinError} from "~/shared/types";

export default function handleLobbyEvents(socket: Socket, io: Server) {
    console.log(`User: ${socket.id} connected to lobby`);

    socket.join("lobby")
    socket.to("lobby").emit("get-all-games", lobbyService.getAllGameNames());

    socket.on("create-game", (gameName, cb) => {
        const game = lobbyService.createGame(gameName, socket);

        if (game == GameCreationError.ALREADY_TAKEN) {
            cb({success: false, errorType: GameCreationError.ALREADY_TAKEN} as GameCreationResponse)
        } else if (game == GameCreationError.INVALID) {
            cb({success: false, errorType: GameCreationError.INVALID} as GameCreationResponse)
        } else {
            socket.leave("lobby");
            socket.join(gameName);

            cb({success: true, errorType: undefined} as GameCreationResponse);
            io.to("lobby").emit("new-game", game);
        }
    });

    socket.on("join-game", (gameName, cb) => {
        const game = lobbyService.joinGame(gameName, socket);

        if (game == GameJoinError.FULL) {
            cb({success: false, errorType: GameJoinError.FULL} as GameJoinResponse)
        } else {
            socket.leave("lobby");
            socket.join(gameName);

            cb({success: true, errorType: undefined} as GameCreationResponse);
            io.to("lobby").emit("remove-game", game);
        }
    })
}

// export class Game {
//
//     grid = new Map<string, Lobby>()
//
//     constructor(socket: Socket) {
//         socket.on("click", () => {
//             "asdf"
//
//             this.grid.has("")
//         })
//     }
// }