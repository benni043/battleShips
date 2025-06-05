import { createError, sendError } from "h3";
import { gameService } from "~~/server/utils/services/gameService";
import { GameError } from "#shared/gameTypes";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const gameId = query.gameId as string;
  const playerId = query.playerId as string;

  if (!gameId || !playerId) {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "Missing required fields: gameId, playerId",
      }),
    );
  }

  const inGame = gameService.isAlreadyInGame(gameId, playerId);

  if (inGame === GameError.INVALID_GAME) {
    return sendError(
      event,
      createError({
        statusCode: 405,
        statusMessage: "game not started",
      }),
    );
  }

  if (inGame === GameError.ALREADY_JOINED) {
    return sendError(
      event,
      createError({
        statusCode: 405,
        statusMessage: "already joined",
      }),
    );
  }

  return {
    inGame: true,
  };
});
