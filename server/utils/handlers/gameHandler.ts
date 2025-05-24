import type { Server, Socket } from "socket.io";
import { gameService } from "~~/server/utils/services/gameService";
import type { Cord, GameFinished, HitResponse } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";

export function handleGameEvents(socket: Socket, io: Server) {
  socket.on("post-socket", (gameName: string, id: string, cb) => {
    const response = gameService.setSocket(id, gameName, socket);

    if (gameService.isGameStarted(gameName)) {
      const game = gameService.getGameByName(gameName);

      if (game !== GameError.INVALID_GAME) {
        socket.emit(
          "opponent",
          game.player1.socket!.id,
          game.player1.socket!.id,
        );
        game.player1.socket!.emit(
          "opponent",
          game.player2!.socket!.id,
          game.player1.socket!.id,
        );
      }
    }

    cb(response);
  });

  socket.on("click", (id: string, gameName: string, cord: Cord, cb) => {
    if (!gameService.isStarted(gameName)) {
      cb(GameError.NOT_STARTED);
      return;
    }

    socket.join(gameName);

    const shipData = gameService.handleClick(id, gameName, cord);

    if (
      shipData !== GameError.INVALID_CORD &&
      shipData !== GameError.WRONG_PLAYER &&
      shipData !== GameError.ALREADY_HIT
    ) {
      gameService.getOpponentSocket(gameName).emit("hit-response", cord);

      cb({ cord: cord, shipData: shipData.shipData } as HitResponse);

      io.to(gameName).emit("current", gameService.getCurrentPlayer(gameName));

      if (shipData.gameFinished) {
        io.to(gameName).emit("game-finished", {
          winner: "player",
        } as GameFinished);

        gameService.removeGame(gameName);
      }

      return;
    }

    cb(shipData);
  });

  socket.on("manual-disconnect", (gameName: string) => {
    gameService.tryRemove(gameName, socket);
  });
}
