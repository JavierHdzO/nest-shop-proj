import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { SocketClient } from './interfaces/socket-client.interface';

@Injectable()
export class MessageService {
  
  private connectedClient: SocketClient = {};

  registerClient( client: Socket ){
    this.connectedClient[client.id] = client;
  }

  removeClient( client: Socket ){
    delete this.connectedClient[client.id]
  }

  getConnectedClients():string[] {
    return Object.keys(this.connectedClient)
  }
}
