
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../enums/roles.enum'
import { UserRoleGuard } from '../guards/user-role.guard';
import { Roles } from './roles.decorator';

export function Auth (...roles: Role[]){
 return applyDecorators(
   //  SetMetadata('roles', roles),
   Roles( Role.User, Role.Admin ),
    UseGuards(AuthGuard(), UserRoleGuard),
 );
}