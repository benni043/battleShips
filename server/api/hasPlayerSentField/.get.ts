import { createError, sendError } from "h3";

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

  return {
    statusCode: 200,
    sent: true,
  };
});
