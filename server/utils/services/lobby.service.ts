import {GameCreationError} from "~/shared/types";
import type {Socket} from "socket.io";
import {lobbyRepository} from "~/server/utils/persistence/lobby.repository";

export class LobbyService {
    getAllGameNames() {
        return lobbyRepository.getAllGameNames();
    }

    createGame(gameName: string, socket: Socket) {
        if (!this.isGameNameAvailable(gameName)) return GameCreationError.ALREADY_TAKEN;
        if (!this.isGameNameValid(gameName)) return GameCreationError.INVALID;

        return lobbyRepository.createGame(gameName, socket);
    }

    isGameNameAvailable(gameName: string) {
        const lobbies = lobbyRepository.getAllGames();

        return !lobbies.has(gameName);
    }

    isGameNameValid(gameName: string): boolean {
        const minLength = 3
        const maxLength = 20
        const validNameRegex = /^[a-zA-Z0-9]+$/

        return (gameName.length >= minLength && gameName.length <= maxLength && validNameRegex.test(gameName))
    }
}

export const lobbyService = new LobbyService();