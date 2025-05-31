import type { Cell, Cord, Game, Hit, Player } from "#shared/gameTypes";
import { GameError, GameState } from "#shared/gameTypes";
import type { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

export class GameRepository {
  private readonly games = new Map<string, Game>();

  postField(gameName: string, gameId: string, id: string, field: Cell[][]) {
    if (!this.games.has(gameId)) {
      const uuid = uuidv4();

      const game: Game = {
        gameName: "dummy",
        id: uuid,
        isPlayer1Active: true,
        state: GameState.WAITING,
        player1: {
          id: id,
          field: field,
          socket: undefined,
        } as Player,
        player2: undefined,
      };

      this.games.set(gameId, game);

      return uuid;
    } else {
      const game = this.games.get(gameId)!;

      game.player2 = {
        id: id,
        field: field,
        socket: undefined,
      } as Player;

      lobbyService.removeLobby(gameId);

      return game.id;
    }
  }

  getAllGames(): string[] {
    return this.games.keys().toArray();
  }

  setSocket(id: string, gameId: string, username: string, socket: Socket) {
    const game = this.games.get(gameId)!;

    if (id === game.player1.id) {
      game.player1.socket = socket;
      game.player1.username = username;
    } else if (id === game.player2!.id) {
      game.player2!.socket = socket;
      game.player2!.username = username;
    } else return GameError.INVALID_ID;

    if (game.player1.socket && game.player2?.socket)
      game.state = GameState.STARTED;
  }

  getGameById(gameId: string) {
    return this.games.get(gameId)!;
  }

  getOpponentSocket(gameId: string) {
    const game = this.getGameById(gameId)!;

    if (game.isPlayer1Active) return game.player1!.socket!;
    else return game.player2!.socket!;
  }

  isGameStarted(gameId: string) {
    const game = this.getGameById(gameId)!;

    return game.state !== GameState.WAITING;
  }

  getCurrentPlayer(gameId: string) {
    const game = this.getGameById(gameId)!;

    if (game.isPlayer1Active) return game.player1!.username;
    else return game.player2!.username!;
  }

  getWinner(gameId: string) {
    const game = this.getGameById(gameId)!;

    if (game.isPlayer1Active) return game.player2!.username;
    else return game.player1!.username!;
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }

  tryRemove(gameId: string, socket: Socket) {
    const game = this.getGameById(gameId)!;

    if (socket.id === game.player1.socket?.id) game.player1.socket = undefined;
    else game.player2!.socket = undefined;

    if (!game.player1.socket && !game.player2?.socket) {
      this.removeGame(gameId);
    }
  }

  private isCordValid(cord: Cord) {
    return !(cord.y < 0 || cord.y >= 10 || cord.x < 0 || cord.x >= 10);
  }

  private isAShipOnCord(cord: Cord, grid: Cell[][]) {
    if (!this.isCordValid(cord)) return GameError.INVALID_CORD;

    return grid[cord.x]![cord.y]!.shipData;
  }

  private setCellHit(cord: Cord, grid: Cell[][]) {
    if (!this.isCordValid(cord)) return GameError.INVALID_CORD;

    grid[cord.x]![cord.y]!.isHit = true;
  }

  private isAlreadyHit(cord: Cord, grid: Cell[][]) {
    if (!this.isCordValid(cord)) return GameError.INVALID_CORD;

    return grid[cord.x]![cord.y]!.isHit;
  }

  private isGameFinished(grid: Cell[][]): boolean {
    return grid.every((row) =>
      row.every((cell) => cell.shipData === undefined || cell.isHit),
    );
  }

  handleClick(id: string, gameId: string, cord: Cord) {
    const game = this.getGameById(gameId)!;

    if (id === game.player1!.id && game.isPlayer1Active) {
      const field = game.player2!.field;

      if (this.isAlreadyHit(cord, field)) return GameError.ALREADY_HIT;

      const shipData = this.isAShipOnCord(cord, field);
      this.setCellHit(cord, field);

      if (shipData === GameError.INVALID_CORD) return shipData;

      game.isPlayer1Active = false;
      const gameFinished = this.isGameFinished(field);

      return { gameFinished: gameFinished, shipData: shipData } as Hit;
    } else if (id === game.player2!.id && !game.isPlayer1Active) {
      const field = game.player1.field;

      if (this.isAlreadyHit(cord, field)) return GameError.ALREADY_HIT;

      const shipData = this.isAShipOnCord(cord, field);
      this.setCellHit(cord, field);

      if (shipData === GameError.INVALID_CORD) return shipData;

      game.isPlayer1Active = true;
      const gameFinished = this.isGameFinished(field);

      return { gameFinished: gameFinished, shipData: shipData } as Hit;
    }

    return GameError.WRONG_PLAYER;
  }
}

export const gameRepository = new GameRepository();
