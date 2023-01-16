import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport' 
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService
    ){
        super({  
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_SECRET"),
        });
    }
    

   async validate(payload: JwtPayload): Promise<User>{

        const { email } = payload;

        const user = await this.userRepository.findOneBy({
            email
        });

        if(!user && !user.isActive ) throw new UnauthorizedException('Token missing or incorrect');


        return user;
   }

}