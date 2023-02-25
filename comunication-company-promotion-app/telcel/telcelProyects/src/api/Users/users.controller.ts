import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterDto } from './dto/register-user.dto';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { EnvironmentVariablesService } from 'src/config/environment/environment.variables.service';
import path, { extname } from 'path';
import { diskStorage } from 'multer';
import { errorsCatalog } from '../../common/errors-catalog';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMINISTRADOR } from '../../common/constants';
import { RolesGuard } from '../../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User register endpoint',
    type: String,
  })
  // @UseInterceptors(
  //   FileInterceptor('photo', {
  //     storage: diskStorage({
  //       destination: new EnvironmentVariablesService().getFileStorage(),
  //       filename: (req, file, cb) => {
  //         const unique_sufix = `${Date.now()}_pic`;
  //         const ext = extname(file.originalname);
  //         const filename = `${file.originalname}_${unique_sufix}${ext}`;
  //         cb(null, filename);
  //       },
  //     }),
  //   }),
  // )
  // @ApiConsumes('multipart/form-data')
  async create(
    @Body() userRegisterDto: UserRegisterDto,
    // @UploadedFile() photo: Express.Multer.File,
  ) {
    try {
      await this.usersService.userRegister(userRegisterDto/* , photo */);
      return { message: 'Usuario Creado' };
    } catch (err) {
      return {
        message: errorsCatalog.cantCreate,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    description: 'Find all Users',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    try {
      return this.usersService.findAll();
    } catch (err) {
      return {
        message: errorsCatalog.cantFindAll,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    description: 'Find a specific User',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      const user = this.usersService.findOne(id);
      return user;
    } catch (err) {
      return {
        message: errorsCatalog.cantFindById,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    description: 'Update User Properties',
  })
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(
  //   FileInterceptor('photo', {
  //     storage: diskStorage({
  //       destination: new EnvironmentVariablesService().getFileStorage(),
  //       filename: (req, file, cb) => {
  //         const unique_sufix = `${Date.now()}_pic`;
  //         const ext = extname(file.originalname);
  //         const filename = `${file.originalname}_${unique_sufix}${ext}`;
  //         cb(null, filename);
  //       },
  //     }),
  //   }),
  // )
  // @ApiConsumes('multipart/form-data')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    // @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.usersService.update(id, updateUserDto/* , photo */);
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    description: 'Remove User',
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.usersService.remove(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantRemove,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    description: 'Update Password User',
  })
  @HttpCode(HttpStatus.OK)
  @Patch('change-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      await this.usersService.updateUserPassword(id, changePasswordDto);
      return {
        message: 'Password updated successfully',
      };
    } catch (err) {
      return {
        message: errorsCatalog.cantPatch,
        err,
      };
    }
  }
}
