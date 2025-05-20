export interface Cell {
  shipData: ShipData | undefined;
  isHit: boolean;
  x: number;
  y: number;
  originX: number;
  originY: number;
}

export interface ShipData {
  connectsTo: number;
  color: string;
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
  ALREADY_HIT = "ALREADY_HIT",
}

export interface GameFinished {
  winner: string;
}
