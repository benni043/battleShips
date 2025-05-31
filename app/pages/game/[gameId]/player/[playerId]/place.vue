<script setup lang="ts">
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

import GridLayout from "~/components/game/layout/GridLayout.vue";
import { FetchError } from "ofetch";
import { useMyGridStore } from "~/stores/myGrid";
import PlaceGrid from "~/components/game/canvas/PlaceGrid.vue";

const route = useRoute();
const gridStore = useMyGridStore();

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

    navigateTo(`/game/${route.params.gameId}/player/${route.params.playerId}`);
  } catch (error) {
    if (error instanceof FetchError) {
      if (error?.status === 403) {
        toast.error(`${error.statusMessage}`);
      } else if (error?.status === 404) {
        toast.error(`${error.statusMessage}`);
      } else if (error?.status === 405) {
        toast.error(`${error.statusMessage}`);
      } else {
        toast.error(`Unknown error occurred: ${error.statusMessage}`);
      }
    } else {
      console.error("unknown error: ", error);
    }
  }
}
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
