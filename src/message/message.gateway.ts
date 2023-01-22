import { Socket, Server } from 'socket.io';
import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({ cors: true, namespace:'/' })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server
  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.messageService.registerClient(client);

    const clients =  this.messageService.getConnectedClients();
    this.wss.emit('getOnlineClients', { clients })
  }

  handleDisconnect(client: Socket) {
    this.messageService.removeClient(client);
  }

  @SubscribeMessage('messageFromclient')
  handlerMessageFromClient(
    client: Socket,
    @MessageBody() message: MessageDto){
    console.log(message);
  }
  
}
