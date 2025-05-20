<script setup lang="ts">
import SimpleGrid from "~/components/game/SimpleGrid.vue";
import {
  type Cell,
  type Cord, type GameFinished,
  GameError,
  type HitResponse,
} from "#shared/gameTypes";
import {useSocket} from "~/utils/useSocketIO";

const socket = useSocket();
const route = useRoute();

const gridStore = useMyGridStore();
const gridSize = 10;

const myGrid: Ref<Cell[][]> = ref(gridStore.grid);
const opponentsGrid: Ref<Cell[][]> = ref(initGrid());

let isGameFinished = ref(false);

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
  socket.emit("click", cord, hitResponseCallBack);
}

function hitResponseCallBack(hitResponse: HitResponse | GameError) {
  switch (hitResponse) {
    case GameError.WRONG_PLAYER: {
      console.error("Dein Gegner ist an der Reihe!");
      break;
    }
    case GameError.INVALID_CORD: {
      console.error("Ungültige Coordinaten");
      break;
    }
    case GameError.INVALID_ID: {
      console.error("ID ist falsch");
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

socket.on("hit-response", (cord: Cord) => {
  myGrid.value[cord.x]![cord.y]!.isHit = true;
});

socket.on("game-finished", (gameFinished: GameFinished) => {
  isGameFinished.value = true;
  console.log(gameFinished);
})
</script>

<template>
  <div>
    <h1>game {{ route.params.id }}</h1>

    <div id="fields">
      <div class="grid-container">
        <div class="player-grid">
          <h3>Player1</h3>

          <SimpleGrid :grid="myGrid" :has-listener="false"/>
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
