export type ShipsConnections = {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
};

export enum PlaceState {
  ROTATE,
  MOVE,
}

export type User = {
  userName: string;
  uuid: string;
};

export enum GameMode {
  NORMAL,
  RUSSIAN,
}
