import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from './../services/auth.service';
import { Strategy } from 'passport-local';
import { CodeUnauthorizedException } from 'src/common/exceptions/code-unauthorized.exception';
import { UnauthorizedException } from 'src/config/exceptions/unauthorized.exception';

@Injectable()
export class PartnerLocalStrategy extends PassportStrategy(Strategy, 'partner_local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const partner = await this.authService.validatePartner(email, password);
    if (!partner) {
      throw new UnauthorizedException('INCORRECT_LOGIN', 'Inicio de sesión incorrecto.');
    }
    if (partner.message == 'Password expired.') {
      throw new UnauthorizedException('PASSWORD_EXPIRED', 'La contraseña ha expirado.');
    }
    if (partner.message == 'Account blocked.' || partner.message == 'Account was blocked.') {
      throw new UnauthorizedException(
        'ACCOUNT_BLOCKED',
        'La cuenta ha sido bloqueada. En 40 minutos se desbloqueará automáticamente.',
      );
    }
    if (partner.verificationToken) {
      throw new UnauthorizedException('UNVERIFIED_ACCOUNT', 'La cuenta no ha sido verificada.');
    }
    return partner;
  }
}
