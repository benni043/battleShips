<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import type { Cell, Cord } from "#shared/gameTypes";
import {
  gridSize,
  labelMargin,
  canvasWidth,
  canvasHeight,
  cellSize,
} from "~/utils/rendering";

const props = defineProps<{
  hasListener: boolean;
  grid: Cell[][];
}>();

const emit = defineEmits(["clicked"]);

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

useDrawGrid(props.grid, undefined, canvas);

watch(
  () => props.hasListener,
  (newVal) => {
    if (!newVal) canvas.value!.removeEventListener("mousedown", click);
  },
);

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
