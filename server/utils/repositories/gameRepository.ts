import type {
  Cell,
  Cord,
  Game,
  Hit,
  Player,
  GameResponse,
} from "#shared/gameTypes";
import { GameError, GameState } from "#shared/gameTypes";
import type { Socket } from "socket.io";
import type { LobbyPlayer } from "#shared/lobbyTypes";

export class GameRepository {
  private readonly games = new Map<string, Game>();

  addGame(
    player1: LobbyPlayer,
    player2: LobbyPlayer,
    gameId: string,
    gameName: string,
  ) {
    const game: Game = {
      gameName: gameName,
      id: gameId,
      isPlayer1Active: true,
      state: GameState.WAITING,
      player1: {
        id: player1.id,
        username: player1.name,
        socket: undefined,
        field: undefined,
      } as Player,
      player2: {
        id: player2.id,
        username: player2.name,
        socket: undefined,
        field: undefined,
      } as Player,
    };

    this.games.set(gameId, game);

    return { gameId, gameName } as GameResponse;
  }

  postField(gameId: string, playerId: string, field: Cell[][]) {
    const game = this.games.get(gameId)!;

    if (playerId === game.player1.id) game.player1.field = field;
    else game.player2!.field = field;

    return game.id;
  }

  setSocket(playerId: string, gameId: string, socket: Socket) {
    const game = this.games.get(gameId)!;

    if (playerId === game.player1.id) game.player1.socket = socket;
    else game.player2!.socket = socket;

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

  getOpponent(gameId: string, playerId: string) {
    const game = this.getGameById(gameId)!;

    if (game.player1.id === playerId) return game.player1!.username!;
    else if (game.player2?.id === playerId) return game.player2!.username!;
    else return GameError.INVALID_ID;
  }

  getGameState(gameId: string) {
    const game = this.getGameById(gameId)!;

    return game.state;
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
      const field = game.player2!.field!;

      if (this.isAlreadyHit(cord, field)) return GameError.ALREADY_HIT;

      const shipData = this.isAShipOnCord(cord, field);
      this.setCellHit(cord, field);

      if (shipData === GameError.INVALID_CORD) return shipData;

      game.isPlayer1Active = false;
      const gameFinished = this.isGameFinished(field);

      if (gameFinished) game.state = GameState.FINISHED;

      return { gameFinished: gameFinished, shipData: shipData } as Hit;
    } else if (id === game.player2!.id && !game.isPlayer1Active) {
      const field = game.player1.field!;

      if (this.isAlreadyHit(cord, field)) return GameError.ALREADY_HIT;

      const shipData = this.isAShipOnCord(cord, field);
      this.setCellHit(cord, field);

      if (shipData === GameError.INVALID_CORD) return shipData;

      game.isPlayer1Active = true;
      const gameFinished = this.isGameFinished(field);

      if (gameFinished) game.state = GameState.FINISHED;

      return { gameFinished: gameFinished, shipData: shipData } as Hit;
    }

    return GameError.WRONG_PLAYER;
  }
}

export const gameRepository = new GameRepository();
