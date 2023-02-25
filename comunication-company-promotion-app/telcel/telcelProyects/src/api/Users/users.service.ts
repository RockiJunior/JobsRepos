import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/register-user.dto';
import { hash, compare } from 'bcrypt';
import { Role } from './entities/role.entity';
import { ChangePasswordDto } from './dto/change-password-user.dto';
import { v4 as uuid } from 'uuid';
import { ADMINISTRADOR, PASSWORD_VALIDATOR } from 'src/common/constants';
import { OldUserPassword } from '../OldUserPassword/entities/old-user-password.entity';
import { errorsCatalog } from 'src/common/errors-catalog';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(OldUserPassword)
    private oldUserPassRepository: Repository<OldUserPassword>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  async userRegister(
    userRegister: UserRegisterDto,
    // photo: Express.Multer.File,
  ): Promise<User> {
    const {
      name,
      email,
      firstLastName,
      secondLastName,
      password,
      phoneNumber,
      role,
    } = userRegister;
    //Buscamos si no existe un usuario ya con ese email
    const findRepeatedUser = await this.userRepository.findOne({
      where: {
        Email: email,
      },
    });
    if (findRepeatedUser) {
      throw new BadRequestException(
        errorsCatalog.duplicateEntry,
        'DUPLICATE_ENTRY',
      );
    }

    //Buscamos si el rol ingresado existe
    const role_found = await this.roleRepository.findOne({
      where: { Name: role },
    });
    if (!role_found) {
      throw new NotFoundException(errorsCatalog.roleNotFound, 'INVALID_ROLE');
    }

    //Si NO es admin, validamos su password
    if (role !== ADMINISTRADOR) {
      await this.passwordValidator(password);
    }

    //Creación de pass hasheada y guardar usuario
    const hash_password = await hash(password, 10);

    const user_created = this.userRepository.create({
      Id: uuid(),
      Name: name,
      Email: email,
      FirstLastName: firstLastName,
      SecondLastName: secondLastName,
      PasswordHash: hash_password,
      PhoneNumber: phoneNumber ? phoneNumber : '',
      EmailConfirmed: false,
      PhoneNumberConfirmed: false,
      TwoFactorEnabled: false,
      LockoutEnabled: false,
      AccessFailedCount: 0,
      // Photo: photo.path,
      Role: [role_found],
    });
    await this.userRepository.save(user_created);

    //Creación de lastpassword
    const last_password = await this.oldUserPassRepository.create({
      Id: uuid(),
      PasswordHash: hash_password,
      UserId: user_created.Id,
    });
    await this.oldUserPassRepository.save(last_password);

    return user_created;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string) {
    const userFinded = await this.userRepository.findOne({
      where: {
        Id: id,
      },
    });
    return userFinded;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    /* photo: Express.Multer.File, */
  ) {
    const {
      name,
      email,
      firstLastName,
      secondLastName,
      userName,
      phoneNumber,
      role,
    } = updateUserDto;

    // Obtiene el usuario a actualizar
    const userToUpdate = await this.userRepository.findOne({
      where: { Id: id },
    });

    // Obtiene el nuevo rol a asingar
    const role_found = await this.roleRepository.findOne({
      where: { Name: role },
    });

    // Se asignan campos a actualizar
    userToUpdate.Name = name;
    userToUpdate.Email = email;
    userToUpdate.FirstLastName = firstLastName;
    userToUpdate.SecondLastName = secondLastName;
    userToUpdate.UserName = userName;
    userToUpdate.PhoneNumber = phoneNumber;
    /* userToUpdate.Photo = photo.path; */
    // Se modifica la relación Usario - Rol
    userToUpdate.Role = [role_found];

    await this.userRepository.save(userToUpdate);
    return { message: 'User Updated' };
  }

  async remove(id: string) {
    await this.userRepository.update(id, {
      Active: false,
      DateCancel: new Date(),
    });
  }

  //Actualizar passwords
  async updateUserPassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    const { password } = changePasswordDto;
    //Validar si existe el usuario
    const user_found = await this.userRepository.findOne({
      where: {
        Id: id,
      },
      relations: ['Role'],
    });
    if (!user_found) {
      throw new NotFoundException(errorsCatalog.userNotFound, 'USER_NOT_FOUND');
    }

    //Validar si la contraseña no fue cambiada en un lapso de una semana previa
    const current_date = new Date();
    const week_password = new Date(
      user_found.LastPasswordChangedDate.setDate(
        user_found.LastPasswordChangedDate.getDate() + 7,
      ),
    );
    if (current_date <= week_password) {
      throw new UnauthorizedException(
        errorsCatalog.passwordRecenltyUser,
        'PASSWORD_RECENTLY',
      );
    }

    //Hashear la pass y en caso de que no sea admin, aplicar las reglas
    const hash_password = await hash(password, 10);
    const role_exist = user_found.Role.filter(
      (el) => el.Name === ADMINISTRADOR,
    );
    if (!role_exist.length) {
      await this.passwordValidator(password, id);
      await this.oldPasswordsUpdate(hash_password, id);
    }

    await this.userRepository.update(id, {
      PasswordHash: hash_password,
    });
  }

  //Validar password con reglas de negocio
  async passwordValidator(password: string, userId?: string) {
    //Valida que la password cumpla con los requisitos
    const is_valid_password = PASSWORD_VALIDATOR.test(password);
    if (!is_valid_password) {
      throw new BadRequestException(
        errorsCatalog.invalidPassword,
        'INVALID_PASSWORD',
      );
    }

    //Validar que la password no sea alguna de las 4 anteriores.
    if (userId) {
      const last_passwords = await this.oldUserPassRepository.find({
        where: {
          UserId: userId,
        },
      });

      const already_used = [];
      for (let pass of last_passwords) {
        const aux = await compare(password, pass.PasswordHash);
        if (aux) {
          already_used.push(aux);
        }
      }

      if (already_used.length) {
        throw new BadRequestException(
          errorsCatalog.passwordAlreaydUsed,
          'INVALID_PASSWORD',
        );
      }
    }
  }

  async oldPasswordsUpdate(hash_password: string, userId: string) {
    const last_passwords = await this.oldUserPassRepository.find({
      where: {
        UserId: userId,
      },
      order: {
        CreateDate: 'DESC',
      },
    });

    if (last_passwords.length === 4) {
      await this.oldUserPassRepository.delete(last_passwords[3].Id);
    }

    const new_password = this.oldUserPassRepository.create({
      Id: uuid(),
      UserId: userId,
      PasswordHash: hash_password,
    });

    await this.oldUserPassRepository.save(new_password);
  }
}
