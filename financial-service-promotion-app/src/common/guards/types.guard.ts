import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TypesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const types: string[] = this.reflector.get<string[]>('types', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (!types) {
      return true;
    }

    // Los datos del usuario se asignan cuando
    // se realiza la autenticación a travez del JWT
    const { user } = request;

    // Se puede usar esta forma de roles cuando los usuarios tengan
    // uno o varios roles cambiando el atributo type del user por un
    // arreglo de roles o types
    // const hasType = () => user.types.some((role: string) => types.includes(role));
    const hasType = () => types.includes(user.type);

    return user && user.type && hasType();
  }
}
