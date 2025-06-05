import type { Namespace, Socket } from "socket.io";
import { gameService } from "~~/server/utils/services/gameService";
import type { Cord, GameFinished, HitResponse } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";
import type { Game } from "~~/server/utils/types/gameTypes";
import { GameState } from "~~/server/utils/types/gameTypes";

export function handleGameEvents(socket: Socket, io: Namespace) {
  socket.on("post-socket", (gameId: string, id: string, cb) => {
    console.log(`User: ${socket.id} connected to ${gameId}`);

    const response = gameService.setSocket(id, gameId, socket);

    if (response === GameError.INVALID_GAME) {
      cb(response);
      return;
    }

    socket.join(gameId);

    const game = gameService.getGameById(gameId) as Game;
    socket.emit("gameName", game.gameName);

    socket.emit("current", gameService.getCurrentPlayer(gameId));
    socket.emit("opponent", gameService.getOpponentUserName(gameId, id));

    const gameState = gameService.getGameState(gameId);

    if (gameState === GameState.STARTED) {
      socket.emit(
        "my-grid",
        JSON.stringify(gameService.getMyField(gameId, id)),
      );

      socket.emit(
        "opponents-grid",
        JSON.stringify(gameService.getOpponentField(gameId, id)),
      );
    }
  });

  socket.on("click", (id: string, gameId: string, cord: Cord, cb) => {
    const shipData = gameService.handleClick(id, gameId, cord);

    if (
      shipData === GameError.NOT_STARTED ||
      shipData === GameError.FINISHED ||
      shipData === GameError.INVALID_GAME ||
      shipData === GameError.INVALID_CORD ||
      shipData === GameError.ALREADY_HIT ||
      shipData === GameError.WRONG_PLAYER
    ) {
      cb(shipData);
      return;
    }

    const opponentSocket = gameService.getOpponentSocket(gameId);
    (opponentSocket as Socket).emit("hit-response", cord);

    cb({ cord: cord, shipData: shipData.shipData } as HitResponse);

    if (shipData.gameFinished) {
      io.to(gameId).emit("game-finished", {
        winner: gameService.getWinner(gameId),
      } as GameFinished);

      return;
    }

    const current = gameService.getCurrentPlayer(gameId);
    io.to(gameId).emit("current", current);
  });

  socket.on("manual-disconnect", (gameId: string) => {
    const removed = gameService.tryRemove(gameId, socket);

    if (removed) socket.to(gameId).emit("opponent-disconnected");
  });
}
