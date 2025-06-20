<script setup lang="ts">
import {
  type Cell,
  type Cord,
  GameError,
  type GameFinished,
  type HitResponse,
} from "#shared/gameTypes";
import { io } from "socket.io-client";
import { useUserNameStore } from "~/stores/data";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import GridLayout from "~/components/game/layout/GridLayout.vue";
import GameGrid from "~/components/game/canvas/GameGrid.vue";
import { FetchError } from "ofetch";
import { handleGameError } from "~/utils/errorHandling";

const socket = io("/game", {
  path: "/api/socket.io",
});

const route = useRoute();

const userNameStore = useUserNameStore();
const userNameCookie = useCookie("userName");

const gridStore = useMyGridStore();

const myGrid: Ref<Cell[][]> = ref(gridStore.initGrid());
const opponentsGrid: Ref<Cell[][]> = ref(gridStore.initGrid());

const isGameFinished = ref(false);

const winner = ref("");
const current = ref("");

function click(cord: Cord) {
  socket.emit(
    "click",
    route.params.playerId,
    route.params.gameId,
    cord,
    hitResponseCallBack,
  );
}

function hitResponseCallBack(data: HitResponse | GameError) {
  const hitResponse = handleGameError(data);

  if (hitResponse) {
    opponentsGrid.value[hitResponse.cord.x]![hitResponse.cord.y]!.isHit = true;
    opponentsGrid.value[hitResponse.cord.x]![hitResponse.cord.y]!.shipData =
      hitResponse.shipData;
  }
}

function leave() {
  navigateTo(`/lobby`);
}

socket.on("hit-response", (cord: Cord) => {
  myGrid.value[cord.x]![cord.y]!.isHit = true;
});

socket.on("game-finished", (gameFinished: GameFinished) => {
  isGameFinished.value = true;
  winner.value = gameFinished.winner;
});

socket.on("gameName", (gameName: string) => {
  userNameStore.game = gameName;
});

socket.on("opponent", (opponent: string) => {
  userNameStore.opponent = opponent;
});

socket.on("current", (currentRes: string) => {
  if (currentRes !== userNameStore.opponent) {
    current.value = "Du";
  } else {
    current.value = currentRes;
  }

  // showOwnGrid.value = current.value === userNameStore.opponent;
});

socket.on("opponents-grid", (opponentGrid: string) => {
  const newGrid = JSON.parse(opponentGrid) as Cell[][];

  for (let y = 0; y < opponentsGrid.value.length; y++) {
    for (let x = 0; x < opponentsGrid.value[y]!.length; x++) {
      opponentsGrid.value[y]![x]!.shipData = newGrid[y]![x]!.shipData;
      opponentsGrid.value[y]![x]!.isHit = newGrid[y]![x]!.isHit;
    }
  }
});

socket.on("my-grid", (grid: string) => {
  const newGrid = JSON.parse(grid) as Cell[][];

  for (let y = 0; y < myGrid.value.length; y++) {
    for (let x = 0; x < myGrid.value[y]!.length; x++) {
      myGrid.value[y]![x]!.shipData = newGrid[y]![x]!.shipData;
      myGrid.value[y]![x]!.isHit = newGrid[y]![x]!.isHit;
      myGrid.value[y]![x]!.gridCord = newGrid[y]![x]!.gridCord;
      myGrid.value[y]![x]!.visualCord = newGrid[y]![x]!.visualCord;
    }
  }
});

if (gridStore.grid.length > 0) {
  myGrid.value = gridStore.grid;
}

try {
  await $fetch("/api/isLobbyFree/", {
    method: "GET",
    query: {
      gameId: route.params.gameId,
      playerId: route.params.playerId,
    },
  });

  socket.emit(
    "post-socket",
    route.params.gameId,
    route.params.playerId,
    joined,
  );
} catch (error) {
  if (error instanceof FetchError) {
    toast.error(`Status: ${error.status} - ${error.statusMessage}`);
  } else {
    console.error("unknown error: ", error);
  }

  navigateTo(`/lobby`);
}

function joined(response: GameError) {
  handleError(response);
}

onBeforeUnmount(() => {
  socket.emit("manuel-disconnect", route.params.gameId);
});

const handleBeforeUnload = () => {
  socket.emit("manuel-disconnect", route.params.gameId);
};

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

const showOwnGrid = ref(false);
</script>

<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100"
  >
    <Toaster close-button rich-colors position="top-right" />

    <div class="flex w-full items-center justify-between pr-5 pl-5">
      <h1 class="text-center text-3xl font-bold text-gray-800">
        Lobby: {{ userNameStore.game }}
      </h1>

      <button
        class="h-min rounded border border-red-600 bg-red-500 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-red-600"
        @click="leave()"
      >
        Verlassen
      </button>
    </div>

    <div>
      <h1 class="m-5 text-center text-xl font-bold text-gray-800">
        <span v-if="current === 'Du'">{{ current }} bist an der Reihe!</span>
        <span v-if="current === userNameStore.opponent"
          >{{ current }} ist an der Reihe!</span
        >
      </h1>

      <h1
        v-if="isGameFinished"
        class="mb-8 text-center text-xl font-semibold text-green-700"
      >
        Gewinner: {{ winner }}
      </h1>
    </div>

    <div
      id="fields"
      class="flex w-full items-center justify-around not-lg:flex-col"
    >
      <div class="m-5 flex gap-5 lg:hidden">
        <button
          :disabled="showOwnGrid"
          class="rounded border border-black px-2 text-black transition not-disabled:cursor-pointer hover:bg-neutral-400 disabled:bg-black disabled:text-white"
          @click="showOwnGrid = true"
        >
          Eigenes
        </button>
        <button
          :disabled="!showOwnGrid"
          class="rounded border border-black px-2 text-black transition not-disabled:cursor-pointer hover:bg-neutral-400 disabled:bg-black disabled:text-white"
          @click="showOwnGrid = false"
        >
          Gegner
        </button>
      </div>

      <div :data-hidden="!showOwnGrid" class="not-lg:data-[hidden=true]:hidden">
        <GridLayout :header="userNameCookie">
          <GameGrid
            :has-listener="false"
            :grid="myGrid"
            @clicked="(args: Cord) => click(args)"
          ></GameGrid>
        </GridLayout>
      </div>

      <div :data-hidden="showOwnGrid" class="not-lg:data-[hidden=true]:hidden">
        <GridLayout :header="userNameStore.opponent">
          <GameGrid
            :has-listener="true"
            :grid="opponentsGrid"
            @clicked="(args: Cord) => click(args)"
          ></GameGrid>
        </GridLayout>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
