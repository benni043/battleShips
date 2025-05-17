import type {Server, Socket} from "socket.io";
import handleLobbyEvents from "~/server/utils/handlers/lobby.presentation";

export default function registerConnectionHandlers(socket: Socket, io: Server) {
    console.log(`User connected: ${socket.id}`);

    handleLobbyEvents(socket, io);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
}
