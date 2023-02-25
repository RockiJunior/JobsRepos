import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new BadRequestException();
    }
    const hasRole = roles.includes(user.role);
    if (hasRole) {
      return true;
    } else {
      throw new ForbiddenException(
        'El rol ' + user.role + ' no tiene acceso a esta ruta.',
        'forbidenResource',
      );
    }
  }
}
