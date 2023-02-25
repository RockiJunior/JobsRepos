import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from './../services/auth.service';
import { Strategy } from 'passport-local';
import { CodeUnauthorizedException } from 'src/common/exceptions/code-unauthorized.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('INCORRECT_LOGIN', 'Inicio de sesión incorrecto.');
    }
    if (user.message == 'Password expired.') {
      throw new CodeUnauthorizedException('PASSWORD_EXPIRED', 'La contraseña ha expirado.');
    }
    if (user.message == 'Account blocked.' || user.message == 'Account was blocked.') {
      throw new CodeUnauthorizedException(
        'ACCOUNT_BLOCKED',
        'La cuenta ha sido bloqueada. En 40 minutos se desbloqueará automáticamente.',
      );
    }
    return user;
  }
}
