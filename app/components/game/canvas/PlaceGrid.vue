<script setup lang="ts">
import { useMyGridStore } from "~/stores/myGrid";
import type { Cell } from "#shared/gameTypes";
import {
  canvasHeight,
  canvasWidth,
  cellSize,
  gridSize,
  labelMargin,
} from "~/utils/rendering";
import { initNormal, initRussian } from "~/utils/initShips";
import { toast } from "vue-sonner";
import { GameMode, PlaceState } from "~/utils/types";

const gridStore = useMyGridStore();

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

const grid: Ref<Cell[][]> = ref([]);
const currentCell: Ref<Cell | undefined> = ref(undefined);

let mouseDownPos: { x: number; y: number } | undefined;

useDrawGrid(grid, currentCell, canvas);

const gameMode = GameMode.RUSSIAN;

function initGrid() {
  for (let x = 0; x < gridSize; x++) {
    grid.value.push([]);

    for (let y = 0; y < gridSize; y++) {
      grid.value[x]!.push({
        shipData: undefined,
        isHit: false,
        visualCord: { x: x, y: y },
        gridCord: { x: x, y: y },
      } as Cell);
    }
  }
}

function initShips() {
  switch (gameMode) {
    case GameMode.RUSSIAN: {
      initRussian(grid.value);
      break;
    }
    default: {
      initNormal(grid.value);
    }
  }
}

initGrid();
initShips();

onMounted(() => {
  gridStore.grid = grid.value;

  canvas.value!.addEventListener("mousedown", mouseDown);
  canvas.value!.addEventListener("mousemove", mouseMove);
  canvas.value!.addEventListener("mouseup", mouseUp);
  canvas.value!.addEventListener("mouseleave", handleLostFocus);

  window.addEventListener("blur", handleLostFocus);
});

function mouseGridPosition(event: MouseEvent): { x: number; y: number } {
  const rect = canvas.value!.getBoundingClientRect();

  const calcX = event.clientX - rect.left - labelMargin;
  const calcY = event.clientY - rect.top - labelMargin;

  return {
    x: calcX / cellSize,
    y: calcY / cellSize,
  };
}

const mouseDown = (event: MouseEvent) => {
  currentCell.value = undefined;
  mouseDownPos = undefined;

  const mousePos = mouseGridPosition(event);

  if (mousePos.x < 0 || mousePos.y < 0) return;

  const x = Math.floor(mousePos.x);
  const y = Math.floor(mousePos.y);

  if (x >= gridSize || y >= gridSize) return;

  if (!grid.value[x]![y]!.shipData) return;

  currentCell.value = grid.value[x]![y];
  mouseDownPos = mousePos;
};

const mouseMove = (event: MouseEvent) => {
  if (!currentCell.value) return;

  const mousePos = mouseGridPosition(event);

  const diffX = mousePos.x - mouseDownPos!.x;
  const diffY = mousePos.y - mouseDownPos!.y;

  for (let x1 = 0; x1 < gridSize; x1++) {
    for (let y1 = 0; y1 < gridSize; y1++) {
      if (
        grid.value[x1]?.[y1]?.shipData?.connectsTo !==
        currentCell.value.shipData?.connectsTo
      )
        continue;

      grid.value[x1]![y1]!.visualCord.x =
        grid.value[x1]![y1]!.gridCord.x + diffX!;
      grid.value[x1]![y1]!.visualCord.y =
        grid.value[x1]![y1]!.gridCord.y + diffY!;
    }
  }
};

function handleClick() {
  if (!currentCell.value) return;

  const shipCells = getShipCells(currentCell.value);

  const pivotX = currentCell.value.gridCord.x;
  const pivotY = currentCell.value.gridCord.y;

  for (const cell of shipCells) {
    // rotate 90° -> x=-y y=x
    cell.visualCord.x = -(cell.gridCord.y - pivotY) + pivotX;
    cell.visualCord.y = cell.gridCord.x - pivotX + pivotY;
  }

  placeShipToVisualCord(PlaceState.ROTATE);
}

function getShipCells(cell: Cell): Cell[] {
  const shipCells: Cell[] = [];

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (
        grid.value[x]?.[y]?.shipData?.connectsTo === cell.shipData?.connectsTo
      ) {
        shipCells.push(grid.value[x]![y]!);
      }
    }
  }

  return shipCells;
}

function placeShipToVisualCord(placeState: PlaceState) {
  if (!currentCell.value) return;

  const shipCells = getShipCells(currentCell.value);

  let isValidMove = true;

  for (const cell of shipCells) {
    const newX = Math.floor(cell.visualCord.x + 0.5);
    const newY = Math.floor(cell.visualCord.y + 0.5);

    cell.visualCord.x = newX;
    cell.visualCord.y = newY;

    if (!isValidMove) continue;

    if (
      newX < 0 ||
      newX >= gridSize ||
      newY < 0 ||
      newY >= gridSize ||
      (grid.value[newX]![newY]!.shipData !== undefined &&
        grid.value[newX]![newY]!.shipData!.connectsTo !==
          currentCell.value.shipData!.connectsTo)
    ) {
      isValidMove = false;
    }
  }

  if (isValidMove) {
    //removing and adding needs to be in 2 steps else a ship might overwrite itself

    //remove old cell
    for (const cell of shipCells) {
      const oldPos = cell.gridCord;

      grid.value[oldPos.x]![oldPos.y] = {
        shipData: undefined,
        isHit: false,
        visualCord: { x: oldPos.x, y: oldPos.y },
        gridCord: { x: oldPos.x, y: oldPos.y },
      } as Cell;
    }

    //set new cell
    for (const cell of shipCells) {
      const newPos = cell.visualCord;
      grid.value[newPos.x]![newPos.y] = {
        ...cell,
        visualCord: { x: newPos.x, y: newPos.y },
        gridCord: { x: newPos.x, y: newPos.y },
      };
    }

    gridStore.grid = grid.value;
  } else {
    // reset cell to gridCoordinate
    for (const cell of shipCells) {
      cell.visualCord.x = cell.gridCord.x;
      cell.visualCord.y = cell.gridCord.y;
    }

    if (placeState === PlaceState.MOVE)
      toast.warning(`Das Schiff kann hier nicht plaziert werden!`);
    else toast.warning(`Es ist nicht genug Platz zum rotieren!`);
  }
}

const handleLostFocus = () => {
  if (!currentCell.value) return;

  const shipCells = getShipCells(currentCell.value);

  for (const cell of shipCells) {
    cell.visualCord.x = cell.gridCord.x;
    cell.visualCord.y = cell.gridCord.y;
  }

  currentCell.value = undefined;
  mouseDownPos = undefined;
};

const mouseUp = (event: MouseEvent) => {
  if (!currentCell.value) return;

  const mousePos = mouseGridPosition(event);

  if (
    Math.abs(mousePos.x - mouseDownPos!.x) < 0.1 &&
    Math.abs(mousePos.y - mouseDownPos!.y) < 0.1
  ) {
    handleClick();
  } else {
    placeShipToVisualCord(PlaceState.MOVE);
  }

  currentCell.value = undefined;
  mouseDownPos = undefined;
};
</script>

<template>
  <canvas
    ref="canvas"
    :width="canvasWidth"
    :height="canvasHeight"
    class="z-1"
  />
</template>

<style scoped></style>
