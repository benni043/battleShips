<script setup lang="ts">
import type { Cell, ShipData } from "#shared/gameTypes";
import { useMyGridStore } from "~/stores/myGrid";
import { io } from "socket.io-client";

const route = useRoute();

const socket = io({
  path: "/api/socket.io",
});

const gridStore = useMyGridStore();

const gridSent = ref(false);

const canvasWidth = 400;
const canvasHeight = 400;
const gridSize = 10;
const cellSize = canvasHeight / gridSize;

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);

const grid: Ref<Cell[][]> = ref([]);

let currentCell: Cell | undefined;
let mouseDownX: number | undefined;
let mouseDownY: number | undefined;

function initGrid() {
  for (let x = 0; x < gridSize; x++) {
    grid.value.push([]);

    for (let y = 0; y < gridSize; y++) {
      grid.value[x]!.push({
        shipData: undefined,
        isHit: false,
        x: x,
        y: y,
        originX: x,
        originY: y,
      } as Cell);
    }
  }
}

function initShips() {
  const ship1Data = {
    connectsTo: 1,
    color: "blue",
  } as ShipData;

  grid.value[0]![0]!.shipData = ship1Data;
  grid.value[0]![1]!.shipData = ship1Data;

  const ship2Data = {
    connectsTo: 2,
    color: "green",
  } as ShipData;

  grid.value[5]![4]!.shipData = ship2Data;
  grid.value[5]![5]!.shipData = ship2Data;
  grid.value[5]![6]!.shipData = ship2Data;
  grid.value[4]![5]!.shipData = ship2Data;
  grid.value[6]![5]!.shipData = ship2Data;
}

function drawGrid() {
  ctx.value!.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw the grid
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      ctx.value!.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Draw all ships except the one being moved
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (grid.value[x]![y]! !== currentCell) {
        if (!grid.value[x]![y]!.shipData!) continue;

        ctx.value!.fillStyle = grid.value[x]![y]!.shipData!.color;
        drawShip(x, y, grid.value[x]![y]!.x, grid.value[x]![y]!.y);
      }
    }
  }

  // Draw the currently moved ship last
  if (currentCell) {
    ctx.value!.fillStyle = currentCell.shipData!.color;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (
          grid.value[x]?.[y]?.shipData?.connectsTo ===
          currentCell.shipData?.connectsTo
        ) {
          drawShip(x, y, grid.value[x]![y]!.x, grid.value[x]![y]!.y);
        }
      }
    }
  }
}

function drawShip(idxX: number, idxY: number, x: number, y: number) {
  const rows = grid.value.length;
  const cols = grid.value[0]!.length;

  const shipData = grid.value[idxX]![idxY]!.shipData;

  if (!shipData) return;

  const hasTopNeighbor =
    idxY > 0 &&
    grid.value[idxX]?.[idxY - 1]?.shipData &&
    grid.value[idxX]![idxY - 1]!.shipData!.connectsTo === shipData.connectsTo;

  const hasBottomNeighbor =
    idxY < rows - 1 &&
    grid.value[idxX]?.[idxY + 1]?.shipData &&
    grid.value[idxX]![idxY + 1]!.shipData!.connectsTo === shipData.connectsTo;

  const hasLeftNeighbor =
    idxX > 0 &&
    grid.value[idxX - 1]?.[idxY]?.shipData &&
    grid.value[idxX - 1]![idxY]!.shipData!.connectsTo === shipData.connectsTo;

  const hasRightNeighbor =
    idxX < cols - 1 &&
    grid.value[idxX + 1]?.[idxY]?.shipData &&
    grid.value[idxX + 1]![idxY]!.shipData!.connectsTo === shipData.connectsTo;

  const leftX = hasLeftNeighbor ? 0 : 5;
  const rightX = hasRightNeighbor ? 0 : 5;
  const topY = hasTopNeighbor ? 0 : 5;
  const bottomY = hasBottomNeighbor ? 0 : 5;

  ctx.value!.fillRect(
    x * cellSize + leftX,
    y * cellSize + topY,
    cellSize - leftX - rightX,
    cellSize - topY - bottomY,
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

const mouseDown = (event: MouseEvent) => {
  //todo does not work

  currentCell = undefined;
  mouseDownX = undefined;
  mouseDownY = undefined;

  drawGrid();

  const rect = canvas.value!.getBoundingClientRect();
  const calcX = event.clientX - rect.left;
  const calcY = event.clientY - rect.top;

  const x = Math.floor(calcX / cellSize);
  const y = Math.floor(calcY / cellSize);

  mouseDownX = x;
  mouseDownY = y;

  if (!grid.value[x]![y]!.shipData) return;

  currentCell = grid.value[x]![y];
};

const mouseMove = (event: MouseEvent) => {
  if (!currentCell) return;

  const rect = canvas.value!.getBoundingClientRect();
  const calcX = event.clientX - rect.left;
  const calcY = event.clientY - rect.top;

  const diffX = calcX / cellSize - mouseDownX! - 0.5;
  const diffY = calcY / cellSize - mouseDownY! - 0.5;

  for (let x1 = 0; x1 < gridSize; x1++) {
    for (let y1 = 0; y1 < gridSize; y1++) {
      if (
        grid.value[x1]?.[y1]?.shipData?.connectsTo !==
        currentCell.shipData?.connectsTo
      )
        continue;

      grid.value[x1]![y1]!.x = grid.value[x1]![y1]!.originX + diffX!;
      grid.value[x1]![y1]!.y = grid.value[x1]![y1]!.originY + diffY!;
    }
  }

  drawGrid();
};

const mouseUp = () => {
  if (!currentCell) return;

  const newPositions: { x: number; y: number }[] = [];
  let isValidMove = true;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (
        grid.value[x]?.[y]?.shipData?.connectsTo ===
        currentCell.shipData?.connectsTo
      ) {
        const newX = Math.floor(grid.value[x]![y]!.x + 0.5);
        const newY = Math.floor(grid.value[x]![y]!.y + 0.5);

        // Check if the new position is within bounds and not occupied by another ship
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
          break;
        }

        newPositions.push({ x: newX, y: newY });
      }
    }
    if (!isValidMove) break;
  }

  if (isValidMove) {
    // Clear old positions
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (
          grid.value[x]?.[y]?.shipData?.connectsTo ===
          currentCell.shipData?.connectsTo
        ) {
          grid.value[x]![y] = {
            shipData: undefined,
            isHit: false,
            x: x,
            y: y,
            originX: x,
            originY: y,
          } as Cell;
        }
      }
    }

    // Assign new positions
    for (const pos of newPositions) {
      grid.value[pos.x]![pos.y] = {
        ...currentCell,
        x: pos.x,
        y: pos.y,
        originX: pos.x,
        originY: pos.y,
      };
    }
  } else {
    // If move is invalid, reset to original positions
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (
          grid.value[x]?.[y]?.shipData?.connectsTo ===
          currentCell.shipData?.connectsTo
        ) {
          grid.value[x]![y]!.x = grid.value[x]![y]!.originX;
          grid.value[x]![y]!.y = grid.value[x]![y]!.originY;
        }
      }
    }
  }

  currentCell = undefined;
  mouseDownX = undefined;
  mouseDownY = undefined;

  drawGrid();
};

function start() {
  gridStore.grid = grid.value;
  gridSent.value = true;

  canvas.value!.removeEventListener("mousemove", mouseMove);
  canvas.value!.removeEventListener("mouseup", mouseUp);
  canvas.value!.removeEventListener("mousedown", mouseDown);

  socket.emit(
    "post-field",
    route.params.id,
    route.params.gameId,
    JSON.stringify(gridStore.grid),
    redirect,
  );
}

function redirect() {
  navigateTo(`/game/${route.params.gameId}/${route.params.id}`);
}

onBeforeUnmount(() => {
  socket?.disconnect();
});
</script>

<template>
  <div>
    <div>
      <canvas
        ref="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
        style="border: 1px solid #d3d3d3"
      />
    </div>

    <button
      class="mt-1 rounded border-1 px-1 not-disabled:cursor-pointer hover:bg-gray-300 disabled:bg-green-500"
      :disabled="gridSent"
      @click="start()"
    >
      startGame
    </button>
  </div>
</template>

<style scoped></style>
