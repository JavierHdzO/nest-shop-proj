import { Controller, Post, Body, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { GetRawHeader } from './decorators/raw-headers.decorator';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/users.entity';
import { Role } from './enums/roles.enum';
import { UserRoleGuard } from './guards/user-role.guard';

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

  @Get('private')
  @UseGuards( AuthGuard() )
  privateRoute(
    @GetUser() user:User,
    @GetUser('email') userEmail: string,
    @GetRawHeader() rawHeaders: string[]
  ){
    return {
      ok: true,
      msg: 'hello',
      user,
      email: userEmail,
      rawHeaders
    }
  }

  @Get('private2')
  // @SetMetadata('roles', ['admin', 'user'])
  @Roles( Role.User, Role.Admin )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRouteTwo(
    @GetUser() user: User
  ){

    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(Role.User, Role.Admin)
  privateRouteThree(
    @GetUser() user:User
  ){

    return {
      ok: true,
      user
    }
  }


  
}
