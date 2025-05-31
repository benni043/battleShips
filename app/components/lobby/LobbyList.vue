<script setup lang="ts">
import type { LobbyResponse } from "#shared/lobbyTypes";

const emit = defineEmits(["submit"]);

defineProps<{
  games: LobbyResponse[];
}>();

function handleSubmit(lobbyId: string) {
  emit("submit", lobbyId);
}
</script>

<template>
  <div class="mx-auto max-w-md rounded-lg bg-white p-4 shadow">
    <div v-for="game in games" :key="game.lobbyId" class="mb-2">
      <button
        class="w-full rounded-md border border-gray-300 px-4 py-2 text-left transition hover:cursor-pointer hover:bg-gray-100"
        @click="handleSubmit(game.lobbyId)"
      >
        {{ game.lobbyName }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
