<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import type { Cell, Cord } from "#shared/gameTypes";
import {
  gridSize,
  labelMargin,
  canvasWidth,
  canvasHeight,
  cellSize,
  drawHeaderOfGrid,
  drawShip,
  getTileSet,
} from "~/utils/ship";

const props = defineProps<{
  hasListener: boolean;
  grid: Cell[][];
}>();

const emit = defineEmits(["clicked"]);

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

  //draw header
  drawHeaderOfGrid(ctx.value);

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

      drawShip(i, j, props.grid, ctx.value!);

      if (cell.isHit && !props.hasListener) drawRedCross(i, j);
    }
  }
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
  ctx.value!.imageSmoothingEnabled = false;

  drawGrid();
  getTileSet().onload = () => {
    drawGrid();
  };

  if (props.hasListener) canvas.value!.addEventListener("mousedown", click);
});
</script>

<template>
  <div
    class="mx-auto h-[490px] w-[490px] rounded-lg bg-white p-[15px] shadow-md"
  >
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" />
  </div>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
