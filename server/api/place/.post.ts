import { gameService } from "~~/server/utils/services/gameService";
import type { H3Event } from "h3";
import { createError, readBody, sendError } from "h3";
import { GameError } from "#shared/gameTypes";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);

    const { gameId, id, grid } = body;

    if (!gameId || !id || !grid) {
      return sendError(
        event,
        createError({
          statusCode: 403,
          statusMessage: "Missing required fields: gameId, id, or grid",
        }),
      );
    }

    let parsedGrid;
    try {
      parsedGrid = typeof grid === "string" ? JSON.parse(grid) : grid;
    } catch {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: "Invalid grid format",
        }),
      );
    }

    const game = gameService.postField(gameId, id, parsedGrid);

    if (game === GameError.INVALID_GAME) {
      return sendError(
        event,
        createError({
          statusCode: 405,
          statusMessage: "game not started",
        }),
      );
    }

    return {
      statusCode: 200,
      body: game,
    };
  } catch (err) {
    console.error(err);

    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      }),
    );
  }
});
