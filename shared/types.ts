import type { Socket } from "socket.io";

export type GameLobby = {
  socketPlayer1: Socket;
  socketPlayer2: Socket | undefined;
  state: GameState;
  gameName: string;
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
