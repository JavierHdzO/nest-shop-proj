import { Socket } from 'socket.io'

export interface SocketClient {
    [id: string]: Socket
}