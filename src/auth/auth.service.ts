import { Repository } from 'typeorm';
import * as bcript from 'bcrypt';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt'
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

  private readonly logger = new Logger( AuthService.name );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async create( createUserDto: CreateUserDto ){

    
    try {
      const user = this.userRepository.create( createUserDto );
      await this.userRepository.save(user);
      return {
        ...user,
        access_token: this.generateJwt( { id: user.id } )
      };

    } catch (error) {
      this.handlerException( error );
    }
  }


  async login( loginUserDto: LoginUserDto ){

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true}
    });

    const correctPassword = user === null?
      false:
      bcript.compareSync(password, user.password);
    
    if( !correctPassword )
      throw new UnauthorizedException('email or password incorrect');

      return {
        ...user,
        access_token: this.generateJwt( { id: user.id } )
      };
  }

  private generateJwt( payload: JwtPayload ){

    const acces_token = this.jwtService.sign( payload );
    return acces_token;

  }

  handlerException(error: any): never {

    if(error.code === "23505") throw new BadRequestException( error.detail );
    this.logger.error(error);

    throw new InternalServerErrorException();
  }

}
