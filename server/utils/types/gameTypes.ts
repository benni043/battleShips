import type { Socket } from "socket.io";
import type { Cell } from "#shared/gameTypes";

export type Player = {
  id: string;
  username: string;
  field: Cell[][] | undefined;
  socket: Socket | undefined;
};

export type Game = {
  player1: Player;
  player2: Player;
  gameName: string;
  id: string;
  state: GameState;
  isPlayer1Active: boolean;
};

export enum GameState {
  WAITING,
  STARTED,
  FINISHED,
}
