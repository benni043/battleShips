import type {Socket} from "socket.io";

export type GameLobby = {
    socketPlayer1: Socket;
    socketPlayer2: Socket | undefined;
}

export type GameCreationResponse = {
    success: boolean,
    errorType: GameCreationError | undefined,
}

export enum GameCreationError {
    INVALID,
    ALREADY_TAKEN,
}

export enum GameJoinError {
    FULL
}

export type GameJoinResponse = {
    success: boolean,
    errorType: GameJoinError | undefined,
}