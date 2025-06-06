import { gridSize } from "~/utils/rendering";
import type { Cell } from "~~/shared/gameTypes";

export function useDrawGrid(
  grid: MaybeRef<Cell[][]>,
  currentCell: MaybeRef<Cell | undefined>,
  canvas: MaybeRef<HTMLCanvasElement | null>,
) {
  const gridRef = toRef(grid);
  const currentCellRef = toRef(currentCell);

  const canvasRef = toRef(canvas);

  const canvasSize = ref(0);
  useResizeObserver(
    () => canvasRef.value?.parentElement,
    (entries) => {
      const { width } = entries[0]!.contentRect;
      canvasSize.value = width;
    },
  );
  watch(canvasSize, () => {
    canvasRef.value!.height = canvasSize.value;
    canvasRef.value!.width = canvasSize.value;
    ctx!.imageSmoothingEnabled = false;
  });

  const cellSize = computed(() => canvasSize.value / gridSize);

  let ctx: CanvasRenderingContext2D | null = null;

  watch(canvasRef, () => {
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

    ctx.clearRect(0, 0, canvasSize.value, canvasSize.value);

    drawGrid(ctx, cellSize.value);

    // Draw all ships except the one being moved
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (gridRef.value[x]![y]! !== currentCellRef.value) {
          const cell = gridRef.value[x]?.[y];
          if (!cell) continue;

          const shipData = cell.shipData;

          const tileset = cell.isHit ? getBrokenTileSet() : getNormalTileSet();

          if (shipData) {
            drawShip(x, y, gridRef.value, ctx!, tileset, cellSize.value);
          } else if (cell.isHit) {
            drawHitIcon(x, y, ctx!, tileset, cellSize.value);
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
            drawShip(
              x,
              y,
              gridRef.value,
              ctx!,
              getNormalTileSet(),
              cellSize.value,
            );
          }
        }
      }
    }
  }

  watch(
    [gridRef, cellSize],
    () => {
      draw();
    },
    { deep: true },
  );

  return { cellSize };
}
