<script setup lang="ts">
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

import GridLayout from "~/components/game/layout/GridLayout.vue";
import { FetchError } from "ofetch";
import { useMyGridStore } from "~/stores/myGrid";
import PlaceGrid from "~/components/game/canvas/PlaceGrid.vue";
import { io } from "socket.io-client";

const route = useRoute();
const gridStore = useMyGridStore();

const socket = io({
  path: "/api/socket.io",
});

async function start() {
  try {
    await $fetch("/api/place", {
      method: "POST",
      body: {
        gameId: route.params.gameId,
        id: route.params.playerId,
        grid: JSON.stringify(gridStore.grid),
      },
    });

    socket.emit("ready", route.params.gameId, route.params.playerId);
  } catch (error) {
    if (error instanceof FetchError) {
      toast.error(`Status: ${error.status} - ${error.statusMessage}`);
    } else {
      console.error("unknown error: ", error);
    }
  }
}

socket.emit("join", route.params.gameId);

socket.on("start", () => {
  navigateTo(`/game/${route.params.gameId}/player/${route.params.playerId}`);
})

socket.on("opponent-disconnected", () => {
  console.log("opponent left");

  socket.disconnect();
  navigateTo("/lobby");
});

onBeforeUnmount(() => {
  socket.emit("place-disconnect", route.params.gameId);
});
</script>

<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-12"
  >
    <Toaster close-button rich-colors position="top-right" />

    <GridLayout header="Plaziere deine Schiffe">
      <PlaceGrid></PlaceGrid>
    </GridLayout>

    <button
      class="mt-6 w-40 rounded-xl border border-gray-400 bg-blue-600 py-3 text-white transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-green-500"
      @click="start()"
    >
      Start Game
    </button>
  </div>
</template>

<style scoped></style>
