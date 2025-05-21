import type { GameLobby, Player } from "#shared/types";
import { GameState } from "#shared/types";
import type { Socket } from "socket.io";
import type { Cell } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";

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

  createGame(id: string, gameName: string): string {
    const game = {
      gameName: gameName,
      state: GameState.WAITING,
      player1: {
        id: id,
        socket: undefined,
        field: undefined,
      } as Player,
      player2: {
        id: undefined,
        socket: undefined,
        field: undefined,
      } as Player,
      isPlayer1Active: true,
    } as GameLobby;

    this.games.set(gameName, game);

    return gameName;
  }

  joinGame(id: string, gameName: string) {
    const game = this.games.get(gameName)!;

    game.player2.id = id;

    return gameName;
  }

  setGrid(id: string, gameName: string, field: Cell[][]) {
    const game = this.games.get(gameName);

    if (!game) return GameError.INVALID_GAME;

    if (id === game.player1.id) {
      game.player1.field = field;
    } else if (id === game.player2.id) {
      game.player2.field = field;
    } else {
      return GameError.INVALID_ID;
    }

    if (game.player1.field && game.player2.field)
      game.state = GameState.STARTED;
  }

  setSocket(id: string, gameName: string, socket: Socket) {
    const game = this.games.get(gameName);

    if (!game) return GameError.INVALID_GAME;

    if (id === game.player1.id) {
      game.player1.socket = socket;
    } else if (id === game.player2.id) {
      game.player2.socket = socket;
    } else {
      return GameError.INVALID_ID;
    }
  }

  removeGame(gameName: string) {
    const game = this.games.get(gameName);

    if (!game) return GameError.INVALID_GAME;

    this.games.delete(gameName);
  }
}

export const lobbyRepository = new LobbyRepository();
