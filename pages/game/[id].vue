<script setup lang="ts">
import SimpleGrid from "~/components/game/SimpleGrid.vue";
import {type Cell, type Cord, FieldType} from "#shared/gameTypes";
import {useSocket} from "~/utils/useSocketIO";

const socket = useSocket();

const route = useRoute()
console.log(route.params.id)

const gridStore = useMyGridStore();

const gridSize = 10;

const myGrid: Ref<Cell[][]> = ref(gridStore.grid);
const opponentsGrid: Ref<Cell[][]> = ref(initGrid());

function initGrid() {
  const grid: Cell[][] = [];

  for (let x = 0; x < gridSize; x++) {
    grid[x] = [];

    for (let y = 0; y < gridSize; y++) {
      grid[x][y] = {
        type: {
          fieldType: FieldType.WATER,
          isHit: false
        },
        id: undefined,
        color: "white",
        x: x,
        y: y,
        originX: x,
        originY: y,
      }
    }
  }

  return grid;
}

function click(cord: Cord) {
  console.log(cord);
}

socket.emit("post-field", JSON.stringify(gridStore.grid));

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

          <SimpleGrid :grid="opponentsGrid" :has-listener="true" @clicked="args => click(args)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>