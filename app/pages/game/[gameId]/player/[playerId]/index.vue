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

const socket = io({
  path: "/api/socket.io",
});

const route = useRoute();

const userNameStore = useUserNameStore();

const gridStore = useMyGridStore();
const gridSize = 10;

const myGrid: Ref<Cell[][]> = ref(gridStore.grid);
const opponentsGrid: Ref<Cell[][]> = ref(initGrid());

const isGameFinished = ref(false);

const winner = ref("");
const current = ref("");

function initGrid() {
  const grid: Cell[][] = [];

  for (let x = 0; x < gridSize; x++) {
    grid.push([]);

    for (let y = 0; y < gridSize; y++) {
      grid[x]!.push({
        shipData: undefined,
        isHit: false,
        visualCord: { x: x, y: y },
        gridCord: { x: x, y: y },
      } as Cell);
    }
  }

  return grid;
}

function click(cord: Cord) {
  socket.emit(
    "click",
    route.params.playerId,
    route.params.gameId,
    cord,
    hitResponseCallBack,
  );
}

function handleError<T>(err: GameError | T): T | undefined {
  switch (err) {
    case GameError.WRONG_PLAYER: {
      toast.warning(`${userNameStore.opponent} ist an der Reihe!`);
      return undefined;
    }
    case GameError.INVALID_CORD: {
      toast.error(`Ungültige Koordinaten`);
      return undefined;
    }
    case GameError.ALREADY_HIT: {
      toast.warning(`Auf dieses Feld hast du bereits geschossen!`);
      return undefined;
    }
    case GameError.NOT_STARTED: {
      toast.error(`Das Spiel hat noch nicht gestartet!`);
      return undefined;
    }
    case GameError.INVALID_ID: {
      toast.error(`Ungültige ID!`);
      return undefined;
    }
    case GameError.INVALID_GAME: {
      toast.error(`Ungültiges Spiel!`);
      return undefined;
    }
    case GameError.FINISHED: {
      toast.error(`Spiel ist bereits beendet!`);
      return undefined;
    }
    default:
      return err;
  }
}

function hitResponseCallBack(data: HitResponse | GameError) {
  const hitResponse = handleError(data);

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
  current.value = currentRes;
});

socket.on("opponents-grid", (opponentGrid: string) => {
  console.log(JSON.parse(opponentGrid));
  console.log();
  console.log(opponentsGrid.value);
  //todo does not rerender
  // opponentsGrid.value = JSON.parse(opponentGrid) as Cell[][];
});

socket.emit("post-socket", route.params.gameId, route.params.playerId, joined);

function joined(response: GameError) {
  handleError(response);
}

onBeforeUnmount(() => {
  socket.emit("manual-disconnect", route.params.gameId, disconnect);
});

function disconnect() {
  console.log("disconnect");
  socket?.disconnect();
}
</script>

<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-12"
  >
    <Toaster close-button rich-colors position="top-right" />

    <button
      class="absolute top-6 left-6 rounded border border-red-600 bg-red-500 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-red-600"
      @click="leave()"
    >
      Verlassen
    </button>

    <div>
      <h1 class="mb-8 text-center text-3xl font-bold text-gray-800">
        Lobby: {{ userNameStore.game }}
      </h1>

      <h1 class="mb-8 text-center text-3xl font-bold text-gray-800">
        {{ current }} ist an der Reihe!
      </h1>

      <h1
        v-if="isGameFinished"
        class="mb-8 text-center text-xl font-semibold text-green-700"
      >
        Gewinner: {{ winner }}
      </h1>
    </div>

    <div id="fields" class="flex w-full items-center justify-around">
      <div>
        <GridLayout :header="userNameStore.getMe()!">
          <GameGrid
            :has-listener="false"
            :grid="myGrid"
            @clicked="(args: Cord) => click(args)"
          ></GameGrid>
        </GridLayout>
      </div>

      <div>
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
