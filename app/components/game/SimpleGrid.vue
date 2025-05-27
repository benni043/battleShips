<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import type { Cell, Cord } from "#shared/gameTypes";

const props = defineProps<{
  hasListener: boolean;
  grid: Cell[][];
}>();

const emit = defineEmits(["clicked"]);

const gridSize = 10;
const labelMargin = 20;
const baseSize = 400;
const canvasWidth = baseSize + labelMargin;
const canvasHeight = baseSize + labelMargin;
const cellSize = baseSize / gridSize;

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);

watch(props.grid, () => {
  drawGrid();
});

watch(
  () => props.hasListener,
  (newVal) => {
    if (!newVal) canvas.value!.removeEventListener("mousedown", click);
  },
);

function drawGrid() {
  if (!ctx.value) return;

  ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.value.font = "14px sans-serif";
  ctx.value.textAlign = "center";
  ctx.value.textBaseline = "middle";

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * cellSize + labelMargin;
      const y = j * cellSize + labelMargin;

      ctx.value.strokeStyle = "black";
      ctx.value.lineWidth = 1;
      ctx.value.strokeRect(x, y, cellSize, cellSize);

      // number axis
      if (i === 0) {
        ctx.value.fillStyle = "black";
        ctx.value.fillText(
          (j + 1).toString(),
          labelMargin / 2,
          y + cellSize / 2,
        );
      }

      // letter axis
      if (j === 0) {
        ctx.value.fillStyle = "black";
        const char = String.fromCharCode(65 + i); // 'A' = 65
        ctx.value.fillText(char, x + cellSize / 2, labelMargin / 2);
      }
    }
  }

  // draw ships and hits
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = props.grid[i]?.[j];
      if (!cell) continue;

      const shipData = cell.shipData;

      if (!shipData) {
        if (cell.isHit) drawRedCross(i, j);
        continue;
      }

      ctx.value.fillStyle = shipData.color;
      drawShips(i, j);

      if (cell.isHit && !props.hasListener) {
        drawRedCross(i, j);
      }
    }
  }
}

function drawShips(idxX: number, idxY: number) {
  const rows = props.grid.length;
  const cols = props.grid[0]?.length ?? 0;

  const shipData = props.grid[idxX]?.[idxY]?.shipData;
  if (!shipData) return;

  const hasTopNeighbor =
    idxY > 0 &&
    props.grid[idxX]?.[idxY - 1]?.shipData?.connectsTo === shipData.connectsTo;

  const hasBottomNeighbor =
    idxY < rows - 1 &&
    props.grid[idxX]?.[idxY + 1]?.shipData?.connectsTo === shipData.connectsTo;

  const hasLeftNeighbor =
    idxX > 0 &&
    props.grid[idxX - 1]?.[idxY]?.shipData?.connectsTo === shipData.connectsTo;

  const hasRightNeighbor =
    idxX < cols - 1 &&
    props.grid[idxX + 1]?.[idxY]?.shipData?.connectsTo === shipData.connectsTo;

  const leftX = hasLeftNeighbor ? 0 : 5;
  const rightX = hasRightNeighbor ? 0 : 5;
  const topY = hasTopNeighbor ? 0 : 5;
  const bottomY = hasBottomNeighbor ? 0 : 5;

  ctx.value!.fillRect(
    idxX * cellSize + leftX + labelMargin,
    idxY * cellSize + topY + labelMargin,
    cellSize - leftX - rightX,
    cellSize - topY - bottomY,
  );
}

function drawRedCross(i: number, j: number) {
  if (!ctx.value) return;

  const padding = 5;
  const x = i * cellSize + labelMargin;
  const y = j * cellSize + labelMargin;

  ctx.value.strokeStyle = "red";
  ctx.value.lineWidth = 3;

  ctx.value.beginPath();
  ctx.value.moveTo(x + padding, y + padding);
  ctx.value.lineTo(x + cellSize - padding, y + cellSize - padding);
  ctx.value.moveTo(x + cellSize - padding, y + padding);
  ctx.value.lineTo(x + padding, y + cellSize - padding);
  ctx.value.stroke();
}

function click(event: MouseEvent) {
  const rect = canvas.value!.getBoundingClientRect();
  const x = event.clientX - rect.left - labelMargin;
  const y = event.clientY - rect.top - labelMargin;

  const i = Math.floor(x / cellSize);
  const j = Math.floor(y / cellSize);

  if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
    emit("clicked", { x: i, y: j } as Cord);
  }
}

onMounted(() => {
  ctx.value = canvas.value!.getContext("2d");
  drawGrid();

  if (props.hasListener) {
    canvas.value!.addEventListener("mousedown", click);
  }
});
</script>

<template>
  <div>
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" />
  </div>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
