import type { Socket } from "socket.io";
import type { Cell } from "#shared/gameTypes";

export type Game = {
  player1: Player;
  player2: Player | undefined;
  gameName: string;
  state: GameState;
  isPlayer1Active: boolean;
};

export enum GameState {
  WAITING,
  STARTED,
  FINISHED,
}

export interface Player {
  id: string;
  field: Cell[][];
  socket: Socket | undefined;
}
