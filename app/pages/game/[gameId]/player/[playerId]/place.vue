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

const ready = ref(false);

const socket = io("/place", {
  path: "/api/socket.io",
});

function start() {
  ready.value = true;
  socket.emit("ready", route.params.gameId, route.params.playerId);
}

socket.emit("join", route.params.gameId);

socket.on("start", async () => {
  try {
    await $fetch("/api/place", {
      method: "POST",
      body: {
        gameId: route.params.gameId,
        id: route.params.playerId,
        grid: JSON.stringify(gridStore.grid),
      },
    });

    navigateTo(`/game/${route.params.gameId}/player/${route.params.playerId}`);
  } catch (error) {
    if (error instanceof FetchError) {
      toast.error(`Status: ${error.status} - ${error.statusMessage}`);
    } else {
      console.error("unknown error: ", error);
    }
  }
});

socket.on("opponent-disconnected", () => {
  socket.disconnect();
  navigateTo("/lobby");
});

onBeforeUnmount(() => {
  socket.emit("manuel-disconnect", route.params.gameId);
});

const handleBeforeUnload = () => {
  socket.emit("manuel-disconnect", route.params.gameId);
};

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <div
    class="relative flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100"
  >
    <Toaster close-button rich-colors position="top-right" />

    <GridLayout header="Plaziere deine Schiffe">
      <PlaceGrid></PlaceGrid>
    </GridLayout>

    <button
      class="mt-6 w-40 rounded-xl border border-gray-400 bg-blue-600 py-3 text-white transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200"
      :disabled="ready"
      @click="start()"
    >
      {{ ready ? "Bitte warten..." : "Bereit" }}
    </button>
  </div>
</template>

<style scoped></style>
