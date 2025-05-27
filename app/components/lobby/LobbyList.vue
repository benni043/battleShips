<script setup lang="ts">
const emit = defineEmits(["submit"]);

defineProps<{
  games: string[];
}>();

function handleSubmit(gameName: string) {
  emit("submit", gameName);
}
</script>

<template>
  <div class="mx-auto max-w-md rounded-lg bg-white p-4 shadow">
    <div v-for="game in games" :key="game" class="mb-2">
      <button
        class="w-full rounded-md border border-gray-300 px-4 py-2 text-left transition hover:cursor-pointer hover:bg-gray-100"
        @click="handleSubmit(game)"
      >
        {{ game }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
