import type { Cell } from "#shared/gameTypes";
import type { Game, Player } from "~~/server/utils/types/gameTypes";

export function getPlayerById(game: Game, playerId: string): Player {
  return game.player1.id === playerId ? game.player1 : game.player2;
}

export function getOpponent(game: Game, playerId: string): Player {
  return game.player1.id === playerId ? game.player2 : game.player1;
}

export function getOpponentUserName(game: Game, playerId: string): string {
  return getOpponent(game, playerId).username;
}

export function getCurrentPlayer(game: Game): string {
  return game.isPlayer1Active ? game.player1.username : game.player2.username;
}

export function getWinner(game: Game): string {
  return game.isPlayer1Active ? game.player2.username : game.player1.username;
}

export function getMyField(game: Game, playerId: string): Cell[][] | undefined {
  return getPlayerById(game, playerId).field;
}

export function getOpponentField(game: Game, playerId: string): Cell[][] {
  const opponent = getOpponent(game, playerId);
  return opponent.field!.map((row) =>
    row.map((cell) => ({
      ...cell,
      shipData: cell.isHit ? cell.shipData : undefined,
    })),
  );
}

export function getOpponentSocket(game: Game) {
  return game.isPlayer1Active ? game.player1.socket : game.player2.socket;
}

export function getGameState(game: Game) {
  return game.state;
}
