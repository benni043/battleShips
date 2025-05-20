import type { Cell, Cord, Hit } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";
import type { GameLobby } from "#shared/types";

export class GameRepository {
  private gameLobby: GameLobby | undefined;

  private player1Field: Cell[][] = [];
  private player2Field: Cell[][] = [];

  private isPlayer1Active = true;

  getGameName() {
    return this.gameLobby!.gameName!;
  }

  getOpponentSocket() {
    if (this.isPlayer1Active) return this.gameLobby!.socketPlayer1;
    else return this.gameLobby!.socketPlayer2!;
  }

  setGame(game: Cell[][], id: string) {
    if (id === this.gameLobby?.socketPlayer1.id) {
      this.player1Field = game;
    } else if (id === this.gameLobby?.socketPlayer2?.id) {
      this.player2Field = game;
    } else {
      console.error(`Unknown game ID: ${id}`);
      return;
    }
  }

  setGameLobby(gameLobby: GameLobby) {
    this.gameLobby = gameLobby;
  }

  private isCordValid(cord: Cord) {
    return !(
      cord.y < 0 ||
      cord.y >= this.player1Field.length ||
      cord.x < 0 ||
      cord.x >= this.player1Field[cord.y]!.length
    );
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

  handleClick(cord: Cord, id: string) {
    if (id === this.gameLobby!.socketPlayer1.id && this.isPlayer1Active) {
      if (this.isAlreadyHit(cord, this.player2Field))
        return GameError.ALREADY_HIT;

      const shipData = this.isAShipOnCord(cord, this.player2Field);
      this.setCellHit(cord, this.player2Field);

      if (shipData === GameError.INVALID_CORD) return shipData;

      this.isPlayer1Active = false;
      const gameFinished = this.isGameFinished(this.player2Field);

      return { gameFinished: gameFinished, shipData: shipData } as Hit;
    } else if (
      id === this.gameLobby!.socketPlayer2?.id &&
      !this.isPlayer1Active
    ) {
      if (this.isAlreadyHit(cord, this.player1Field))
        return GameError.ALREADY_HIT;

      const shipData = this.isAShipOnCord(cord, this.player1Field);
      this.setCellHit(cord, this.player1Field);

      if (shipData === GameError.INVALID_CORD) return shipData;

      this.isPlayer1Active = true;
      const gameFinished = this.isGameFinished(this.player1Field);

      return { gameFinished: gameFinished, shipData: shipData } as Hit;
    }

    return GameError.WRONG_PLAYER;
  }
}
