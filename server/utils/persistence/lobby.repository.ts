import type {GameLobby} from "~/shared/types";
import type {Socket} from "socket.io";

export class LobbyRepository {
    private games: Map<string, GameLobby>;

    constructor() {
        this.games = new Map<string, GameLobby>();
    }

    getAllGames(): Map<string, GameLobby> {
        return this.games;
    }

    getGameByName(gameName: string): GameLobby | undefined {
        return this.games.get(gameName);
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

    joinGame(gameName: string, socket: Socket) {
        const game = this.games.get(gameName)!;

        game.socketPlayer2 = socket;

        return gameName;
    }
}

export const lobbyRepository = new LobbyRepository();