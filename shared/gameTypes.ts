import type { Socket } from "socket.io";

export interface Cell {
  shipData: ShipData | undefined;
  isHit: boolean;
  visualCord: Cord;
  gridCord: Cord;
}

export interface ShipData {
  connectsTo: number;
}

export interface Cord {
  x: number;
  y: number;
}

export interface Hit {
  shipData: ShipData | undefined;
  gameFinished: boolean;
}

export interface HitResponse {
  cord: Cord;
  shipData: ShipData | undefined;
}

export enum GameError {
  WRONG_PLAYER = "WRONG_PLAYER",
  INVALID_CORD = "INVALID_CORD",
  INVALID_ID = "INVALID_ID",
  INVALID_GAME = "INVALID_GAME",
  ALREADY_HIT = "ALREADY_HIT",
  NOT_STARTED = "NOT_STARTED",
}

export interface GameFinished {
  winner: string;
}

export type Game = {
  player1: Player;
  player2: Player | undefined;
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

export interface Player {
  id: string;
  username: string;
  field: Cell[][] | undefined;
  socket: Socket | undefined;
}
