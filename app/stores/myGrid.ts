import type { Cell } from "#shared/gameTypes";

export const useMyGridStore = defineStore("myGrid", {
  state: () => ({
    grid: [] as Cell[][],
  }),
  actions: {
    initGrid() {
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
    },
  },
});
