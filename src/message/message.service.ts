import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/users.entity';
import { SocketClient } from './interfaces/socket-client.interface';

@Injectable()
export class MessageService {
  
  private connectedClient: SocketClient = {};
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async registerClient( client: Socket, userId:string ){

    const user = await this.userRepository.findOneBy({ id:userId });
    if( !user || !user.isActive) throw new Error('User not found');

    this.connectedClient[client.id] = {
      socket: client,
      user
    };
  }

  removeClient( client: Socket ){
    delete this.connectedClient[client.id]
  }

  getConnectedClients():string[] {
    return Object.keys(this.connectedClient)
  }

  getUserFullName (userId: string){
    return this.connectedClient[userId].user.fullName;

  }
}
