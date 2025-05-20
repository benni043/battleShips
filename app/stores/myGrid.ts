import type { Cell } from "#shared/gameTypes";

export const useMyGridStore = defineStore("myGrid", {
  state: () => ({
    grid: [] as Cell[][],
  }),
});
