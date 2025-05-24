import type { Server, Socket } from "socket.io";
import { gameService } from "~~/server/utils/services/gameService";
import type { Cord, GameFinished, HitResponse } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";

export function handleGameEvents(socket: Socket, io: Server) {
  socket.on(
    "post-socket",
    (gameName: string, id: string, username: string, cb) => {
      const response = gameService.setSocket(id, gameName, username, socket);

      socket.join(gameName);

      if (gameService.isGameStarted(gameName)) {
        const game = gameService.getGameByName(gameName);

        if (game !== GameError.INVALID_GAME) {
          socket.emit(
            "opponent",
            game.player1.username!,
            game.player1.username!,
          );
          game.player1.socket!.emit(
            "opponent",
            game.player2!.username!,
            game.player1.username!,
          );
        }
      }

      cb(response);
    },
  );

  socket.on("click", (id: string, gameName: string, cord: Cord, cb) => {
    if (!gameService.isStarted(gameName)) {
      cb(GameError.NOT_STARTED);
      return;
    }

    const shipData = gameService.handleClick(id, gameName, cord);

    if (
      shipData !== GameError.INVALID_CORD &&
      shipData !== GameError.WRONG_PLAYER &&
      shipData !== GameError.ALREADY_HIT
    ) {
      const current = gameService.getCurrentPlayer(gameName);
      io.to(gameName).emit("current", current);

      gameService.getOpponentSocket(gameName).emit("hit-response", cord);

      cb({ cord: cord, shipData: shipData.shipData } as HitResponse);

      if (shipData.gameFinished) {
        io.to(gameName).emit("game-finished", {
          winner: gameService.getWinner(gameName),
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
