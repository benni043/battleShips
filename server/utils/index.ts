import {Server, type ServerOptions, type Socket} from 'socket.io'
import type {H3Event} from 'h3'
import registerConnectionHandlers from "~/server/utils/handlers/connection";

const options: Partial<ServerOptions> = {
    path: '/api/socket.io',
    serveClient: false
}

export const io = new Server(options);

export function initSocket(event: H3Event) {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    io.attach(event.node.res.socket?.server);

    io.on('connection', (socket: Socket) => {
        registerConnectionHandlers(socket, io);
    })

}