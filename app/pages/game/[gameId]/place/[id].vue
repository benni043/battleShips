<script setup lang="ts">
import type { Cell, ShipData } from "#shared/gameTypes";
import { useMyGridStore } from "~/stores/myGrid";

const route = useRoute();

const gridStore = useMyGridStore();

const gridSent = ref(false);

const gridSize = 10;
const labelMargin = 20;
const baseSize = 400;
const canvasWidth = baseSize + labelMargin;
const canvasHeight = baseSize + labelMargin;
const cellSize = baseSize / gridSize;

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
  //2er
  const ship2Data = {
    connectsTo: 1,
    color: "blue",
  } as ShipData;

  grid.value[0]![0]!.shipData = ship2Data;
  grid.value[0]![1]!.shipData = ship2Data;

  const ship2Data2 = {
    connectsTo: 2,
    color: "blue",
  } as ShipData;

  grid.value[0]![2]!.shipData = ship2Data2;
  grid.value[0]![3]!.shipData = ship2Data2;

  const ship2Data3 = {
    connectsTo: 3,
    color: "blue",
  } as ShipData;

  grid.value[0]![4]!.shipData = ship2Data3;
  grid.value[0]![5]!.shipData = ship2Data3;

  //3er
  const ship3Data = {
    connectsTo: 4,
    color: "red",
  } as ShipData;

  grid.value[1]![1]!.shipData = ship3Data;
  grid.value[2]![1]!.shipData = ship3Data;
  grid.value[3]![1]!.shipData = ship3Data;

  const ship3Data2 = {
    connectsTo: 5,
    color: "red",
  } as ShipData;

  grid.value[1]![0]!.shipData = ship3Data2;
  grid.value[2]![0]!.shipData = ship3Data2;
  grid.value[3]![0]!.shipData = ship3Data2;

  const ship3Data3 = {
    connectsTo: 6,
    color: "red",
  } as ShipData;

  grid.value[1]![3]!.shipData = ship3Data3;
  grid.value[1]![4]!.shipData = ship3Data3;
  grid.value[1]![5]!.shipData = ship3Data3;

  //4er
  const ship4Data = {
    connectsTo: 7,
    color: "orange",
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
    color: "magenta",
  } as ShipData;

  grid.value[9]![0]!.shipData = ship1Data;

  const ship1Data2 = {
    connectsTo: 10,
    color: "magenta",
  } as ShipData;

  grid.value[8]![0]!.shipData = ship1Data2;

  const ship1Data3 = {
    connectsTo: 11,
    color: "magenta",
  } as ShipData;

  grid.value[8]![1]!.shipData = ship1Data3;

  const ship1Data4 = {
    connectsTo: 12,
    color: "magenta",
  } as ShipData;

  grid.value[9]![1]!.shipData = ship1Data4;

  //8er
  const ship8Data = {
    connectsTo: 13,
    color: "blue",
  } as ShipData;

  grid.value[9]![9]!.shipData = ship8Data;

  const ship8Data2 = {
    connectsTo: 13,
    color: "magenta",
  } as ShipData;

  grid.value[8]![9]!.shipData = ship8Data2;

  const ship8Data3 = {
    connectsTo: 13,
    color: "red",
  } as ShipData;

  grid.value[7]![9]!.shipData = ship8Data3;

  const ship8Data4 = {
    connectsTo: 13,
    color: "orange",
  } as ShipData;

  grid.value[8]![8]!.shipData = ship8Data4;

  const ship8Data5 = {
    connectsTo: 13,
    color: "green",
  } as ShipData;

  grid.value[8]![7]!.shipData = ship8Data5;

  const ship8Data6 = {
    connectsTo: 13,
    color: "cyan",
  } as ShipData;

  grid.value[9]![7]!.shipData = ship8Data6;

  const ship8Data7 = {
    connectsTo: 13,
    color: "cyan",
  } as ShipData;

  grid.value[9]![7]!.shipData = ship8Data7;

  const ship8Data8 = {
    connectsTo: 13,
    color: "purple",
  } as ShipData;

  grid.value[7]![7]!.shipData = ship8Data8;

  const ship8Data9 = {
    connectsTo: 13,
    color: "brown",
  } as ShipData;

  grid.value[6]![9]!.shipData = ship8Data9;
}

function drawGrid() {
  ctx.value!.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.value!.font = "14px sans-serif";
  ctx.value!.textAlign = "center";
  ctx.value!.textBaseline = "middle";

  // Grid & Achsenbeschriftungen
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * cellSize + labelMargin;
      const y = j * cellSize + labelMargin;

      ctx.value!.strokeStyle = "black";
      ctx.value!.lineWidth = 1;
      ctx.value!.strokeRect(x, y, cellSize, cellSize);

      // Linke Zahlenachse (1–10)
      if (i === 0) {
        ctx.value!.fillStyle = "black";
        ctx.value!.fillText(
          (j + 1).toString(),
          labelMargin / 2,
          y + cellSize / 2,
        );
      }

      // Obere Buchstabenachse (A–J)
      if (j === 0) {
        ctx.value!.fillStyle = "black";
        const char = String.fromCharCode(65 + i); // 'A' = 65
        ctx.value!.fillText(char, x + cellSize / 2, labelMargin / 2);
      }
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
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (
          grid.value[x]?.[y]?.shipData?.connectsTo ===
          currentCell.shipData?.connectsTo
        ) {
          ctx.value!.fillStyle = grid.value[x]![y]!.shipData!.color; // Farbe pro Zelle setzen
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
    x * cellSize + leftX + labelMargin,
    y * cellSize + topY + labelMargin,
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
  currentCell = undefined;
  mouseDownX = undefined;
  mouseDownY = undefined;

  drawGrid();

  const rect = canvas.value!.getBoundingClientRect();

  const calcX = event.clientX - rect.left - labelMargin;
  const calcY = event.clientY - rect.top - labelMargin;

  if (calcX < 0 || calcY < 0) return;

  const x = Math.floor(calcX / cellSize);
  const y = Math.floor(calcY / cellSize);

  if (x >= gridSize || y >= gridSize) return;

  if (!grid.value[x]![y]!.shipData) return;

  currentCell = grid.value[x]![y];
  mouseDownX = x;
  mouseDownY = y;
};


const mouseMove = (event: MouseEvent) => {
  if (!currentCell) return;

  const rect = canvas.value!.getBoundingClientRect();
  const calcX = event.clientX - rect.left - labelMargin;
  const calcY = event.clientY - rect.top - labelMargin;

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

  // Alle Schiffsteile mit ihren individuellen Daten speichern
  const shipCells: Cell[] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (
        grid.value[x]?.[y]?.shipData?.connectsTo ===
        currentCell.shipData?.connectsTo
      ) {
        shipCells.push(grid.value[x]![y]!);

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
    // Alte Positionen löschen
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

    // Neue Positionen zuweisen mit individuellen shipData von shipCells
    for (let i = 0; i < newPositions.length; i++) {
      const pos = newPositions[i]!;
      const cell = shipCells[i]!;

      grid.value[pos.x]![pos.y] = {
        ...cell,
        x: pos.x,
        y: pos.y,
        originX: pos.x,
        originY: pos.y,
      };
    }
  } else {
    // Wenn ungültig, Positionen zurücksetzen
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

async function start() {
  gridStore.grid = grid.value;
  gridSent.value = true;

  canvas.value!.removeEventListener("mousemove", mouseMove);
  canvas.value!.removeEventListener("mouseup", mouseUp);
  canvas.value!.removeEventListener("mousedown", mouseDown);

  //post to backend
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
  } catch (error: any) {
    if (error?.status === 401) {
      console.error("Nicht autorisiert:", error.statusMessage);
    } else if (error?.status === 400) {
      console.error("Fehlerhafte Anfrage:", error.statusMessage);
    } else {
      console.error("Unbekannter Fehler:", error);
    }
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6"
  >

    <h1 class="text-3xl font-bold mb-8 text-gray-800">Platziere deine Schiffe!</h1>

    <div
      class="bg-white shadow-xl rounded-lg p-8 flex flex-col items-center"
      style="width: 460px;"
    >
      <canvas
        ref="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
      />
      <button
        class="mt-6 w-full rounded-xl border border-gray-400 bg-blue-600 text-white py-3 hover:bg-blue-700 disabled:bg-green-500 disabled:cursor-not-allowed transition"
        :disabled="gridSent"
        @click="start()"
      >
        Start Game
      </button>
    </div>
  </div>
</template>


<style scoped></style>
