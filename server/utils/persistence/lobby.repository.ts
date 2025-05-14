import type { GameLobby } from "~/shared/types";
import type { Socket } from "socket.io";

export class LobbyRepository {
    private games: Map<string, GameLobby>;

    constructor() {
        this.games = new Map<string, GameLobby>();
    }

    getAllGames(): Map<string, GameLobby> {
        return this.games;
    }

    getAllGameNames(): string[] {
        return Array.from(this.games.keys());
    }

    createGame(gameName: string, socket: Socket): string {
        this.games.set(gameName, {
            socketPlayer1: socket,
            socketPlayer2: undefined
        } as GameLobby);
        return gameName;
    }

    // // Optional: mehr Methoden, z.B. zum Löschen, Beitreten etc.
    // deleteGame(gameName: string): boolean {
    //     return this.games.delete(gameName);
    // }
    //
    // joinGame(gameName: string, socket: Socket): boolean {
    //     const game = this.games.get(gameName);
    //     if (!game || game.socketPlayer2) return false;
    //
    //     game.socketPlayer2 = socket;
    //     return true;
    // }
}

export const lobbyRepository = new LobbyRepository();