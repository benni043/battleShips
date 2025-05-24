<script setup lang="ts">
import SimpleGrid from "~/components/game/SimpleGrid.vue";
import {
  type Cell,
  type Cord,
  GameError,
  type GameFinished,
  type HitResponse,
} from "#shared/gameTypes";
import { io } from "socket.io-client";

const socket = io({
  path: "/api/socket.io",
});

const route = useRoute();

const gridStore = useMyGridStore();
const gridSize = 10;

const myGrid: Ref<Cell[][]> = ref(gridStore.grid);
const opponentsGrid: Ref<Cell[][]> = ref(initGrid());

const isGameFinished = ref(false);

function initGrid() {
  const grid: Cell[][] = [];

  for (let x = 0; x < gridSize; x++) {
    grid.push([]);

    for (let y = 0; y < gridSize; y++) {
      grid[x]!.push({
        shipData: undefined,
        isHit: false,
        x: x,
        y: y,
        originX: x,
        originY: y,
      } as Cell);
    }
  }

  return grid;
}

function click(cord: Cord) {
  socket.emit(
    "click",
    route.params.id,
    route.params.gameId,
    cord,
    hitResponseCallBack,
  );
}

function hitResponseCallBack(hitResponse: HitResponse | GameError) {
  switch (hitResponse) {
    case GameError.WRONG_PLAYER: {
      alert("Dein Gegner ist an der Reihe!");
      break;
    }
    case GameError.INVALID_CORD: {
      alert("Ungültige Coordinaten");
      break;
    }
    case GameError.ALREADY_HIT: {
      alert("Auf dieses Feld hast du bereits geschossen");
      break;
    }
    case GameError.NOT_STARTED: {
      alert("Spiel hat noch nicht gestartet");
      break;
    }
    case GameError.INVALID_ID: {
      alert("invalid id");
      break;
    }
    case GameError.INVALID_GAME: {
      alert("invalid game");
      break;
    }
    default: {
      opponentsGrid.value[hitResponse.cord.x]![hitResponse.cord.y]!.isHit =
        true;
      opponentsGrid.value[hitResponse.cord.x]![hitResponse.cord.y]!.shipData =
        hitResponse.shipData;
      break;
    }
  }
}

function leave() {
  navigateTo(`/`);
}

socket.on("hit-response", (cord: Cord) => {
  myGrid.value[cord.x]![cord.y]!.isHit = true;
});

socket.on("game-finished", (gameFinished: GameFinished) => {
  isGameFinished.value = true;
  console.log(gameFinished);
});

socket.emit("post-socket", route.params.gameId, route.params.id, joined);

function joined(response: GameError | undefined) {
  alert(response);
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
  <div>
    <h1>game {{ route.params.gameId }}</h1>
    <button
      class="mt-1 cursor-pointer rounded border-1 bg-red-500 px-1 hover:bg-gray-300"
      @click="leave()"
    >
      Leave
    </button>

    <div id="fields">
      <div class="grid-container">
        <div class="player-grid">
          <h3>Player1</h3>

          <SimpleGrid :grid="myGrid" :has-listener="false" />
        </div>

        <div class="player-grid">
          <h3>Player2</h3>

          <SimpleGrid
            :grid="opponentsGrid"
            :has-listener="!isGameFinished"
            @clicked="(args) => click(args)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
