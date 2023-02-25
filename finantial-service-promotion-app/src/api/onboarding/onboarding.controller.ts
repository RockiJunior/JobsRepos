import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  HttpStatus,
  HttpCode,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiConsumes, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import {
  CreatePartnerDto,
  UpdatePartnerDto,
  VerificationTokenDto,
  UpdatePartnerFilesDto,
  SendVerificationTokenDto,
  RecoveryPasswordDto,
  SendRecoveryPasswordTokenDto,
} from '../partners/dtos/partner.dto';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PartnerGuard } from '../../auth/guards/partner.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { AuthService } from '../../auth/services/auth.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EnumApplicationsType } from '../../common/constants';
import { Partner } from '../../common/database_entities/partner.entity';
import { OnboardingPipe } from '../../common/pipes/onboarding.pipe';
import { UpdateFileStatusDTO } from './dtos/onboarding.dto';
import config from 'src/config';
import { UserGuard } from 'src/auth/guards/users.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DeleteAccountDto } from './dtos/deleteAccount.dto';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';

@UseGuards(JwtAuthGuard)
@Controller('onboarding')
@ApiTags('onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService, private authService: AuthService) {}

  //Ruta para crear el partner.
  @Public()
  @ApiOperation({
    summary: 'Creates a new Partner',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Post()
  async create(@Body() createPartner: CreatePartnerDto) {
    await this.onboardingService.createPartner(createPartner);
    return { message: 'Partner created successfully.' };
  }

  //Ruta para validar el partner con el verificationToken.
  @Public()
  @ApiOperation({
    summary: 'Validation by token verification of partner',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Post('verify')
  async verify(@Body() payload: VerificationTokenDto) {
    if (!payload.verificationToken) {
      throw new BadRequestException('Token param is required.');
    }
    await this.onboardingService.verifyPartner(payload);
    return {
      message: 'Cuenta verificada correctamente.',
    };
  }

  //Ruta para pedir el verificationToken si lo perdiste.
  @Public()
  @ApiOperation({
    summary: `Send a verification token to the partner's email`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Post('send-verification-token')
  async sendVerificationToken(@Body() payload: SendVerificationTokenDto) {
    if (!payload.email) {
      throw new BadRequestException('Correo electrónico requerido.');
    }
    return this.onboardingService.sendVerificationToken(payload.email);
  }

  //Ruta para reestablecer contraseña.
  @Public()
  @ApiOperation({
    summary: `Send a verification token to the partner's email to recover the password`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Post('send-recovery-token')
  async sendRecoveryToken(@Body() payload: SendRecoveryPasswordTokenDto) {
    if (!payload.email) {
      throw new BadRequestException('Correo electrónico requerido.');
    }
    return this.onboardingService.sendRecoveryPasswordToken(payload.email);
  }

  //Ruta de carga de datos.
  @Roles(EnumApplicationsType.PARTNER)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Upload & updates data of a partner`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Put('data')
  async data(@Body(OnboardingPipe) data: UpdatePartnerDto, @Req() req: Request) {
    const partner = req['partner'];
    return this.onboardingService.updatePersonalInfo(partner.id, data, partner);
  }

  //Ruta para obtener el perfil logeado.
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Gets the partner profile`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('profile')
  async profile(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.onboardingService.meProfileOnboarding(partner);
  }

  //Ruta para carga de archivos.
  @Roles(EnumApplicationsType.PARTNER)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Upload & updates data with files of a partner`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Put('files')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ineFront', maxCount: 1 },
        { name: 'ineBack', maxCount: 1 },
        { name: 'rfc', maxCount: 1 },
        { name: 'curp', maxCount: 1 },
        { name: 'proofOfAddress', maxCount: 1 },
        { name: 'billingStatement', maxCount: 1 },
        { name: 'signature', maxCount: 1 },
        { name: 'profilePhoto', maxCount: 1 },
      ],
      { dest: config().files_path },
    ),
  )
  @ApiConsumes('multipart/form-data')
  uploadFile(
    @UploadedFiles() files: UpdatePartnerFilesDto,
    @Body() _body_data: UpdatePartnerFilesDto,
    @Req() req: Request,
  ) {
    const partner = req['partner'] as Partner;
    return this.onboardingService.updateFiles(partner.id, files, _body_data);
  }

  //Ruta pública para enviar el token de recuperación. Y las nuevas contraseñas.
  @Public()
  @ApiOperation({
    summary: `Recovery password with token`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Post('recovery-password')
  async recoveryPassword(@Body() payload: RecoveryPasswordDto) {
    if (!payload.recoveryToken) {
      throw new BadRequestException("Token param can't be empty");
    } else {
      await this.onboardingService.recoveryPassword(payload);
      return {
        message: 'Contraseña reestablecida correctamente.',
      };
    }
  }

  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Gets contract by type`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('contracts/:type')
  async contract(@Param('type') type: string, @Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.onboardingService.serveHTMLView(partner, type);
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Updates a status File`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Patch(':idUser/files')
  async updateStatusFile(@Param('idUser') idUser: string, @Body() updateFileStatusDTO: UpdateFileStatusDTO) {
    await this.onboardingService.updateStatusFile(idUser, updateFileStatusDTO);
    return { message: 'Change realized.' };
  }

  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Updates partial Data of a partner`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Patch('update-data/:idPartner')
  async updatePartialData(@Body() data: UpdatePartnerDto, @Param('idPartner', ParseIntPipe) idPartner: number) {
    return this.onboardingService.updatePartialData(idPartner, data);
  }

  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Deletes a partner account`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Patch('deleteAccount')
  async deleteAccount(@Body() data: DeleteAccountDto, @Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.onboardingService.deleteAccount(data, partner);
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Triggers a cron that removes a partner after 15 days of having disabled his account`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('deleteAccountCron')
  async deletAccountCron() {
    return this.onboardingService.deleteAccountCron();
  }
}
