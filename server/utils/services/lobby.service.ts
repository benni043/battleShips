import {createGameInMemory, getAllGames} from "~/server/utils/persistence/lobby.repository";
import {GameCreationError} from "~/shared/types";
import type {Socket} from "socket.io";

export async function createGame(gameName: string, socket: Socket) {
    if (!isGameNameAvailable(gameName)) return GameCreationError.ALREADY_TAKEN;
    if (!isGameNameValid(gameName)) return GameCreationError.INVALID;

    return createGameInMemory(gameName, socket);
}

function isGameNameAvailable(gameName: string) {
    const lobbies = getAllGames();

    return !lobbies.has(gameName);
}

function isGameNameValid(gameName: string): boolean {
    const minLength = 3
    const maxLength = 20
    const validNameRegex = /^[a-zA-Z0-9]+$/

    return (gameName.length >= minLength && gameName.length <= maxLength && validNameRegex.test(gameName))
}