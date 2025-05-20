<script setup lang="ts">
import { useSocket } from "~/utils/useSocketIO";

const emit = defineEmits(["submit"]);

const socket = useSocket();

const games: Ref<string[]> = ref([]);

socket.on("new-game", (gameName: string) => {
  games.value.push(gameName);
});

socket.on("remove-game", (gameName: string) => {
  const index = games.value.indexOf(gameName);

  if (index !== -1) games.value.splice(index, 1);
});

socket.on("get-all-games", (gameList: string[]) => {
  games.value = gameList;
});

function handleSubmit(gameName: string) {
  emit("submit", gameName);
}
</script>

<template>
  <div>
    <div v-for="game in games" :key="game">
      <button @click="handleSubmit(game)">{{ game }}</button>
    </div>
  </div>
</template>

<style scoped></style>
