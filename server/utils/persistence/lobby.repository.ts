import type {GameLobby} from "~/shared/types";
import {GameState} from "~/shared/types";
import type {Socket} from "socket.io";

export class LobbyRepository {
    private readonly games: Map<string, GameLobby>;

    constructor() {
        this.games = new Map<string, GameLobby>();
    }

    getAllGames(): Map<string, GameLobby> {
        return this.games;
    }

    getGameByName(gameName: string): GameLobby | undefined {
        return this.games.get(gameName);
    }

    getAvailableGames(): string[] {
        return Array.from(this.games.entries())
            .filter(([_, game]) => game.state === GameState.WAITING)
            .map(([key, _]) => key);
    }

    createGame(gameName: string, socket: Socket): string {
        this.games.set(gameName, {
            socketPlayer1: socket,
            socketPlayer2: undefined,
            state: GameState.WAITING,
            gameName: gameName,
        } as GameLobby);

        return gameName;
    }

    joinGame(gameName: string, socket: Socket) {
        const game = this.games.get(gameName)!;

        game.socketPlayer2 = socket;
        game.state = GameState.STARTED;

        return gameName;
    }
}

export const lobbyRepository = new LobbyRepository();