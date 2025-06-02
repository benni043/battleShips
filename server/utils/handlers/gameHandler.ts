import type { Server, Socket } from "socket.io";
import { gameService } from "~~/server/utils/services/gameService";
import type { Cord, Game, GameFinished, HitResponse } from "#shared/gameTypes";
import { GameState, GameError } from "#shared/gameTypes";

export function handleGameEvents(socket: Socket, io: Server) {
  socket.on("place", (gameId: string) => {
    console.log(gameId);
    socket.join(gameId);
  });

  socket.on("post-socket", (gameId: string, id: string, cb) => {
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
    const gameState = gameService.getGameState(gameId);

    if (gameState === GameState.WAITING) {
      cb(GameError.NOT_STARTED);
      return;
    }

    if (gameState === GameState.FINISHED) {
      cb(GameError.FINISHED);
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
      }

      return;
    }

    cb(shipData);
  });

  socket.on("manual-disconnect", (gameId: string) => {
    console.log("manual remove");
    const removed = gameService.tryRemove(gameId, socket);

    console.log(removed);

    if (removed) {
      socket.to(gameId).emit("opponent-disconnected");
    }
  });
}
