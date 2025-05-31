import type { Server, Socket } from "socket.io";
import { gameService } from "~~/server/utils/services/gameService";
import type { Cord, GameFinished, HitResponse } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";

export function handleGameEvents(socket: Socket, io: Server) {
  socket.on("post-socket", (gameId: string, id: string, cb) => {
    const response = gameService.setSocket(id, gameId, socket);

    socket.join(gameId);

    if (gameService.isGameStarted(gameId)) {
      const game = gameService.getGameByName(gameId);

      if (game !== GameError.INVALID_GAME) {
        socket.emit("opponent", game.player1.username!, game.player1.username!);
        game.player1.socket!.emit(
          "opponent",
          game.player2!.username!,
          game.player1.username!,
        );
      }
    }

    cb(response);
  });

  socket.on("click", (id: string, gameId: string, cord: Cord, cb) => {
    if (!gameService.isStarted(gameId)) {
      cb(GameError.NOT_STARTED);
      return;
    }

    const shipData = gameService.handleClick(id, gameId, cord);

    if (
      shipData !== GameError.INVALID_CORD &&
      shipData !== GameError.WRONG_PLAYER &&
      shipData !== GameError.ALREADY_HIT &&
      shipData !== GameError.INVALID_GAME
    ) {
      const current = gameService.getCurrentPlayer(gameId);
      io.to(gameId).emit("current", current);

      const opponentSocket = gameService.getOpponentSocket(gameId);

      if (opponentSocket !== GameError.INVALID_GAME)
        opponentSocket.emit("hit-response", cord);

      cb({ cord: cord, shipData: shipData.shipData } as HitResponse);

      if (shipData.gameFinished) {
        io.to(gameId).emit("game-finished", {
          winner: gameService.getWinner(gameId),
        } as GameFinished);

        gameService.removeGame(gameId);
      }

      return;
    }

    cb(shipData);
  });

  socket.on("manual-disconnect", (gameName: string) => {
    gameService.tryRemove(gameName, socket);
  });
}
