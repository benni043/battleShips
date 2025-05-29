import type { Cell } from "#shared/gameTypes";
import type { ShipsConnections } from "~/utils/types";

export const gridSize = 10;

export const labelMargin = 30;
export const baseSize = 400;

export const canvasWidth = baseSize + labelMargin;
export const canvasHeight = baseSize + labelMargin;
export const cellSize = baseSize / gridSize;

export function getShipConnections(
  x: number,
  y: number,
  rows: number,
  cols: number,
  grid: Cell[][],
) {
  const shipData = grid[x]?.[y]?.shipData;
  if (!shipData) return;

  const hasTopNeighbor =
    y > 0 && grid[x]?.[y - 1]?.shipData?.connectsTo === shipData.connectsTo;

  const hasBottomNeighbor =
    y < rows - 1 &&
    grid[x]?.[y + 1]?.shipData?.connectsTo === shipData.connectsTo;

  const hasLeftNeighbor =
    x > 0 && grid[x - 1]?.[y]?.shipData?.connectsTo === shipData.connectsTo;

  const hasRightNeighbor =
    x < cols - 1 &&
    grid[x + 1]?.[y]?.shipData?.connectsTo === shipData.connectsTo;

  const left = hasLeftNeighbor ? 0 : 5;
  const right = hasRightNeighbor ? 0 : 5;
  const top = hasTopNeighbor ? 0 : 5;
  const bottom = hasBottomNeighbor ? 0 : 5;

  return {
    left: left,
    right: right,
    top: top,
    bottom: bottom,
  } as ShipsConnections;
}

export function drawShip(
  x: number,
  y: number,
  grid: Cell[][],
  ctx: CanvasRenderingContext2D,
) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const shipConnections = getShipConnections(x, y, rows, cols, grid);
  if (!shipConnections) return;

  const ship = grid[x]![y]!;

  ctx.fillRect(
    ship.visualCord.x * cellSize + shipConnections.left + labelMargin,
    ship.visualCord.y * cellSize + shipConnections.top + labelMargin,
    cellSize - shipConnections.left - shipConnections.right,
    cellSize - shipConnections.top - shipConnections.bottom,
  );
}

export function drawHeaderOfGrid(ctx: CanvasRenderingContext2D) {
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * cellSize + labelMargin;
      const y = j * cellSize + labelMargin;

      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellSize, cellSize);

      // number axis
      if (i === 0) {
        ctx.fillStyle = "black";
        ctx.fillText((j + 1).toString(), labelMargin / 2, y + cellSize / 2);
      }

      // letter axis
      if (j === 0) {
        ctx.fillStyle = "black";
        const char = String.fromCharCode(65 + i); // 'A' = 65
        ctx.fillText(char, x + cellSize / 2, labelMargin / 2);
      }
    }
  }
}
