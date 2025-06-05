export type Cell = {
  shipData: ShipData | undefined;
  isHit: boolean;
  visualCord: Cord;
  gridCord: Cord;
};

export type ShipData = {
  connectsTo: number;
};

export type Cord = {
  x: number;
  y: number;
};

export type Hit = {
  shipData: ShipData | undefined;
  gameFinished: boolean;
};

export type HitResponse = {
  cord: Cord;
  shipData: ShipData | undefined;
};

export enum GameError {
  WRONG_PLAYER = "WRONG_PLAYER",
  INVALID_CORD = "INVALID_CORD",
  INVALID_ID = "INVALID_ID",
  INVALID_GAME = "INVALID_GAME",
  ALREADY_HIT = "ALREADY_HIT",
  NOT_STARTED = "NOT_STARTED",
  FINISHED = "FINISHED",
  ALREADY_JOINED = "ALREADY_JOINED",
}

export type GameFinished = {
  winner: string;
};

export type GameResponse = {
  gameId: string;
  gameName: string;
};
