import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../entities/users.entity';
import { Role } from '../enums/roles.enum';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles =  this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
      context.getHandler(),
      context.getClass()
    ]);

    const request  =  context.switchToHttp().getRequest();
    const user: User  = request.user;

    if( !user )
      throw new BadRequestException('User not found');

    if( !requiredRoles ){
      return true;
    }
    return requiredRoles.some( role => user.roles?.includes(role) );
  }
}
