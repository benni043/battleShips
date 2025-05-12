import type {GameLobby} from "~/shared/types";
import type {Socket} from "socket.io";

const games = new Map<string, GameLobby>()

export function getAllGames() {
    return games;
}

export function createGameInMemory(gameName: string, socket: Socket) {
    games.set(gameName, {socketPlayer1: socket, socketPlayer2: undefined} as GameLobby);
    return gameName
}
