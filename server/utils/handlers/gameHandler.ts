import type { Server, Socket } from "socket.io";
import { gameService } from "~~/server/utils/services/gameService";
import type { Cord, Game, GameFinished, HitResponse } from "#shared/gameTypes";
import { GameState, GameError } from "#shared/gameTypes";

export function handleGameEvents(socket: Socket, io: Server) {
  socket.on("post-socket", (gameId: string, id: string, cb) => {
    const response = gameService.setSocket(id, gameId, socket);

    if (response === GameError.INVALID_GAME) {
      cb(response);
      return;
    }

    socket.join(gameId);

    const game = gameService.getGameById(gameId) as Game;

    if (game.state === GameState.STARTED) {
      socket.emit("opponent", game.player2!.username);
    } else {
      socket.emit("opponent", game.player1.username);
    }

    const current = gameService.getCurrentPlayer(gameId);

    socket.emit("current", current);
    socket.emit("gameName", game.gameName);
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

  socket.on("manual-disconnect", (gameName: string) => {
    gameService.tryRemove(gameName, socket);
  });
}
