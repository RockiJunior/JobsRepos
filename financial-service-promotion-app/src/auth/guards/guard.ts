import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from 'src/config/exceptions/unauthorized.exception';
import { AuthService } from '../services/auth.service';

@Injectable()
export class Guard implements CanActivate {
  constructor(readonly authService: AuthService) {}

  canActivate(executionContext: ExecutionContext): boolean {
    const header = executionContext.switchToHttp().getRequest().headers.authorization;
    const valid = this.authService.validateToken(header);
    if (!valid) {
      throw new UnauthorizedException('INVALID_TOKEN', 'Su sesión ha caducado, por favor, ingrese nuevamente');
    }
    return valid;
  }
}
