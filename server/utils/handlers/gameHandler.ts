import type { Socket } from "socket.io";
import type { GameLobby } from "#shared/types";
import type { Cell, Cord, GameFinished, HitResponse } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";
import { GameService } from "~~/server/utils/services/gameService";

export class GameHandler {
  gameService: GameService = new GameService();

  constructor(game: GameLobby) {
    this.gameService.setGameLobby(game);

    this.handlePostField(game.socketPlayer1);
    this.handlePostField(game.socketPlayer2!);

    game.socketPlayer2?.on("ready", () => {
      io.to(game.gameName).emit("send-field");
    });

    this.handleClick(game.socketPlayer1);
    this.handleClick(game.socketPlayer2!);

    this.handleLeave(game.socketPlayer1);
    this.handleLeave(game.socketPlayer2!);
  }

  handlePostField(socket: Socket) {
    socket.on("post-field", (grid: string, cb) => {
      const parse: Cell[][] = JSON.parse(grid);

      this.gameService.setGame(parse, socket.id);

      cb();
    });
  }

  handleClick(socket: Socket) {
    socket.on("click", (cord: Cord, cb) => {
      const shipData = this.gameService.handleClick(cord, socket.id);

      if (
        shipData !== GameError.INVALID_CORD &&
        shipData !== GameError.WRONG_PLAYER &&
        shipData !== GameError.ALREADY_HIT
      ) {
        this.gameService.getOpponentSocket().emit("hit-response", cord);
        cb({ cord: cord, shipData: shipData.shipData } as HitResponse);

        if (shipData.gameFinished)
          io.to(this.gameService.getGameName()).emit("game-finished", {
            winner: "player",
          } as GameFinished);

        return;
      }

      cb(shipData);
    });
  }

  handleLeave(socket: Socket) {
    socket.on("leave", () => {
      socket.leave(this.gameService.getGameName());
      socket.join("lobby");
    });
  }
}
