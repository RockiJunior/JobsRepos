import {
  Body,
  Controller,
  Delete,
  Get,
  Module,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as csv from 'csvtojson';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/api/users/entities/user.entity';
import { EnumApplicationsType } from '../../common/constants';
import { LoadCourseToPartnerDto, LoadPartnersDto, LoadsDto } from '../dtos/loads.dto';
import { LoadedCoursePartner } from '../entities/loadedCoursePartner.entity';
import { LoadedPartner } from '../entities/loadedPartner.entity';
import { LoadsService } from '../services/loads.service';
import { HttpStatus } from '@nestjs/common';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';

@Module({
  controllers: [LoadsController],
})
@UseGuards(JwtAuthGuard)
@ApiTags('loads')
@Controller('loads')
export class LoadsController {
  constructor(private loadsService: LoadsService) {}

  @Post('partners')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Roles(EnumApplicationsType.SUPERADMIN)
  @ApiOperation({
    summary: `Creates & Verifies partners data`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async partners(
    @Query('save') save: boolean = false,
    @UploadedFile() file: LoadPartnersDto,
    @Body() _: LoadPartnersDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as User;
    const rawData = (file['buffer'] as Buffer).toString();

    const data = await csv({
      headers: ['partnerCode', 'leaderCode', 'coordinationCode', 'coordinationName'],
    }).fromString(rawData);

    return this.loadsService.verifyPartnersData(data as LoadedPartner[], user, save);
  }

  @Post('courseToPartner')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Roles(EnumApplicationsType.SUPERADMIN)
  @ApiOperation({
    summary: `Uploads courses`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async courseToPartner(
    @Query('save') save: boolean = false,
    @UploadedFile() file: LoadCourseToPartnerDto,
    @Body() _: LoadCourseToPartnerDto,
    @Req() req: Request,
  ) {
    const rawData = (file['buffer'] as Buffer).toString();
    //Get filename of file
    const fileName = file['originalname'];

    const data = await csv({
      headers: ['CURSO', 'FOLIO', 'SCORE', 'EVALUATION_DATE', 'NOTES'],
    }).fromString(rawData);

    return this.loadsService.uploadCourseToPartnerData(data, fileName);
  }

  @Get('loadCourseToPartner')
  @Roles(EnumApplicationsType.SUPERADMIN)
  @ApiOperation({
    summary: `Gets loaded courses`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async loadCourseToPartner() {
    return this.loadsService.getLoadsCoursesToPartner();
  }

  @Get('loadCourseToPartner/:id')
  @Roles(EnumApplicationsType.SUPERADMIN)
  @ApiOperation({
    summary: `Gets a specific loaded course by Id`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async loadCourseToPartnerById(@Param('id') id: number) {
    return this.loadsService.getLoadedCoursesToPartnerById(id);
  }

  @Delete('loadCourseToPartner/:id')
  @Roles(EnumApplicationsType.SUPERADMIN)
  @ApiOperation({
    summary: `Mark a specific course as deleted`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async updateLoadCourseToPartner(@Param('id') id: number) {
    return this.loadsService.markAsDeletedCoursesToPartner(id);
  }

  @Post('movements')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Roles(EnumApplicationsType.SUPERADMIN)
  @ApiOperation({
    summary: `Uploads movements`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async movements(@UploadedFile() file: LoadsDto) {
    const rawData = (file['buffer'] as Buffer).toString();
    //Get filename of file
    const fileName = file['originalname'];

    const data = await csv({
      headers: ['FOLIO', 'DATE', 'TYPE_MOVEMENT', 'AMOUNT', 'QUANTITY', 'STATUS'],
    }).fromString(rawData);

    return this.loadsService.uploadMovementsData(data, fileName);
  }

  @Get('loadMovements')
  @Roles(EnumApplicationsType.SUPERADMIN)
  @ApiOperation({
    summary: `Gets loaded movements`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async loadMovements() {
    return this.loadsService.getLoadsMovements();
  }

  @Get('loadMovements/:id')
  @Roles(EnumApplicationsType.SUPERADMIN)
  @ApiOperation({
    summary: `Gets a specific loaded movement by Id`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async loadMovementsById(@Param('id') id: number) {
    return this.loadsService.getLoadMovementsById(id);
  }

  @Delete('loadMovements/:id')
  @Roles(EnumApplicationsType.SUPERADMIN)
  @ApiOperation({
    summary: `Mark a specific course as deleted`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async updateLoadMovements(@Param('id') id: number) {
    return this.loadsService.markAsDeletedMovements(id);
  }
}
