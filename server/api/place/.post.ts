import { gameService } from "~~/server/utils/services/gameService";
import { lobbyService } from "~~/server/utils/services/lobbyService";
import type { H3Event } from "h3";
import { createError, readBody, sendError } from "h3";
import { LobbyError } from "#shared/lobbyTypes";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);

    const { lobby, id, grid } = body;

    if (!lobby || !id || !grid) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: "Missing required fields: lobby, id, or grid",
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
          statusCode: 400,
          statusMessage: "Invalid grid format",
        }),
      );
    }

    const isValid = lobbyService.checkData(lobby, id);
    switch (isValid) {
      case LobbyError.INVALID_GAME: {
        return sendError(
          event,
          createError({
            statusCode: 402,
            statusMessage: "Invalid game",
          }),
        );
      }
      case LobbyError.INVALID_ID: {
        return sendError(
          event,
          createError({
            statusCode: 401,
            statusMessage: "invalid id",
          }),
        );
      }
    }

    const game = gameService.createGame(lobby, id, parsedGrid);

    return {
      statusCode: 200,
      body: game,
    };
  } catch (err) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      }),
    );
  }
});
