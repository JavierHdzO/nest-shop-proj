import { Repository } from 'typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class AuthService {

  private readonly logger = new Logger( AuthService.name );
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create( createUserDto: CreateUserDto ){

    
    try {
      const user = this.userRepository.create( createUserDto );
      await this.userRepository.save(user);
      return  user;
      
    } catch (error) {
      this.handlerException( error );
    }
  }

  handlerException(error: any): never {

    if(error.code === "23505") throw new BadRequestException( error.detail );
    this.logger.error(error);

    throw new InternalServerErrorException();
  }

}
