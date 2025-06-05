import type { Cell } from "~~/shared/gameTypes";

export function useDrawGrid(
  grid: MaybeRef<Cell[][]>,
  currentCell: MaybeRef<Cell | undefined>,
  canvas: MaybeRef<HTMLCanvasElement | null>,
) {
  const gridRef = toRef(grid);
  const currentCellRef = toRef(currentCell);

  const canvasRef = toRef(canvas);
  let ctx: CanvasRenderingContext2D | null = null;

  onMounted(() => {
    ctx = canvasRef.value!.getContext("2d");
    ctx!.imageSmoothingEnabled = false;

    draw();
    getNormalTileSet().onload = () => {
      draw();
    };
    getBrokenTileSet().onload = () => {
      draw();
    };
  });

  function draw() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawGrid(ctx);

    // Draw all ships except the one being moved
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (gridRef.value[x]![y]! !== currentCellRef.value) {
          const cell = gridRef.value[x]?.[y];
          if (!cell) continue;

          const shipData = cell.shipData;

          const tileset = cell.isHit ? getBrokenTileSet() : getNormalTileSet();

          if (shipData) {
            drawShip(x, y, gridRef.value, ctx!, tileset);
          } else if (cell.isHit) {
            drawHitIcon(x, y, ctx!, tileset);
          }
        }
      }
    }

    // Draw the currently moved ship last
    if (currentCellRef.value) {
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          if (
            gridRef.value[x]?.[y]?.shipData?.connectsTo ===
            currentCellRef.value.shipData?.connectsTo
          ) {
            drawShip(x, y, gridRef.value, ctx!, getNormalTileSet());
          }
        }
      }
    }
  }

  watch(
    gridRef,
    () => {
      draw();
    },
    { deep: true },
  );
}
