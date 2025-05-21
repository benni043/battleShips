import type { Socket } from "socket.io";
import type { Cell } from "#shared/gameTypes";

export type GameLobby = {
  player1: Player;
  player2: Player;
  gameName: string;
  state: GameState;
  isPlayer1Active: boolean;
};

export type GameCreationOrJoinResponse = {
  gameName: string;
};

export enum GameCreationError {
  INVALID,
  ALREADY_TAKEN,
}

export enum GameJoinError {
  FULL,
}

export enum GameState {
  WAITING,
  STARTED,
  FINISHED,
}

export interface Player {
  id: string | undefined;
  field: Cell[][] | undefined;
  socket: Socket | undefined;
}
