import type { Socket } from "socket.io";
import type { Cell } from "#shared/gameTypes";

export type Player = {
  id: string;
  username: string;
  field: Cell[][] | undefined;
  socket: Socket | undefined;
};
