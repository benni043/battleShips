<script setup lang="ts">
import type { Cell, ShipData } from "#shared/gameTypes";
import { useMyGridStore } from "~/stores/myGrid";
import { FetchError } from "ofetch";
import { Toaster, toast } from "vue-sonner";
import "vue-sonner/style.css";
import {
  gridSize,
  labelMargin,
  canvasWidth,
  canvasHeight,
  cellSize,
  getShipConnections,
  drawHeaderOfGrid,
} from "~/utils/ship";

const route = useRoute();

const gridStore = useMyGridStore();

const gridSent = ref(false);

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);

const grid: Ref<Cell[][]> = ref([]);

let currentCell: Cell | undefined;
let mouseDownPos: { x: number; y: number } | undefined;

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
  //2er
  const ship2Data = {
    connectsTo: 1,
    color: "green",
  } as ShipData;

  grid.value[0]![0]!.shipData = ship2Data;
  grid.value[0]![1]!.shipData = ship2Data;

  const ship2Data2 = {
    connectsTo: 2,
    color: "green",
  } as ShipData;

  grid.value[0]![2]!.shipData = ship2Data2;
  grid.value[0]![3]!.shipData = ship2Data2;

  const ship2Data3 = {
    connectsTo: 3,
    color: "green",
  } as ShipData;

  grid.value[0]![4]!.shipData = ship2Data3;
  grid.value[0]![5]!.shipData = ship2Data3;

  //3er
  const ship3Data = {
    connectsTo: 4,
    color: "green",
  } as ShipData;

  grid.value[1]![1]!.shipData = ship3Data;
  grid.value[2]![1]!.shipData = ship3Data;
  grid.value[3]![1]!.shipData = ship3Data;

  const ship3Data2 = {
    connectsTo: 5,
    color: "green",
  } as ShipData;

  grid.value[1]![0]!.shipData = ship3Data2;
  grid.value[2]![0]!.shipData = ship3Data2;
  grid.value[3]![0]!.shipData = ship3Data2;

  const ship3Data3 = {
    connectsTo: 6,
    color: "green",
  } as ShipData;

  grid.value[1]![2]!.shipData = ship3Data3;
  grid.value[2]![2]!.shipData = ship3Data3;
  grid.value[3]![2]!.shipData = ship3Data3;

  //4er
  const ship4Data = {
    connectsTo: 7,
    color: "green",
  } as ShipData;

  grid.value[0]![9]!.shipData = ship4Data;
  grid.value[0]![8]!.shipData = ship4Data;
  grid.value[1]![9]!.shipData = ship4Data;
  grid.value[1]![8]!.shipData = ship4Data;

  //5er
  const ship5Data = {
    connectsTo: 8,
    color: "green",
  } as ShipData;

  grid.value[5]![4]!.shipData = ship5Data;
  grid.value[5]![5]!.shipData = ship5Data;
  grid.value[5]![6]!.shipData = ship5Data;
  grid.value[4]![5]!.shipData = ship5Data;
  grid.value[6]![5]!.shipData = ship5Data;

  //1er
  const ship1Data = {
    connectsTo: 9,
    color: "green",
  } as ShipData;

  grid.value[9]![0]!.shipData = ship1Data;

  const ship1Data2 = {
    connectsTo: 10,
    color: "green",
  } as ShipData;

  grid.value[8]![0]!.shipData = ship1Data2;

  const ship1Data3 = {
    connectsTo: 11,
    color: "green",
  } as ShipData;

  grid.value[8]![1]!.shipData = ship1Data3;

  const ship1Data4 = {
    connectsTo: 12,
    color: "green",
  } as ShipData;

  grid.value[9]![1]!.shipData = ship1Data4;
}

function drawGrid() {
  if (!ctx.value) return;

  ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);

  //draw header
  drawHeaderOfGrid(ctx.value);

  // Draw all ships except the one being moved
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (grid.value[x]![y]! !== currentCell) {
        if (!grid.value[x]![y]!.shipData!) continue;

        ctx.value!.fillStyle = grid.value[x]![y]!.shipData!.color;
        drawShip(
          x,
          y,
          grid.value[x]![y]!.visualCord.x,
          grid.value[x]![y]!.visualCord.y,
        );
      }
    }
  }

  // Draw the currently moved ship last
  if (currentCell) {
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (
          grid.value[x]?.[y]?.shipData?.connectsTo ===
          currentCell.shipData?.connectsTo
        ) {
          ctx.value.fillStyle = grid.value[x]![y]!.shipData!.color;
          drawShip(
            x,
            y,
            grid.value[x]![y]!.visualCord.x,
            grid.value[x]![y]!.visualCord.y,
          );
        }
      }
    }
  }
}

function drawShip(visualX: number, visualY: number, x: number, y: number) {
  const rows = grid.value.length;
  const cols = grid.value[0]?.length ?? 0;

  const shipConnections = getShipConnections(x, y, rows, cols, grid.value);
  if (!shipConnections) return;

  ctx.value!.fillRect(
    visualX * cellSize + shipConnections.left + labelMargin,
    visualY * cellSize + shipConnections.top + labelMargin,
    cellSize - shipConnections.left - shipConnections.right,
    cellSize - shipConnections.top - shipConnections.bottom,
  );
}

initGrid();
initShips();

onMounted(() => {
  ctx.value = canvas.value!.getContext("2d");

  drawGrid();

  canvas.value!.addEventListener("mousedown", mouseDown);
  canvas.value!.addEventListener("mousemove", mouseMove);
  canvas.value!.addEventListener("mouseup", mouseUp);
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
  currentCell = undefined;
  mouseDownPos = undefined;

  drawGrid();

  const mousePos = mouseGridPosition(event);

  if (mousePos.x < 0 || mousePos.y < 0) return;

  const x = Math.floor(mousePos.x);
  const y = Math.floor(mousePos.y);

  if (x >= gridSize || y >= gridSize) return;

  if (!grid.value[x]![y]!.shipData) return;

  currentCell = grid.value[x]![y];
  mouseDownPos = mousePos;
};

const mouseMove = (event: MouseEvent) => {
  if (!currentCell) return;

  const mousePos = mouseGridPosition(event);

  const diffX = mousePos.x - mouseDownPos!.x;
  const diffY = mousePos.y - mouseDownPos!.y;

  for (let x1 = 0; x1 < gridSize; x1++) {
    for (let y1 = 0; y1 < gridSize; y1++) {
      if (
        grid.value[x1]?.[y1]?.shipData?.connectsTo !==
        currentCell.shipData?.connectsTo
      )
        continue;

      grid.value[x1]![y1]!.visualCord.x =
        grid.value[x1]![y1]!.gridCord.x + diffX!;
      grid.value[x1]![y1]!.visualCord.y =
        grid.value[x1]![y1]!.gridCord.y + diffY!;
    }
  }

  drawGrid();
};

function handleClick() {
  if (!currentCell) return;

  const shipCells = getShipCells(currentCell);

  const pivotX = currentCell.gridCord.x;
  const pivotY = currentCell.gridCord.y;

  for (const cell of shipCells) {
    // rotate 90° -> x=-y y=x
    cell.visualCord.x = -(cell.gridCord.y - pivotY) + pivotX;
    cell.visualCord.y = cell.gridCord.x - pivotX + pivotY;
  }

  placeShipToVisualCord();
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

function placeShipToVisualCord() {
  if (!currentCell) return;

  const shipCells = getShipCells(currentCell);

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
          currentCell.shipData!.connectsTo)
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
  } else {
    // reset cell to gridCoordinate
    for (const cell of shipCells) {
      cell.visualCord.x = cell.gridCord.x;
      cell.visualCord.y = cell.gridCord.y;
    }

    toast.warning(`Das Schiff kann hier nicht plaziert werden!`);
  }
}

const mouseUp = (event: MouseEvent) => {
  if (!currentCell) return;

  const mousePos = mouseGridPosition(event);

  if (
    Math.abs(mousePos.x - mouseDownPos!.x) < 0.1 &&
    Math.abs(mousePos.y - mouseDownPos!.y) < 0.1
  ) {
    handleClick();
  } else {
    placeShipToVisualCord();
  }

  currentCell = undefined;
  mouseDownPos = undefined;

  drawGrid();
};

async function start() {
  gridStore.grid = grid.value;
  gridSent.value = true;

  canvas.value!.removeEventListener("mousemove", mouseMove);
  canvas.value!.removeEventListener("mouseup", mouseUp);
  canvas.value!.removeEventListener("mousedown", mouseDown);

  try {
    await $fetch("/api/place", {
      method: "POST",
      body: {
        lobby: route.params.gameId,
        id: route.params.id,
        grid: JSON.stringify(grid.value),
      },
    });

    navigateTo(`/game/${route.params.gameId}/${route.params.id}`);
  } catch (error) {
    if (error instanceof FetchError) {
      if (error?.status === 401) {
        console.error("unauthorized: ", error.statusMessage);
        toast.error(`Unauthorized: ${error.statusMessage}`);
      } else if (error?.status === 400) {
        console.error("illegal request: ", error.statusMessage);
        toast.error(`Illegal request: ${error.statusMessage}`);
      } else {
        console.error("unknown error: ", error);
        toast.error(`Unknown error occurred: ${error.statusMessage}`);
      }
    } else {
      console.error("unknown error: ", error);
    }
  }
}
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6"
  >
    <Toaster close-button rich-colors position="top-right" />

    <h1 class="mb-8 text-3xl font-bold text-gray-800">
      Platziere deine Schiffe!
    </h1>

    <div
      class="flex flex-col items-center rounded-lg bg-white p-8 shadow-xl"
      style="width: 460px"
    >
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" />

      <button
        class="mt-6 w-full rounded-xl border border-gray-400 bg-blue-600 py-3 text-white transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-green-500"
        :disabled="gridSent"
        @click="start()"
      >
        Start Game
      </button>
    </div>
  </div>
</template>

<style scoped></style>
