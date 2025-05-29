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
  drawHeaderOfGrid,
  drawShip,
  getTileSet,
  drawGrid,
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
  const ship2Data: ShipData = { connectsTo: 1 };

  grid.value[0]![0]!.shipData = ship2Data;
  grid.value[0]![1]!.shipData = ship2Data;

  const ship2Data2: ShipData = { connectsTo: 2 };

  grid.value[0]![2]!.shipData = ship2Data2;
  grid.value[0]![3]!.shipData = ship2Data2;

  const ship2Data3: ShipData = { connectsTo: 3 };

  grid.value[0]![4]!.shipData = ship2Data3;
  grid.value[0]![5]!.shipData = ship2Data3;

  //3er
  const ship3Data: ShipData = { connectsTo: 4 };

  grid.value[1]![1]!.shipData = ship3Data;
  grid.value[2]![1]!.shipData = ship3Data;
  grid.value[3]![1]!.shipData = ship3Data;

  const ship3Data2: ShipData = { connectsTo: 5 };

  grid.value[1]![0]!.shipData = ship3Data2;
  grid.value[2]![0]!.shipData = ship3Data2;
  grid.value[3]![0]!.shipData = ship3Data2;

  const ship3Data3: ShipData = { connectsTo: 6 };

  grid.value[1]![2]!.shipData = ship3Data3;
  grid.value[2]![2]!.shipData = ship3Data3;
  grid.value[3]![2]!.shipData = ship3Data3;

  //4er
  const ship4Data: ShipData = { connectsTo: 7 };

  grid.value[0]![9]!.shipData = ship4Data;
  grid.value[0]![8]!.shipData = ship4Data;
  grid.value[1]![9]!.shipData = ship4Data;
  grid.value[1]![8]!.shipData = ship4Data;

  //5er
  const ship5Data: ShipData = { connectsTo: 8 };

  grid.value[5]![4]!.shipData = ship5Data;
  grid.value[5]![5]!.shipData = ship5Data;
  grid.value[5]![6]!.shipData = ship5Data;
  grid.value[4]![5]!.shipData = ship5Data;
  grid.value[6]![5]!.shipData = ship5Data;

  //1er
  const ship1Data: ShipData = { connectsTo: 9 };

  grid.value[9]![0]!.shipData = ship1Data;

  const ship1Data2: ShipData = { connectsTo: 10 };

  grid.value[8]![0]!.shipData = ship1Data2;

  const ship1Data3: ShipData = { connectsTo: 11 };

  grid.value[8]![1]!.shipData = ship1Data3;

  const ship1Data4: ShipData = { connectsTo: 12 };

  grid.value[9]![1]!.shipData = ship1Data4;
}

function draw() {
  if (!ctx.value) return;

  ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);

  //draw header
  // drawHeaderOfGrid(ctx.value);

  drawGrid(ctx.value);

  // Draw all ships except the one being moved
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (grid.value[x]![y]! !== currentCell) {
        if (!grid.value[x]![y]!.shipData!) continue;
        drawShip(x, y, grid.value, ctx.value!);
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
          drawShip(x, y, grid.value, ctx.value!);
        }
      }
    }
  }
}

initGrid();
initShips();

onMounted(() => {
  ctx.value = canvas.value!.getContext("2d");
  ctx.value!.imageSmoothingEnabled = false;

  draw();
  getTileSet().onload = () => {
    draw();
  };

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

  draw();

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

  draw();
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

  draw();
};

async function start() {
  gridStore.grid = grid.value;

  try {
    await $fetch("/api/place", {
      method: "POST",
      body: {
        lobby: route.params.gameId,
        id: route.params.playerId,
        grid: JSON.stringify(grid.value),
      },
    });

    gridSent.value = true;

    canvas.value!.removeEventListener("mousemove", mouseMove);
    canvas.value!.removeEventListener("mouseup", mouseUp);
    canvas.value!.removeEventListener("mousedown", mouseDown);

    navigateTo(`/game/${route.params.gameId}/player/${route.params.playerId}`);
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
    class="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-12"
  >
    <Toaster close-button rich-colors position="top-right" />

    <div id="fields" class="w-min">
      <h1 class="h-6 text-center text-xl leading-6 font-semibold text-gray-700">
        Plaziere deine Schiffe!
      </h1>

      <div class="m-[40px]">
        <div class="flex ml-[40px]">
          <div
            v-for="n in 10"
            :key="'top-' + n"
            class="text-xl flex h-[40px] w-[40px] pb-7 items-center justify-center font-medium text-gray-700"
          >
            {{ String.fromCharCode(64 + n) }}
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="flex flex-col">
            <div
              v-for="n in 10"
              :key="'top-' + n"
              class="text-xl flex h-[40px] w-[40px] pr-7 items-center justify-center font-medium text-gray-700"
            >
              {{ n }}
            </div>
          </div>

          <div class="flex items-center justify-center">
            <canvas
              ref="canvas"
              :width="canvasWidth"
              :height="canvasHeight"
              class="z-1"
            />

            <img
              src="assets/img/border.png"
              alt="border"
              class="absolute h-[480px] w-[480px]"
              style="image-rendering: pixelated"
            />
          </div>
        </div>
      </div>
    </div>

    <button
      class="mt-6 w-40 rounded-xl border border-gray-400 bg-blue-600 py-3 text-white transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-green-500"
      :disabled="gridSent"
      @click="start()"
    >
      Start Game
    </button>
  </div>
</template>

<style scoped></style>
