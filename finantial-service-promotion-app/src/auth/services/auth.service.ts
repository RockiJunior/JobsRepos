import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../config/exceptions/unauthorized.exception';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../api/users/services/users.service';
import { User } from '../../api/users/entities/user.entity';
import { PayloadRefreshToken, PayloadToken } from './../models/token.model';
import { PartnersService } from 'src/api/partners/partners.service';
import { Partner } from 'src/common/database_entities/partner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from 'src/config/exceptions/internal.server.error.exception';
import { EnumApplicationsType } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Sessions) private sessionsRepository: Repository<Sessions>,
    @InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>,
    private usersService: UsersService,
    private partnerService: PartnersService,
    private jwtService: JwtService,
  ) {}

  validateToken(header: string): boolean {
    if (header) {
      const token = header.replace('Bearer ', '');
      const verify = this.jwtService.verify(token);
      if (!verify) {
        return false;
      } else {
        return verify;
      }
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const current_date = Date.now();
      const user = await this.usersService.findByEmail(email);
      const session = await this.sessionsRepository.findOne({ where: { id: user.sessions.id } });
      if (session.blocked > current_date) {
        return { message: 'Account was blocked.' };
      }
      if (session.attemps >= 5) {
        const time_blocked = Date.now() + 2400000;
        await this.sessionsRepository.update(session.id, {
          attemps: null,
          blocked: time_blocked,
        });
        return { message: 'Account blocked.' };
      }
      if (user) {
        if (user.validity_password < current_date) {
          return { message: 'Password expired.' };
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          await this.sessionsRepository.update(session.id, {
            blocked: null,
            attemps: null,
          });
          return {
            id: user.id,
            sessionId: user.sessions.id,
            name: user.name,
            email: user.email,
            verificationToken: user.sessions.verificationToken,
            role: user.sessions.role.name,
          };
        } else {
          await this.sessionsRepository.update(user.sessions.id, {
            attemps: session.attemps + 1,
            blocked: null,
          });
        }
      }
    } catch {
      return null;
    }
  }

  async validatePartner(email: string, password: string) {
    try {
      const current_date = Date.now();
      const user = await this.partnerService.findByEmail(email);
      const session = await this.sessionsRepository.findOne({ where: { id: user.sessions.id } });
      if (session.blocked > current_date) {
        return { message: 'Account was blocked.' };
      }
      if (session.attemps >= 5) {
        const time_blocked = Date.now() + 2400000;
        await this.sessionsRepository.update(session.id, {
          attemps: null,
          blocked: time_blocked,
        });
        return { message: 'Account blocked.' };
      }
      if (user) {
        if (user.validityPassword < current_date) {
          return { message: 'Password expired.' };
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          await this.sessionsRepository.update(session.id, {
            blocked: null,
            attemps: null,
          });
          return {
            id: user.id,
            sessionId: user.sessions.id,
            name: user.name,
            email: user.email,
            verificationToken: user.sessions.verificationToken,
            role: user.sessions.role.name,
          };
        } else {
          await this.sessionsRepository.update(user.sessions.id, {
            attemps: session.attemps + 1,
            blocked: null,
          });
        }
      }
    } catch {
      return null;
    }
  }

  async generateJWT(user) {
    const { id, name, email, role } = user;
    const date = new Date();
    const payload: PayloadToken = { id, role, email, date };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    await this.sessionsRepository.update(user.sessionId, {
      accessToken: accessToken,
    });
    return {
      accessToken: accessToken,
      user: {
        name: name,
        email: email,
        role: role,
      },
    };
  }

  async generateJWTWithOutExp(user) {
    const { id, name, email, role } = user;
    const date = new Date();
    const payload: PayloadToken = { id, role, email, date };

    const accessToken = this.jwtService.sign(payload);

    if (payload.role === EnumApplicationsType.SUPERADMIN) {
      await this.sessionsRepository.update(user.sessionId, {
        accessToken: accessToken,
      });
      return {
        accessToken: accessToken,
        user: {
          name: name,
          email: email,
          role: role,
        },
      };
    } else {
      throw new UnauthorizedException('INCORRECT_LOGIN', 'No tiene permisos para acceder');
    }
  }

  async generatePartnerJWT(partner) {
    const partn = await this.partnerRepository.findOne(partner.id);
    if (partn.status === 8) {
      throw new UnauthorizedException(
        'INCORRECT_LOGIN',
        'Su cuenta ha sido desactivada, por favor ingrese al link enviado a su email para recuperar su cuenta',
      );
    } else if (partn.status === 9) {
      throw new UnauthorizedException('INCORRECT_LOGIN', 'Su cuenta ha sido eliminada de nuestra base de datos');
    } else {
      const { id, sessionId, name, email, role } = partner;

      const date = new Date();

      const payloadAccess: PayloadToken = { id, role, email, date };
      const payloadRefresh: PayloadRefreshToken = { id, role, email, sessionId, date };

      const accessToken = this.jwtService.sign(payloadAccess, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payloadRefresh, { expiresIn: '1h' });

      await this.partnerService.createTokens(sessionId, accessToken, refreshToken);
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: { name: name, email: email, role: role },
      };
    }
  }

  generateNewAccessToken(partner) {
    const id = partner.id;
    const date = new Date();
    const role = partner.sessions.role.name;
    const email = partner.email;
    const payloadAccess: PayloadToken = { id, role, email, date };
    const newAccessToken = this.jwtService.sign(payloadAccess);
    return newAccessToken;
  }

  async partersLogout(partner: Partner) {
    try {
      const session_found = await this.sessionsRepository.findOne({ where: { partner: partner } });
      await this.sessionsRepository.update(session_found.id, {
        accessToken: null,
        recoveryToken: null,
      });
    } catch {
      throw new InternalServerErrorException('INTERNAL_ERR', 'Error interno del servidor, intente nuevamente.');
    }
    return { message: 'Su sesión se ha cerrado.' };
  }

  async logout(user: User) {
    try {
      const session_found = await this.sessionsRepository.findOne({ where: { user: user } });
      await this.sessionsRepository.update(session_found.id, {
        accessToken: null,
        recoveryToken: null,
      });
    } catch {
      throw new InternalServerErrorException('INTERNAL_ERR', 'Error interno del servidor, intente nuevamente.');
    }
    return { message: 'Su sesión se ha cerrado.' };
  }

  generateVerificationToken() {
    return Math.round(Math.random() * 1000000).toString();
  }
}
