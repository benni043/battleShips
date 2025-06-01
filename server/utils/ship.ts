import type { Cell, Cord } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";

export function isCordValid(cord: Cord) {
  return !(cord.y < 0 || cord.y >= 10 || cord.x < 0 || cord.x >= 10);
}

export function isAShipOnCord(cord: Cord, grid: Cell[][]) {
  if (!isCordValid(cord)) return GameError.INVALID_CORD;

  return grid[cord.x]![cord.y]!.shipData;
}

export function setCellHit(cord: Cord, grid: Cell[][]) {
  if (!isCordValid(cord)) return GameError.INVALID_CORD;

  grid[cord.x]![cord.y]!.isHit = true;
}

export function isAlreadyHit(cord: Cord, grid: Cell[][]) {
  if (!isCordValid(cord)) return GameError.INVALID_CORD;

  return grid[cord.x]![cord.y]!.isHit;
}

export function isGameFinished(grid: Cell[][]): boolean {
  return grid.every((row) =>
    row.every((cell) => cell.shipData === undefined || cell.isHit),
  );
}
