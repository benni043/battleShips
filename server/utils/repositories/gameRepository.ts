import type { Cell, Cord, Game, Hit, GameResponse } from "#shared/gameTypes";
import { GameError, GameState } from "#shared/gameTypes";
import type { Socket } from "socket.io";
import {
  isAlreadyHit,
  isAShipOnCord,
  isGameFinished,
  setCellHit,
} from "~~/server/utils/ship";
import type { Player } from "~~/server/utils/types/gameTypes";
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
      gameName: gameName,
      id: gameId,
      isPlayer1Active: true,
      state: GameState.WAITING,
      player1: {
        id: player1.id,
        username: player1.name,
        socket: undefined,
        field: undefined,
      } as Player,
      player2: {
        id: player2.id,
        username: player2.name,
        socket: undefined,
        field: undefined,
      } as Player,
    };

    this.games.set(gameId, game);

    return { gameId, gameName };
  }

  postField(gameId: string, playerId: string, field: Cell[][]) {
    const game = this.games.get(gameId)!;

    if (playerId === game.player1.id) game.player1.field = field;
    else game.player2!.field = field;

    return game.id;
  }

  getMyField(gameId: string, playerId: string) {
    const me = this.getPlayerById(gameId, playerId)!;

    return me.field;
  }

  getOpponentField(gameId: string, playerId: string) {
    const opponent = this.getOpponent(gameId, playerId)!;

    return opponent.field!.map((row) =>
      row.map((cell) => ({
        ...cell,
        shipData: cell.isHit ? cell.shipData : undefined,
      })),
    );
  }

  getPlayerById(gameId: string, playerId: string) {
    const game = gameRepository.getGameById(gameId);

    if (game.player1.id === playerId) return game.player1;
    else return game.player2;
  }

  getOpponent(gameId: string, playerId: string) {
    const game = gameRepository.getGameById(gameId);

    if (game.player1.id === playerId) return game.player2;
    else return game.player1;
  }

  getOpponentUserName(gameId: string, playerId: string) {
    const game = gameRepository.getGameById(gameId);

    if (game.player1.id === playerId) return game.player2?.username;
    else return game.player1.username;
  }

  setSocket(playerId: string, gameId: string, socket: Socket) {
    const game = this.games.get(gameId)!;

    if (playerId === game.player1.id) game.player1.socket = socket;
    else game.player2!.socket = socket;
  }

  getAllRunningGamesForPlayer(playerId: string): LobbyResponse[] {
    const games: LobbyResponse[] = [];

    this.games.forEach((game: Game) => {
      if (game.player1.id === playerId || game.player2?.id === playerId)
        games.push({
          lobbyId: game.id,
          lobbyName: game.gameName,
        });
    });

    return games;
  }

  changeGameState(gameId: string, state: GameState) {
    const game = this.games.get(gameId)!;

    game.state = state;
  }

  getGameById(gameId: string) {
    return this.games.get(gameId)!;
  }

  getOpponentSocket(gameId: string) {
    const game = this.getGameById(gameId)!;

    if (game.isPlayer1Active) return game.player1!.socket!;
    else return game.player2!.socket!;
  }

  getGameState(gameId: string) {
    const game = this.getGameById(gameId)!;

    return game.state;
  }

  getCurrentPlayer(gameId: string) {
    const game = this.getGameById(gameId)!;

    if (game.isPlayer1Active) return game.player1!.username;
    else return game.player2!.username!;
  }

  getWinner(gameId: string) {
    const game = this.getGameById(gameId)!;

    if (game.isPlayer1Active) return game.player2!.username;
    else return game.player1!.username!;
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }

  tryRemove(gameId: string, socket: Socket) {
    const game = this.getGameById(gameId)!;

    if (socket.id === game.player1.socket?.id) game.player1.socket = undefined;
    else game.player2!.socket = undefined;

    if (!game.player1.socket && !game.player2?.socket) {
      this.removeGame(gameId);
      return true;
    }

    return false;
  }

  handleClick(id: string, gameId: string, cord: Cord) {
    const game = this.getGameById(gameId)!;

    if (id === game.player1!.id && game.isPlayer1Active) {
      const field = game.player2!.field!;

      if (isAlreadyHit(cord, field)) return GameError.ALREADY_HIT;

      const shipData = isAShipOnCord(cord, field);
      setCellHit(cord, field);

      if (shipData === GameError.INVALID_CORD) return shipData;

      game.isPlayer1Active = false;
      const gameFinished = isGameFinished(field);

      if (gameFinished) game.state = GameState.FINISHED;

      return { gameFinished: gameFinished, shipData: shipData } as Hit;
    } else if (id === game.player2!.id && !game.isPlayer1Active) {
      const field = game.player1.field!;

      if (isAlreadyHit(cord, field)) return GameError.ALREADY_HIT;

      const shipData = isAShipOnCord(cord, field);
      setCellHit(cord, field);

      if (shipData === GameError.INVALID_CORD) return shipData;

      game.isPlayer1Active = true;
      const gameFinished = isGameFinished(field);

      if (gameFinished) game.state = GameState.FINISHED;

      return { gameFinished: gameFinished, shipData: shipData } as Hit;
    }

    return GameError.WRONG_PLAYER;
  }
}

export const gameRepository = new GameRepository();
