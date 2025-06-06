<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import type { Cell, Cord } from "#shared/gameTypes";
import { gridSize } from "~/utils/rendering";

const props = defineProps<{
  hasListener: boolean;
  grid: Cell[][];
}>();

const emit = defineEmits(["clicked"]);

const canvas: Ref<HTMLCanvasElement | null> = ref(null);

const { cellSize } = useDrawGrid(props.grid, undefined, canvas);

watch(
  () => props.hasListener,
  (newVal) => {
    if (!newVal) canvas.value!.removeEventListener("pointerdown", click);
  },
);

function click(event: PointerEvent) {
  const rect = canvas.value!.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const i = Math.floor(x / cellSize.value);
  const j = Math.floor(y / cellSize.value);

  if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
    emit("clicked", { x: i, y: j } as Cord);
  }
}

onMounted(() => {
  if (props.hasListener) canvas.value!.addEventListener("pointerdown", click);
});
</script>

<template>
  <canvas ref="canvas" class="z-1 aspect-square touch-none" />
</template>

<style scoped>
canvas {
  display: block;
}
</style>
