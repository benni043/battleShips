import type {Socket, Server} from 'socket.io';

export default function handleLobbyEvents(socket: Socket, io: Server) {
    socket.on('create-lobby', (cb) => {
        const lobbyId = "lobby1";

        socket.join(lobbyId);

        cb(lobbyId);
        // socket.emit('lobby-created', { lobbyId });
    });

    socket.on('join-lobby', (lobbyId) => {
        socket.join(lobbyId);
        io.to(lobbyId).emit('player-joined', {playerId: socket.id});
    });
}
