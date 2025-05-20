<script setup lang="ts">
import {onMounted, ref, type Ref} from "vue";
import type {Cell, Cord} from "#shared/gameTypes";

const props = defineProps<{
  hasListener: boolean;
  grid: Cell[][];
}>();

watch(props.grid, () => {
  drawGrid();
});

const emit = defineEmits(["clicked"]);

const canvasWidth = 400;
const canvasHeight = 400;
const gridSize = 10;
const cellSize = canvasHeight / gridSize;
const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);

function drawGrid() {
  ctx.value!.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      ctx.value!.strokeStyle = "black";
      ctx.value!.lineWidth = 1;
      ctx.value!.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const shipData = props.grid[i]![j]!.shipData;

      if (!shipData) {
        if (props.grid[i]![j]!.isHit) drawRedCross(i, j);
        continue
      }

      ctx.value!.fillStyle = props.grid[i]![j]!.shipData!.color;
      drawShips(i, j);

      if (props.grid[i]![j]!.isHit) drawRedCross(i, j);
    }
  }
}

function drawRedCross(i: number, j: number) {
  const padding = 5;
  const x = i * cellSize;
  const y = j * cellSize;

  ctx.value!.strokeStyle = "red";
  ctx.value!.lineWidth = 3;

  ctx.value!.beginPath();
  ctx.value!.moveTo(x + padding, y + padding);
  ctx.value!.lineTo(x + cellSize - padding, y + cellSize - padding);
  ctx.value!.moveTo(x + cellSize - padding, y + padding);
  ctx.value!.lineTo(x + padding, y + cellSize - padding);
  ctx.value!.stroke();
}

function drawShips(idxX: number, idxY: number) {
  const rows = props.grid.length;
  const cols = props.grid[0]!.length;

  const shipData = props.grid[idxX]![idxY]!.shipData;

  if (!shipData) return;

  const hasTopNeighbor =
      idxY > 0 &&
      props.grid[idxX]?.[idxY - 1]?.shipData &&
      props.grid[idxX]![idxY - 1]!.shipData!.connectsTo === shipData.connectsTo;

  const hasBottomNeighbor =
      idxY < rows - 1 &&
      props.grid[idxX]?.[idxY + 1]?.shipData &&
      props.grid[idxX]![idxY + 1]!.shipData!.connectsTo === shipData.connectsTo;

  const hasLeftNeighbor =
      idxX > 0 &&
      props.grid[idxX - 1]?.[idxY]?.shipData &&
      props.grid[idxX - 1]![idxY]!.shipData!.connectsTo === shipData.connectsTo;

  const hasRightNeighbor =
      idxX < cols - 1 &&
      props.grid[idxX + 1]?.[idxY]?.shipData &&
      props.grid[idxX + 1]![idxY]!.shipData!.connectsTo === shipData.connectsTo;


  const leftX = hasLeftNeighbor ? 0 : 5;
  const rightX = hasRightNeighbor ? 0 : 5;
  const topY = hasTopNeighbor ? 0 : 5;
  const bottomY = hasBottomNeighbor ? 0 : 5;

  ctx.value!.fillRect(
      idxX * cellSize + leftX,
      idxY * cellSize + topY,
      cellSize - leftX - rightX,
      cellSize - topY - bottomY,
  );
}

function click(event: MouseEvent) {
  const rect = canvas.value!.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const i = Math.floor(x / cellSize);
  const j = Math.floor(y / cellSize);

  emit("clicked", {x: i, y: j} as Cord);
}

onMounted(() => {
  ctx.value = canvas.value!.getContext("2d");

  drawGrid();

  if (!props.hasListener) return;

  canvas.value!.addEventListener("mousedown", click);
});
</script>

<template>
  <div>
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"/>
  </div>
</template>

<style scoped>
canvas {
  border: 1px solid #d3d3d3;
}
</style>
