import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AsociadoStatus, EnumApplicationsType } from '../../common/constants';
import {
  UpdateBankAccountDTO,
  UpdateBankAccountFileDTO,
  UpdateCoursesStatusDto,
  UpdatePartnerFileStatusDto,
} from './dtos/partner.dto';
import { PartnersService } from './partners.service';
import * as _ from 'lodash';
import { Partner } from 'src/common/database_entities/partner.entity';
import { PartnerGuard } from 'src/auth/guards/partner.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import config from 'src/config';
import { RejectPartnerDto } from './dtos/partner.dto';
import { UserGuard } from 'src/auth/guards/users.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundException } from '../../config/exceptions/not.found.exception';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';

@UseGuards(JwtAuthGuard)
@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private partnerService: PartnersService) {}

  //Ruta accesible para administradores, accede a todos los partners o los partners por status.
  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Find all Partners',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get()
  findAll(@Query('status') status: AsociadoStatus) {
    return this.partnerService.findAll({ status: status });
  }

  //Ruta accesible para partners, sirve para traer el perfil propio.
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: 'Gets own partner profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return await this.partnerService.getPartner(partner);
  }

  //Ruta accesible para partners, sirve para traer los cursos a los que se encuentra inscripto.
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: 'Gets inscripted courses of partners',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('courses')
  async getCourses(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return await this.partnerService.getCourses(partner);
  }

  //Ruta accesible para administradores, sirve para rechazar a un partner.
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Rejects a Partner',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('disableUnfinishedPartner')
  async disableUnfinishedPartner() {
    return this.partnerService.disableUnfinishedPartnerCron();
  }

  //Ruta accesible para administradores, sirve para traer un partner específico.
  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Gets a specific partner',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      const user = req.user;
      return await this.partnerService.findOne(id, user);
    } catch (err) {
      throw new NotFoundException('401', 'Partner not found');
    }
  }

  //Ruta accesible para administradores
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Updates a partner file by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Put(':id/files/:fileId')
  async updateFileStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('fileId', ParseIntPipe) fileId: number,
    @Body() payload: UpdatePartnerFileStatusDto,
  ) {
    const partner = await this.partnerService.findOne(id);
    return this.partnerService.updateFilStatus(partner, fileId, payload);
  }

  //Ruta accesible para administradores, sirve para actualizar un curso de un partner.
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Updates a course by course id & partner id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Patch('courses/:idCourse/:idPartner')
  async updateCourses(
    @Param('idCourse', ParseIntPipe) idCourse: number,
    @Param('idPartner', ParseIntPipe) idPartner: number,
    @Body() payload: UpdateCoursesStatusDto,
  ) {
    // le falta un try catch
    return this.partnerService.updateCourseStatus(idCourse, idPartner, payload);
  }

  //Ruta accesible para administradores, sirve para activar a un partner.
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Activate a specific partner',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Patch(':id/activation')
  async activationPartner(@Param('id', ParseIntPipe) id: number) {
    return this.partnerService.activatePartner(id);
  }

  //Ruta accesible para administradores, sirve para rechazar a un partner.
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Rejects a specific partner',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Patch(':id/rejection')
  async rejectPartner(@Param('id', ParseIntPipe) id: number, @Body() payload: RejectPartnerDto) {
    return this.partnerService.rejectPartner(id, payload);
  }

  //Ruta accesible para partners, sirve para modificar una cuenta bancaria.
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: 'Updates a bank account of a specific partner',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Patch('account')
  async updateBankAccount(@Body() bankAccount: UpdateBankAccountDTO, @Req() req: Request) {
    const partner = req['partner'] as Partner;
    return await this.partnerService.updateBankAccount(partner, bankAccount);
  }

  //Ruta accesible para partners, sirve para modificar el archivo de la cuenta bancaria.
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: 'Upload file of a bank account of a specific partner',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Put('account/file')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'bankAccount', maxCount: 1 }], { dest: config().files_path }))
  @ApiConsumes('multipart/form-data')
  uploadFile(@UploadedFiles() files: UpdateBankAccountFileDTO, @Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.partnerService.updateBankAccountFile(partner, files);
  }
}
