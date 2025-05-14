<script setup lang="ts">

import {useSocket} from "~/utils/useSocketIO";

const socket = useSocket();

const games: Ref<string[]> = ref([""]);

socket.on("new-game", (gameName: string) => {
  games.value.push(gameName);
})

socket.on("get-all-games", (gameList: string[]) => {
  games.value = gameList;
})

</script>

<template>
  <div>
    <ul>
      <li v-for="game in games" :key="game">
        {{ game }}
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>