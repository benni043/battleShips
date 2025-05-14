import type {Server, Socket} from 'socket.io';
import {lobbyService} from "~/server/utils/services/lobby.service";
import type {LobbyCreationResponse} from "~/shared/types";
import {GameCreationError} from "~/shared/types";

export default function handleLobbyEvents(socket: Socket, io: Server) {
    console.log(`User: ${socket.id} connected to lobby`);

    socket.join("lobby")
    socket.to("lobby").emit("get-all-games", lobbyService.getAllGameNames());

    socket.on("create-game", (gameName, cb) => {
        const lobby = lobbyService.createGame(gameName, socket);

        if (lobby == GameCreationError.ALREADY_TAKEN) {
            cb({success: false, errorType: GameCreationError.ALREADY_TAKEN} as LobbyCreationResponse)
        } else if (lobby == GameCreationError.INVALID) {
            cb({success: false, errorType: GameCreationError.INVALID} as LobbyCreationResponse)
        } else {
            socket.leave("lobby");
            socket.join(gameName);

            cb({success: true, errorType: undefined} as LobbyCreationResponse);
            io.to("lobby").emit("new-game", lobby);
        }
    });
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