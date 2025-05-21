import type { Server, Socket } from "socket.io";
import type { Cell } from "#shared/gameTypes";

export function handleGamePlaceEvents(socket: Socket, io: Server) {
  socket.on("post-field", (id: string, gameName: string, grid: string, cb) => {
    const parse: Cell[][] = JSON.parse(grid);

    lobbyService.setGrid(id, gameName, parse);

    cb();
  });
}
