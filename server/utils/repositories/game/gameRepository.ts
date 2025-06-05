import type { Cell, Cord, Hit, GameResponse } from "#shared/gameTypes";
import { GameError } from "#shared/gameTypes";
import type { Socket } from "socket.io";
import {
  isAlreadyHit,
  isAShipOnCord,
  isGameFinished,
  setCellHit,
} from "~~/server/utils/game/ship";
import type { Game } from "~~/server/utils/types/gameTypes";
import { GameState } from "~~/server/utils/types/gameTypes";
import type { LobbyPlayer } from "~~/server/utils/types/lobbyTypes";
import type { LobbyResponse } from "#shared/lobbyTypes";

export class GameRepository {
  private readonly games = new Map<string, Game>();

  addGame(
    player1: LobbyPlayer,
    player2: LobbyPlayer,
    gameId: string,
    gameName: string,
  ): GameResponse {
    const game: Game = {
      gameName,
      id: gameId,
      isPlayer1Active: true,
      state: GameState.WAITING,
      player1: {
        id: player1.id,
        username: player1.name,
        socket: undefined,
        field: undefined,
      },
      player2: {
        id: player2.id,
        username: player2.name,
        socket: undefined,
        field: undefined,
      },
    };

    this.games.set(gameId, game);
    return { gameId, gameName };
  }

  postField(gameId: string, playerId: string, field: Cell[][]) {
    const game = this.getGameById(gameId);
    if (playerId === game.player1.id) game.player1.field = field;
    else game.player2!.field = field;
    return game.id;
  }

  setSocket(playerId: string, gameId: string, socket: Socket) {
    const game = this.getGameById(gameId);
    if (playerId === game.player1.id) game.player1.socket = socket;
    else game.player2!.socket = socket;
  }

  getAllRunningGamesForPlayer(playerId: string): LobbyResponse[] {
    const games: LobbyResponse[] = [];
    this.games.forEach((game) => {
      if (game.player1.id === playerId || game.player2?.id === playerId) {
        games.push({ lobbyId: game.id, lobbyName: game.gameName });
      }
    });
    return games;
  }

  changeGameState(gameId: string, state: GameState) {
    const game = this.getGameById(gameId);
    game.state = state;
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }

  tryRemove(gameId: string, socket: Socket): boolean {
    const game = this.getGameById(gameId);
    if (socket.id === game.player1.socket?.id) game.player1.socket = undefined;
    else game.player2!.socket = undefined;

    if (!game.player1.socket && !game.player2?.socket) {
      this.removeGame(gameId);
      return true;
    }
    return false;
  }

  handleClick(id: string, gameId: string, cord: Cord) {
    const game = this.getGameById(gameId);

    const isPlayer1 = id === game.player1.id;
    const isPlayerTurn = game.isPlayer1Active === isPlayer1;

    if (!isPlayerTurn) return GameError.WRONG_PLAYER;

    const targetField = isPlayer1 ? game.player2!.field! : game.player1.field!;
    if (isAlreadyHit(cord, targetField)) return GameError.ALREADY_HIT;

    const shipData = isAShipOnCord(cord, targetField);
    if (shipData === GameError.INVALID_CORD) return shipData;

    setCellHit(cord, targetField);

    game.isPlayer1Active = !game.isPlayer1Active;

    const gameFinished = isGameFinished(targetField);
    if (gameFinished) game.state = GameState.FINISHED;

    return { gameFinished, shipData };
  }

  getGameById(gameId: string): Game {
    return this.games.get(gameId)!;
  }
}

export const gameRepository = new GameRepository();
