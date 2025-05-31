<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import type { Cell, Cord } from "#shared/gameTypes";
import {
  gridSize,
  labelMargin,
  canvasWidth,
  canvasHeight,
  cellSize,
  drawShip,
  getNormalTileSet,
  drawGrid,
  getBrokenTileSet,
  drawHitIcon,
} from "~/utils/ship";

const props = defineProps<{
  hasListener: boolean;
  grid: Cell[][];
}>();

const emit = defineEmits(["clicked"]);

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);

watch(props.grid, () => {
  draw();
});

watch(
  () => props.hasListener,
  (newVal) => {
    if (!newVal) canvas.value!.removeEventListener("mousedown", click);
  },
);

function draw() {
  if (!ctx.value) return;

  ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);

  drawGrid(ctx.value);

  // draw ships and hits
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = props.grid[i]?.[j];
      if (!cell) continue;

      const shipData = cell.shipData;

      const tileset = cell.isHit ? getBrokenTileSet() : getNormalTileSet();

      if (shipData) {
        drawShip(i, j, props.grid, ctx.value!, tileset);
      } else if (cell.isHit) {
        drawHitIcon(i, j, ctx.value!, tileset);
      }
    }
  }
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

  draw();
  getNormalTileSet().onload = () => {
    draw();
  };
  getBrokenTileSet().onload = () => {
    draw();
  };

  if (props.hasListener) canvas.value!.addEventListener("mousedown", click);
});
</script>

<template>
  <canvas
    ref="canvas"
    :width="canvasWidth"
    :height="canvasHeight"
    class="z-1"
  />
</template>

<style scoped>
canvas {
  display: block;
}
</style>
