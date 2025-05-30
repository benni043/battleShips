<script setup lang="ts">
import PlaceGrid from "~/components/game/PlaceGrid.vue";
import type { GameDisplayData } from "~/utils/types";
import { GridDisplayType } from "~/utils/types";
import GameGrid from "~/components/game/GameGrid.vue";

defineProps<{
  headers: string[];
  count: number;
  gridDisplayType: GridDisplayType;
  gameDisplayData: GameDisplayData[] | undefined;
}>();

const emit = defineEmits(["clicked"]);
</script>

<template>
  <div id="fields" class="flex w-full items-center justify-around">
    <div v-for="i in count" :key="i">
      <h1 class="h-6 text-center text-xl leading-6 font-semibold text-gray-700">
        {{ headers[i - 1] }}
      </h1>

      <div class="m-[40px]">
        <div class="ml-[40px] flex">
          <div
            v-for="n in 10"
            :key="'top-' + n"
            class="flex h-[40px] w-[40px] items-center justify-center pb-7 text-xl font-medium text-gray-700"
          >
            {{ String.fromCharCode(64 + n) }}
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="flex flex-col">
            <div
              v-for="n in 10"
              :key="'top-' + n"
              class="flex h-[40px] w-[40px] items-center justify-center pr-7 text-xl font-medium text-gray-700"
            >
              {{ n }}
            </div>
          </div>

          <div class="flex items-center justify-center">
            <PlaceGrid
              v-if="gridDisplayType === GridDisplayType.PLACE"
            ></PlaceGrid>

            <GameGrid
              v-if="gridDisplayType === GridDisplayType.GAME"
              :has-listener="gameDisplayData!.at(i - 1)!.hasListener"
              :grid="gameDisplayData!.at(i - 1)!.grid"
              @clicked="(args) => emit('clicked', args)"
            ></GameGrid>

            <img
              src="assets/img/border.png"
              alt="border"
              class="absolute h-[480px] w-[480px]"
              style="image-rendering: pixelated"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
