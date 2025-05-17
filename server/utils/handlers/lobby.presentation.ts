import type {Server, Socket} from 'socket.io';
import {lobbyService} from "~/server/utils/services/lobby.service";
import type {GameCreationOrJoinResponse} from "~/shared/types";
import {GameCreationError, GameJoinError} from "~/shared/types";

export default function handleLobbyEvents(socket: Socket, io: Server) {
    console.log(`User: ${socket.id} connected to lobby`);

    socket.join("lobby")
    io.to("lobby").emit("get-all-games", lobbyService.getAvailableGames());

    socket.on("create-game", (gameName, cb) => {
        const game = lobbyService.createGame(gameName, socket);

        if (game == GameCreationError.ALREADY_TAKEN) {
            cb(GameCreationError.ALREADY_TAKEN)
        } else if (game == GameCreationError.INVALID) {
            cb(GameCreationError.INVALID)
        } else {
            socket.leave("lobby");
            socket.join(gameName);

            cb({gameName: gameName} as GameCreationOrJoinResponse);
            io.to("lobby").emit("new-game", game);
        }
    });

    socket.on("join-game", (gameName, cb) => {
        const game = lobbyService.joinGame(gameName, socket);

        if (game == GameJoinError.FULL) {
            cb(GameJoinError.FULL)
        } else {
            socket.leave("lobby");
            socket.join(gameName);

            cb({gameName: gameName} as GameCreationOrJoinResponse);
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