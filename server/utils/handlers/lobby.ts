import type {Server, Socket} from 'socket.io';
import {createGame} from "~/server/utils/services/lobby.service";
import type {GameLobby, LobbyCreationResponse} from "~/shared/types";
import {GameCreationError} from "~/shared/types";

export default function handleLobbyEvents(socket: Socket, io: Server) {
    socket.on("create-game", async (gameName, cb) => {
        const lobby = await createGame(gameName, socket);

        if (lobby == GameCreationError.ALREADY_TAKEN) {
            cb({success: false, errorType: GameCreationError.ALREADY_TAKEN} as LobbyCreationResponse)
        } else if (lobby == GameCreationError.INVALID) {
            cb({success: false, errorType: GameCreationError.INVALID} as LobbyCreationResponse)
        } else {
            socket.leave("lobby");
            socket.join(gameName);

            cb({success: true, errorType: undefined} as LobbyCreationResponse);
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