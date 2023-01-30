import { Socket, Server } from 'socket.io';
import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsException } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { MessageDto } from './dto/message.dto';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true, namespace:'/' })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server
  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService
    ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;

    if(!token ) throw new UnauthorizedException('Token missing or incorrect');
  
    let payload: JwtPayload;
   try {
    
    payload = this.jwtService.verify(token);
    if(!payload.id) throw new WsException('Token missin or incorrect')
    await this.messageService.registerClient(client, payload.id);

   } catch (error) {
      client.disconnect();
      return;
   }
    
    const clients =  this.messageService.getConnectedClients();
    this.wss.emit('getOnlineClients', { clients })
  }

  handleDisconnect(client: Socket) {
    this.messageService.removeClient(client);
  }

  @SubscribeMessage('message-from-client')
  handlerMessageFromClient(
    client: Socket,
    @MessageBody() message: MessageDto){

    client.broadcast.emit('message-from-server', { 
      fullName: this.messageService.getUserFullName(client.id), 
      message})
    
  }
  
}
