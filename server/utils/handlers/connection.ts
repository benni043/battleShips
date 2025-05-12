import type {Server, Socket} from "socket.io";
import handleLobbyEvents from "~/server/utils/handlers/lobby";

export default function registerConnectionHandlers(socket: Socket, io: Server) {
    console.log(`User connected: ${socket.id}`);
    socket.join("lobby")

    handleLobbyEvents(socket, io);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
}
