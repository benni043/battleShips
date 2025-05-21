import type { Server, Socket } from "socket.io";

import { gameService } from "~~/server/utils/services/gameService";
import type { Cord, GameFinished, HitResponse } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";

export function handleGameEvents(socket: Socket, io: Server) {
  socket.on("start", (id: string, gameName: string) => {
    socket.join(gameName);
    lobbyService.setSocket(id, gameName, socket);
  });

  socket.on("click", (id: string, gameName: string, cord: Cord, cb) => {
    const shipData = gameService.handleClick(id, gameName, cord);

    if (
      shipData !== GameError.INVALID_CORD &&
      shipData !== GameError.WRONG_PLAYER &&
      shipData !== GameError.ALREADY_HIT &&
      shipData !== GameError.NOT_STARTED
    ) {
      gameService.getOpponentSocket(gameName).emit("hit-response", cord);

      cb({ cord: cord, shipData: shipData.shipData } as HitResponse);

      if (shipData.gameFinished)
        io.to(gameName).emit("game-finished", {
          winner: "player",
        } as GameFinished);

      return;
    }

    cb(shipData);
  });
}
