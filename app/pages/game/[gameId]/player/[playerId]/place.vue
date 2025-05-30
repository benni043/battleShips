<script setup lang="ts">
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

import Test from "~/components/game/Test.vue";
import { FetchError } from "ofetch";
import { useMyGridStore } from "~/stores/myGrid";

const route = useRoute();
const gridStore = useMyGridStore();

async function start() {
  try {
    await $fetch("/api/place", {
      method: "POST",
      body: {
        lobby: route.params.gameId,
        id: route.params.playerId,
        grid: JSON.stringify(gridStore.grid),
      },
    });

    // gridSent.value = true;
    //
    // canvas.value!.removeEventListener("mousemove", mouseMove);
    // canvas.value!.removeEventListener("mouseup", mouseUp);
    // canvas.value!.removeEventListener("mousedown", mouseDown);

    navigateTo(`/game/${route.params.gameId}/player/${route.params.playerId}`);
  } catch (error) {
    if (error instanceof FetchError) {
      if (error?.status === 401) {
        console.error("unauthorized: ", error.statusMessage);
        toast.error(`Unauthorized: ${error.statusMessage}`);
      } else if (error?.status === 400) {
        console.error("illegal request: ", error.statusMessage);
        toast.error(`Illegal request: ${error.statusMessage}`);
      } else {
        console.error("unknown error: ", error);
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

    <Test header="Plaziere deine Schiffe" :count="1"></Test>

    <button
      class="mt-6 w-40 rounded-xl border border-gray-400 bg-blue-600 py-3 text-white transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-green-500"
      @click="start()"
    >
      Start Game
    </button>
  </div>
</template>

<style scoped></style>
