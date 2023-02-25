import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/api/Users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { Role } from 'src/api/Users/entities/role.entity';
import { EnvironmentVariablesService } from 'src/config/environment/environment.variables.service';
import { UserToken } from 'src/api/Users/entities/user-token.entity';
import { v4 as uuid } from 'uuid';
import { errorsCatalog } from 'src/common/errors-catalog';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private environmentVariablesService: EnvironmentVariablesService,
  ) {}

  //Login usuario
  async userLogin(userLoginDto: UserLoginDto): Promise<UserLoginResponseDto> {
    try {
      //Buscamos y validamos el usuario
      const { email, password } = userLoginDto;
      const find_user = await this.userRepository.findOne({
        where: { Email: email },
        relations: ['Role'],
      });
      this.validateUser(find_user, password);

      //Generamos y guardamos token
      const payload = {
        id: find_user.Id,
        name: find_user.Name,
        role: find_user.Role[0].Name,
      };
      const access_token = this.jwtService.sign(payload);
      await this.saveOrUpdateToken(access_token, find_user.Id);

      //Respuesta
      const response = new UserLoginResponseDto(
        find_user.Id,
        find_user.Name,
        access_token,
      );
      return response;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(
        errorsCatalog.incorrectLogin,
        'UNAUTHORIZED',
      );
    }
  }

  async validateUser(find_user: User, password: string) {
    //Valida que exista
    if (!find_user) {
      throw new NotFoundException(errorsCatalog.userNotFound, 'USER_NOT_FOUND');
    }

    //Valida que esté activo
    if (!find_user.Active) {
      throw new UnauthorizedException(
        errorsCatalog.userInactive,
        'USER_INACTIVE',
      );
    }

    //Valida que no sea distribuidor
    const isDistribuidor = find_user.Role.filter(
      (el) => el.Name === 'Distribuidor',
    );
    if (isDistribuidor.length) {
      throw new UnauthorizedException(
        errorsCatalog.roleUnauthorized,
        'UNAUTHORIZED_ROLE',
      );
    }

    //Valida que la password ingresada sea correcta
    const check_password = await compare(password, find_user.PasswordHash);
    if (!check_password) {
      throw new ForbiddenException(
        errorsCatalog.wrongPassword,
        'WRONG_PASSWORD',
      );
    }

    //Valida que no haya expirado la password
    const current_date = new Date();
    const expiration_date = new Date(
      current_date.setDate(
        current_date.getDate() +
          parseInt(this.environmentVariablesService.getExpirationPassword()),
      ),
    );
    if (find_user.LastPasswordChangedDate >= expiration_date) {
      throw new UnauthorizedException(
        errorsCatalog.expiredPassword,
        'PASSWORD_EXPIRED',
      );
    }
  }

  //Desde front, luego de 30 minutos de inactividad, nos expiran el token
  async expireToken(userId: string) {
    try {
      const user_found = await this.userRepository.findOne({
        where: { Id: userId },
      });

      const user_token_found = await this.userTokenRepository.findOne({
        where: {
          UserId: user_found.Id,
        },
      });

      await this.userTokenRepository.update(user_token_found, {
        Token: null,
      });

      return {
        message: 'EL token ha sido inhabilitado.',
      };
    } catch (err) {
      console.log(err);
      throw new NotFoundException(errorsCatalog.userNotFound, 'USER_NOT_FOUND');
    }
  }

  //Para la guardia de token, validamos que exista y que sea ese, sino está, es porque desde front lo inhabilitaron
  async validateToken(id: string, token: string): Promise<boolean> {
    if (!token || !id) throw new UnauthorizedException();
    const token_exist = await this.userTokenRepository.findOne({
      where: { UserId: id, Token: token },
    });
    if (!token_exist) throw new UnauthorizedException();

    return true;
  }

  //Guarda o actualiza el token
  async saveOrUpdateToken(token: string, user_id: string) {
    const user_token_exist = await this.userTokenRepository.findOne({
      where: {
        UserId: user_id,
      },
    });

    if (user_token_exist) {
      return this.userTokenRepository.update(user_token_exist, {
        Token: token,
      });
    }

    const user_token = this.userTokenRepository.create({
      Id: uuid(),
      Token: token,
      UserId: user_id,
    });
    return this.userTokenRepository.save(user_token);
  }
}
