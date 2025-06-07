import type { Cell } from "#shared/gameTypes";
import type { ShipsConnections } from "~/utils/types/types";
import shipImg from "@/assets/img/ships.png";
import shipBrokenImg from "@/assets/img/ships-broken.png";

export const gridSize = 10;

const tileSize = 16;

export function getShipConnections(
  x: number,
  y: number,
  rows: number,
  cols: number,
  grid: Cell[][],
): ShipsConnections | undefined {
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

  return {
    left: hasLeftNeighbor,
    right: hasRightNeighbor,
    top: hasTopNeighbor,
    bottom: hasBottomNeighbor,
  };
}

let normalTileSet: HTMLImageElement | undefined = undefined;
export function getNormalTileSet() {
  if (normalTileSet) {
    return normalTileSet;
  }

  normalTileSet = new Image();
  normalTileSet.crossOrigin = "anonymous";
  normalTileSet.src = shipImg;

  return normalTileSet;
}

let brokenTileSet: HTMLImageElement | undefined = undefined;
export function getBrokenTileSet() {
  if (brokenTileSet) {
    return brokenTileSet;
  }

  brokenTileSet = new Image();
  brokenTileSet.crossOrigin = "anonymous";
  brokenTileSet.src = shipBrokenImg;

  return brokenTileSet;
}

export function getTileSetIndex(connections: ShipsConnections): number {
  const l = connections.left;
  const r = connections.right;
  const t = connections.top;
  const b = connections.bottom;

  if (!l && !r && t && b) return 1;
  if (l && r && !t && !b) return 2;
  if (!l && !r && t && !b) return 3;
  if (l && !r && !t && !b) return 4;
  if (!l && r && !t && !b) return 5;
  if (!l && !r && !t && b) return 6;
  if (!l && r && !t && b) return 7;
  if (l && !r && !t && b) return 8;
  if (!l && r && t && !b) return 9;
  if (l && !r && t && !b) return 10;
  if (l && r && t && b) return 11;
  if (l && r && !t && b) return 12;
  if (!l && r && t && b) return 13;
  if (l && r && t && !b) return 14;
  if (l && !r && t && b) return 15;
  if (!l && !r && !t && !b) return 16;

  return 17;
}

export function drawShip(
  x: number,
  y: number,
  grid: Cell[][],
  ctx: CanvasRenderingContext2D,
  tileSet: HTMLImageElement,
  cellSize: number,
) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const shipConnections = getShipConnections(x, y, rows, cols, grid);
  if (!shipConnections) return;

  const ship = grid[x]![y]!;

  const canvasX = ship.visualCord.x * cellSize;
  const canvasY = ship.visualCord.y * cellSize;

  ctx.drawImage(
    tileSet,
    16 * getTileSetIndex(shipConnections),
    0,
    tileSize,
    tileSize,
    canvasX,
    canvasY,
    cellSize,
    cellSize,
  );
}

export function drawHeaderOfGrid(
  ctx: CanvasRenderingContext2D,
  cellSize: number,
) {
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * cellSize;
      const y = j * cellSize;

      // number axis
      if (i === 0) {
        ctx.fillStyle = "black";
        ctx.fillText((j + 1).toString(), 0, y + cellSize / 2);
      }

      // letter axis
      if (j === 0) {
        ctx.fillStyle = "black";
        const char = String.fromCharCode(65 + i); // 'A' = 65
        ctx.fillText(char, x + cellSize / 2, 0);
      }
    }
  }
}

export function drawGrid(ctx: CanvasRenderingContext2D, cellSize: number) {
  ctx.strokeStyle = "#285cc4";

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * cellSize;
      const y = j * cellSize;

      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellSize, cellSize);
    }
  }
}

export function drawHitIcon(
  i: number,
  j: number,
  ctx: CanvasRenderingContext2D,
  tileSet: HTMLImageElement,
  cellSize: number,
) {
  const x = i * cellSize;
  const y = j * cellSize;

  ctx.drawImage(
    tileSet,
    16 * 18,
    0,
    tileSize,
    tileSize,
    x,
    y,
    cellSize,
    cellSize,
  );
}
