import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  
  constructor(
    private readonly authService: AuthService
  ){}

  
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto){

    const user = this.authService.create( createUserDto );
    return user;
  }

  @Post('signin')
  signIn(@Body() loginUserDto: LoginUserDto ){
    return this.authService.login( loginUserDto );
  }

  
}