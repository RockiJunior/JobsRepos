import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExceptionResponseError } from '../../config/exceptions/dto/exceptions.response.errors';
import { StatementsService } from './statement.service';
import config from 'src/config';

//DTO´s
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StatementsRegisterDTO, UpdateStatementsFilesDto } from './dto/statement.register.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EnumApplicationsType } from '../../common/constants';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserGuard } from '../../auth/guards/users.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PartnerGuard } from '../../auth/guards/partner.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('statements')
@Controller('statements')
export class StatementsController {
  constructor(private readonly statementsService: StatementsService) {}

  //GET
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Gets statements in ascendent order',
  })
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    description: 'Statements catalog elements',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async listStatements() {
    return await this.statementsService.listStatements();
  }

  // GET
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Gets statement by id',
  })
  @Get(':idStatements')
  @ApiResponse({ status: HttpStatus.OK, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async searchStatementsByID(@Param('idStatements') idStatements: string) {
    return await this.statementsService.statementsByID(idStatements);
  }

  // POST
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Upload a statement with is files',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pdfUrl', maxCount: 1 },
        { name: 'videoUrl', maxCount: 1 },
      ],
      { dest: config().files_path },
    ),
  )
  @ApiConsumes('multipart/form-data')
  uploadFile(@UploadedFiles() files: StatementsRegisterDTO, @Body() statementsRegisterDTO: StatementsRegisterDTO) {
    files.pdfUrl ? files.pdfUrl[0] : null;
    files.videoUrl ? files.videoUrl[0] : null;
    return this.statementsService.createStatement(files, statementsRegisterDTO);
  }

  // PATCH
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Updates a statement with is files',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Patch(':statementsId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pdfUrl', maxCount: 1 },
        { name: 'videoUrl', maxCount: 1 },
      ],
      { dest: config().files_path },
    ),
  )
  @ApiConsumes('multipart/form-data')
  async parchRole(
    @Param('statementsId') statementsId: string,
    @UploadedFiles() files: StatementsRegisterDTO,
    @Body() statementsRegisterDTO: StatementsRegisterDTO,
  ) {
    files.pdfUrl ? files.pdfUrl[0] : null;
    files.videoUrl ? files.videoUrl[0] : null;
    const statementsType = await this.statementsService.updateStatements(statementsId, statementsRegisterDTO, files);
    return statementsType;
  }

  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(JwtAuthGuard, PartnerGuard)
  @ApiOperation({
    summary: 'Gets statements filtered',
  })
  @Get('filter/app')
  @ApiResponse({ status: HttpStatus.OK, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async searchStatementsForApps() {
    return await this.statementsService.statementsForApps();
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Delete a specific statement',
  })
  @Delete(':cms_settingsId')
  @ApiResponse({ status: HttpStatus.OK, description: 'It only returns a status OK' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async deleteRole(@Param('cms_settingsId') cms_settingsId: string) {
    await this.statementsService.deleteStatements(cms_settingsId);
  }
}
