import type {Server, Socket} from 'socket.io';
import type {GameCreationOrJoinResponse} from "~~/shared/types";
import {GameCreationError, GameJoinError} from "~~/shared/types";
import {lobbyService} from "~~/server/utils/services/lobby";
import {Game} from "~~/server/utils/handlers/game";

export function handleLobbyEvents(socket: Socket, io: Server) {
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
            new Game(lobbyService.getGameByName(gameName)!);

            socket.leave("lobby");
            socket.join(gameName);

            cb({gameName: gameName} as GameCreationOrJoinResponse);
            io.to("lobby").emit("remove-game", game);
        }
    })
}