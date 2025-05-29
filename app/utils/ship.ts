import type { Cell } from "#shared/gameTypes";
import type { ShipsConnections } from "~/utils/types";
import shipImg from "@/assets/img/ships.png";

export const gridSize = 10;

export const labelMargin = 30;
export const baseSize = 400;

export const canvasWidth = baseSize + labelMargin;
export const canvasHeight = baseSize + labelMargin;
export const cellSize = baseSize / gridSize;

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

export function getTileSet() {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = shipImg;

  return image;
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
) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const shipConnections = getShipConnections(x, y, rows, cols, grid);
  if (!shipConnections) return;

  const ship = grid[x]![y]!;

  const canvasX = ship.visualCord.x * cellSize + labelMargin;
  const canvasY = ship.visualCord.y * cellSize + labelMargin;

  const image = getTileSet();

  ctx.drawImage(
    image,
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

export function drawHeaderOfGrid(ctx: CanvasRenderingContext2D) {
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#249fde";
  ctx.fillRect(labelMargin, labelMargin, canvasWidth, canvasHeight);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * cellSize + labelMargin;
      const y = j * cellSize + labelMargin;

      ctx.strokeStyle = "#285cc4";
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
