import type { Cell } from "#shared/gameTypes";
import type { Game, Player } from "#shared/types";
import { GameState } from "#shared/types";

export class GameRepository {
  private readonly games = new Map<string, Game>();

  createGame(gameName: string, id: string, field: Cell[][]) {
    const game = {
      gameName: gameName,
      isPlayer1Active: true,
      state: GameState.WAITING,
      player1: {
        id: id,
        field: field,
        socket: undefined,
      } as Player,
      player2: undefined,
    } as Game;

    this.games.set(gameName, game);

    return gameName;
  }

  // getOpponentSocket(gameName: string) {
  //   const game = lobbyRepository.getGameByName(gameName)!;
  //
  //   if (game.isPlayer1Active) return game.player1!.socket!;
  //   else return game.player2!.socket!;
  // }
  //
  // private isCordValid(cord: Cord) {
  //   return !(cord.y < 0 || cord.y >= 10 || cord.x < 0 || cord.x >= 10);
  // }
  //
  // private isAShipOnCord(cord: Cord, grid: Cell[][]) {
  //   if (!this.isCordValid(cord)) return GameError.INVALID_CORD;
  //
  //   return grid[cord.x]![cord.y]!.shipData;
  // }
  //
  // private setCellHit(cord: Cord, grid: Cell[][]) {
  //   if (!this.isCordValid(cord)) return GameError.INVALID_CORD;
  //
  //   grid[cord.x]![cord.y]!.isHit = true;
  // }
  //
  // private isAlreadyHit(cord: Cord, grid: Cell[][]) {
  //   if (!this.isCordValid(cord)) return GameError.INVALID_CORD;
  //
  //   return grid[cord.x]![cord.y]!.isHit;
  // }
  //
  // private isGameFinished(grid: Cell[][]): boolean {
  //   return grid.every((row) =>
  //     row.every((cell) => cell.shipData === undefined || cell.isHit),
  //   );
  // }
  //
  // handleClick(id: string, gameName: string, cord: Cord) {
  //   const game = lobbyRepository.getGameByName(gameName)!;
  //
  //   if (id === game.player1!.id && game.isPlayer1Active) {
  //     const field = game.player2.field!;
  //
  //     if (this.isAlreadyHit(cord, field)) return GameError.ALREADY_HIT;
  //
  //     const shipData = this.isAShipOnCord(cord, field);
  //     this.setCellHit(cord, field);
  //
  //     if (shipData === GameError.INVALID_CORD) return shipData;
  //
  //     game.isPlayer1Active = false;
  //     const gameFinished = this.isGameFinished(field);
  //
  //     return { gameFinished: gameFinished, shipData: shipData } as Hit;
  //   } else if (id === game.player2!.id && !game.isPlayer1Active) {
  //     const field = game.player1.field!;
  //
  //     if (this.isAlreadyHit(cord, field)) return GameError.ALREADY_HIT;
  //
  //     const shipData = this.isAShipOnCord(cord, field);
  //     this.setCellHit(cord, field);
  //
  //     if (shipData === GameError.INVALID_CORD) return shipData;
  //
  //     game.isPlayer1Active = true;
  //     const gameFinished = this.isGameFinished(field);
  //
  //     return { gameFinished: gameFinished, shipData: shipData } as Hit;
  //   }
  //
  //   return GameError.WRONG_PLAYER;
  // }
}

export const gameRepository = new GameRepository();
