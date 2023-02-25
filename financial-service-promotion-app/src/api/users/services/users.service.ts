import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { BadRequestException } from 'src/config/exceptions/bad.request.exception';
import { NotFoundException } from 'src/config/exceptions/not.found.exception';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { Roles } from 'src/common/database_entities/roles.entity';
import { EnumApplicationsType } from 'src/common/constants';
import { SendVerificationTokenDto, RecoveryPasswordDto } from '../../partners/dtos/partner.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException } from '../../../config/exceptions/internal.server.error.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Sessions) private sessionRepository: Repository<Sessions>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    private readonly mailerService: MailerService,
  ) {}

  async create(data: CreateUserDto) {
    const user_exist = await this.userRepository.findOne({ where: { email: data.email } });
    const role_found = await this.rolesRepository.findOne({ where: { name: data.role } });
    if (user_exist) {
      throw new BadRequestException(
        'USER_ALREADY_EXIST',
        'Ya existe un usuario con esa dirección de correo electrónico.',
      );
    }
    const newUser = this.userRepository.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.lasts_passwords = [hashPassword];
    newUser.password = hashPassword;
    newUser.validity_password = Date.now() + 5184000000;
    const user_created = await this.userRepository.save(newUser);
    const newSession = this.sessionRepository.create({
      role: role_found,
      user: user_created,
    });
    await this.sessionRepository.save(newSession);
    return { message: 'User created.' };
  }

  findAll() {
    return this.userRepository.find({ relations: ['sessions', 'sessions.role'] });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id, { relations: ['sessions', 'sessions.role'] });
    if (!user) {
      throw new NotFoundException('NOT_FOUND', `El usuario con id ${id} no existe`);
    }
    return user;
  }

  async findOneGuard(id: number, token: string) {
    const user = await this.userRepository.findOne({ where: { id: id }, relations: ['sessions'] });
    if (!user) {
      throw new NotFoundException('NOT_FOUND', `El usuario con id ${id} no existe`);
    }
    if (user.sessions && user.sessions.accessToken === token.slice(7)) {
      return user;
    } else {
      throw new UnauthorizedException(
        'invalidToken',
        'Su sesión ha expirado, deberá digitar su contraseña nuevamente.',
      );
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email }, relations: ['sessions', 'sessions.role'] });
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('NOT_FOUND', 'El usuario no existe.');
    }
    const role = await this.rolesRepository.findOne({ where: { name: changes.role } });
    user.sessions.role = role;

    if (changes.password) {
      changes.password = await bcrypt.hash(changes.password, 10);
      this.userRepository.merge(user, changes);
      await this.sessionRepository.save(user.sessions);
      return this.userRepository.save(user);
    } else {
      this.userRepository.merge(user, changes);
      await this.sessionRepository.save(user.sessions);
      return this.userRepository.save(user);
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('NOT_FOUND', 'El usuario no existe.');
    }
    return this.userRepository.delete(id);
  }

  //Generador de tokens.
  generateVerificationToken() {
    return Math.round(Math.random() * 1000000).toString();
  }

  async sendRecoveryPasswordEmail(user: User) {
    const session_found = await this.sessionRepository.findOne({ where: { id: user.sessions.id } });
    return this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Recuperación de contraseña.',
        text: `Ingresa al siguiente link para recuperar tu contraseña: http://fincomun-d-cms.s3-website-us-west-1.amazonaws.com/recover-password?recoveryToken=${session_found.recoveryToken}&type=cms`,
        html: `<b>Ingresa al siguiente link para recuperar tu contraseña: <a href="http://fincomun-d-cms.s3-website-us-west-1.amazonaws.com/recover-password?recoveryToken=${session_found.recoveryToken}&type=cms">Link</a></b>`,
      })
      .then(_ => user)
      .catch(err => {
        console.error(err);
        return user;
      });
  }

  async sendRecoveryToken(email: string) {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['sessions'] });
    if (!user) {
      throw new BadRequestException('ACCOUNT_ERROR', 'El usuario no se encuentra en la base de datos.');
    }
    const recoveryToken = this.generateVerificationToken();
    await this.sessionRepository.update(user.sessions.id, { recoveryToken: recoveryToken }).then(async () => {
      await this.sendRecoveryPasswordEmail(user);
    });
    return { message: 'Token reset de contraseña enviado.' };
  }

  async recoveryPassword(payload: RecoveryPasswordDto) {
    let session: Sessions;
    try {
      session = await this.sessionRepository.findOne({
        where: { recoveryToken: payload.recoveryToken },
        relations: ['user'],
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!session) {
      throw new BadRequestException('INVALID_CODE', 'Código inválido.');
    } else {
      const hashPassword = await bcrypt.hash(payload.password, 10);
      for (let elem of session.user.lasts_passwords) {
        const is_match = await bcrypt.compare(payload.password, elem);
        if (is_match) {
          throw new BadRequestException(
            'PASSWORD_ALREADY_USED',
            'La contraseña ingresada fue usada con anterioridad. Ingrese una diferente a las 12 anteriores.',
          );
        }
      }
      if (session.user.lasts_passwords.length < 12) {
        session.user.lasts_passwords.push(hashPassword);
      } else {
        session.user.lasts_passwords.shift();
        session.user.lasts_passwords.push(hashPassword);
      }
      session.user.password = hashPassword;
      session.recoveryToken = null;
      await this.userRepository.save(session.user);
      await this.sessionRepository.save(session);
      return { message: 'Partner validate succesfully.' };
    }
  }
}
