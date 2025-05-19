<script setup lang="ts">
import {type Cell, FieldType} from "#shared/gameTypes";
import {useMyGridStore} from "~/stores/myGrid";
import {useSocket} from "~/utils/useSocketIO";

const route = useRoute()

const socket = useSocket();

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
    grid.value[x] = [];

    for (let y = 0; y < gridSize; y++) {
      grid.value[x][y] = {
        type: {
          fieldType: FieldType.WATER,
          isHit: false
        },
        id: undefined,
        color: "white",
        x: x,
        y: y,
        originX: x,
        originY: y,
      }
    }
  }
}

function initShips() {
  // grid.value[0][0].id = 0;
  // grid.value[0][0].color = "green";
  // grid.value[0][0].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }
  //
  // grid.value[0][1].id = 1;
  // grid.value[0][1].color = "green";
  // grid.value[0][1].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }
  //
  // grid.value[1][1].id = 1;
  // grid.value[1][1].color = "green";
  // grid.value[1][1].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }
  //
  // grid.value[1][2].id = 1;
  // grid.value[1][2].color = "green";
  // grid.value[1][2].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }
  //
  // grid.value[2][2].id = 1;
  // grid.value[2][2].color = "green";
  // grid.value[2][2].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }
  //
  // grid.value[6][6].id = 2;
  // grid.value[6][6].color = "green";
  // grid.value[6][6].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }
  //
  // grid.value[5][7].id = 2;
  // grid.value[5][7].color = "green";
  // grid.value[5][7].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }
  //
  // grid.value[6][7].id = 2;
  // grid.value[6][7].color = "green";
  // grid.value[6][7].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }
  //
  // grid.value[6][8].id = 2;
  // grid.value[6][8].color = "green";
  // grid.value[6][8].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }
  //
  // grid.value[7][7].id = 2;
  // grid.value[7][7].color = "green";
  // grid.value[7][7].type = {
  //   fieldType: FieldType.SHIP,
  //   isHit: false
  // }

  grid.value[0][9].id = 3;
  grid.value[0][9].color = "blue";
  grid.value[0][9].type = {
    fieldType: FieldType.SHIP,
    isHit: false
  }

  grid.value[1][9].id = 3;
  grid.value[1][9].color = "blue";
  grid.value[1][9].type = {
    fieldType: FieldType.SHIP,
    isHit: false
  }
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
      if (grid.value[x][y] !== currentCell) {
        ctx.value!.fillStyle = grid.value[x][y].color;
        drawShip(x, y, grid.value[x][y].x, grid.value[x][y].y);
      }
    }
  }

  // Draw the currently moved ship last
  if (currentCell) {
    ctx.value!.fillStyle = currentCell.color;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (grid.value[x][y].id === currentCell.id) {
          drawShip(x, y, grid.value[x][y].x, grid.value[x][y].y);
        }
      }
    }
  }
}

function drawShip(idxX: number, idxY: number, x: number, y: number) {
  const rows = grid.value.length;
  const cols = grid.value[0].length;

  const id = grid.value[idxX][idxY].id;

  if (id === undefined) return;

  const hasTopNeighbor = idxY > 0 && grid.value[idxX][idxY - 1].id === id;
  const hasBottomNeighbor = idxY < rows - 1 && grid.value[idxX][idxY + 1].id === id;
  const hasLeftNeighbor = idxX > 0 && grid.value[idxX - 1][idxY].id === id;
  const hasRightNeighbor = idxX < cols - 1 && grid.value[idxX + 1][idxY].id === id;

  const leftX = hasLeftNeighbor ? 0 : 5;
  const rightX = hasRightNeighbor ? 0 : 5;
  const topY = hasTopNeighbor ? 0 : 5;
  const bottomY = hasBottomNeighbor ? 0 : 5;

  ctx.value!.fillRect(x * cellSize + leftX, y * cellSize + topY, cellSize - leftX - rightX, cellSize - topY - bottomY);
}

initGrid();
initShips();

onMounted(() => {
  ctx.value = canvas.value!.getContext('2d');

  drawGrid();

  canvas.value!.addEventListener("mousedown", mouseDown);
  canvas.value!.addEventListener("mousemove", mouseMove);
  canvas.value!.addEventListener("mouseup", mouseUp);
})

const mouseDown = (event) => {
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

  if (grid.value[x][y].id === undefined) return;

  currentCell = grid.value[x][y];
}


const mouseMove = (event) => {
  if (currentCell === undefined) return;

  const rect = canvas.value!.getBoundingClientRect();
  const calcX = event.clientX - rect.left;
  const calcY = event.clientY - rect.top;

  const diffX = (calcX / cellSize - mouseDownX!) - 0.5;
  const diffY = (calcY / cellSize - mouseDownY!) - 0.5;

  for (let x1 = 0; x1 < gridSize; x1++) {
    for (let y1 = 0; y1 < gridSize; y1++) {
      if (grid.value[x1][y1].id !== currentCell.id) continue;

      grid.value[x1][y1].x = grid.value[x1][y1].originX + diffX!;
      grid.value[x1][y1].y = grid.value[x1][y1].originY + diffY!;
    }
  }

  drawGrid();
}

const mouseUp = () => {
  if (currentCell === undefined) return;

  const newPositions: { x: number, y: number }[] = [];
  let isValidMove = true;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (grid.value[x][y].id === currentCell.id) {
        const newX = Math.floor(grid.value[x][y].x + 0.5);
        const newY = Math.floor(grid.value[x][y].y + 0.5);

        // Check if the new position is within bounds and not occupied by another ship
        if (
            newX < 0 || newX >= gridSize ||
            newY < 0 || newY >= gridSize ||
            (grid.value[newX][newY].id !== undefined && grid.value[newX][newY].id !== currentCell.id)
        ) {
          isValidMove = false;
          break;
        }

        newPositions.push({x: newX, y: newY});
      }
    }
    if (!isValidMove) break;
  }

  if (isValidMove) {
    // Clear old positions
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (grid.value[x][y].id === currentCell.id) {
          grid.value[x][y] = {
            type: {
              fieldType: FieldType.WATER,
              isHit: false
            },
            id: undefined,
            color: "white",
            x: x,
            y: y,
            originX: x,
            originY: y,
          };
        }
      }
    }

    // Assign new positions
    for (const pos of newPositions) {
      grid.value[pos.x][pos.y] = {
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
        if (grid.value[x][y].id === currentCell.id) {
          grid.value[x][y].x = grid.value[x][y].originX;
          grid.value[x][y].y = grid.value[x][y].originY;
        }
      }
    }
  }

  currentCell = undefined;
  mouseDownX = undefined;
  mouseDownY = undefined;

  drawGrid();
}

function start() {
  gridStore.grid = grid.value;
  gridSent.value = true;

  canvas.value!.removeEventListener("mousemove", mouseMove)
  canvas.value!.removeEventListener("mouseup", mouseUp)
  canvas.value!.removeEventListener("mousedown", mouseDown)

  socket.emit("ready");
}

socket.on("send-field", () => {
  socket.emit("post-field", JSON.stringify(gridStore.grid), redirect);
})

function redirect() {
  navigateTo(`/game/${route.params.id}`)
}

</script>

<template>
  <div>
    <div>
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" style="border:1px solid #d3d3d3;"/>
    </div>

    <button :disabled="gridSent" @click="start()">startGame</button>
  </div>
</template>

<style scoped>

</style>