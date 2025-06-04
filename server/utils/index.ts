import { Server, type ServerOptions, type Socket } from "socket.io";
import type { H3Event } from "h3";
import { handleLobbyEvents } from "~~/server/utils/handlers/lobbyHandler";

const options: Partial<ServerOptions> = {
  path: "/api/socket.io",
  serveClient: false,
};

export const io = new Server(options);

export function initSocket(event: H3Event) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  io.attach(event.node.res.socket?.server);

  io.of("/lobby").on("connection", (socket: Socket) => {
    handleLobbyEvents(socket, io.of("/lobby"));
  });

  io.of("/place").on("connection", (socket: Socket) => {
    handlePlaceEvents(socket, io.of("/place"));
  });

  io.of("/game").on("connection", (socket: Socket) => {
    handleGameEvents(socket, io.of("/game"));
  });
}
