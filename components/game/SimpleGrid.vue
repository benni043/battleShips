<script setup lang="ts">

import {onMounted, ref, type Ref} from "vue";
import type {Cell, Cord} from "#shared/gameTypes";

const props = defineProps<{
  hasListener: boolean;
  grid: Cell[][];
}>();

watch(props.grid, () => {
  drawGrid();
})

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
      ctx.value!.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      ctx.value!.fillStyle = props.grid[i][j].color;
      drawShips(i, j);
    }
  }
}

function drawShips(x: number, y: number) {
  const rows = props.grid.length;
  const cols = props.grid[0].length;

  const id = props.grid[x][y].id;

  if (id === undefined) return;

  const hasTopNeighbor = y > 0 && props.grid[x][y - 1].id === id;
  const hasBottomNeighbor = y < rows - 1 && props.grid[x][y + 1].id === id;
  const hasLeftNeighbor = x > 0 && props.grid[x - 1][y].id === id;
  const hasRightNeighbor = x < cols - 1 && props.grid[x + 1][y].id === id;

  const leftX = hasLeftNeighbor ? 0 : 5;
  const rightX = hasRightNeighbor ? 0 : 5;
  const topY = hasTopNeighbor ? 0 : 5;
  const bottomY = hasBottomNeighbor ? 0 : 5;

  ctx.value!.fillRect(x * cellSize + leftX, y * cellSize + topY, cellSize - leftX - rightX, cellSize - topY - bottomY);
}

function click(event: MouseEvent) {
  const rect = canvas.value!.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const i = Math.floor(x / cellSize);
  const j = Math.floor(y / cellSize);

  emit("clicked", {x: i, y: j} as Cord)
}

onMounted(() => {
  ctx.value = canvas.value!.getContext('2d');

  drawGrid();

  if (!props.hasListener) return;

  canvas.value!.addEventListener("mousedown", click);
})

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