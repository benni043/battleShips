import type { Cell } from "#shared/gameTypes";

export type ShipsConnections = {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
};

export enum GridDisplayType {
  GAME,
  PLACE,
}

export type GameDisplayData = {
  hasListener: boolean;
  grid: Cell[][];
};
