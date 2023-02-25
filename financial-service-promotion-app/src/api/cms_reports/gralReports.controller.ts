import { Get, Controller, HttpStatus, HttpCode, UseGuards, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { Roles } from '../../auth/decorators/roles.decorator';
import {
  EnumApplicationsType,
  EnumReportTypeAssociates,
  EnumReportTypeActivity,
  EnumReportTypeScore,
} from '../../common/constants';
import { GralReportsAssocService } from './gralReportsAssoc/gralReportAssoc.service';
import { GralReportsActivityService } from './gralReportsActivity/gralReportsActivity.service';
import { GralReportsScoreService } from './gralReportsScore/gralReportsScore.service';
import { GralReportsCommissService } from './gralReportsCommissions/gralReportsCommiss.service';
import { QueryByConceptService } from './queryByConcept/queryByConcept.service';
import { ValidateDatePipe } from './pipes/validate-date.pipe';
import { EnumReportTypeCommissions } from '../../common/constants';
import { parseAsync } from 'json2csv';
import { Readable } from 'stream';
import { Response } from 'express';
import { randomUUID } from 'crypto';
import { NotFoundException } from '../../config/exceptions/not.found.exception';
import { UserGuard } from '../../auth/guards/users.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';

@UseGuards(JwtAuthGuard)
@ApiTags('Gral Reports')
@ApiBearerAuth()
@Controller('reportsCms')
export class GralReportsAssocController {
  constructor(
    private readonly assocReportsService: GralReportsAssocService,
    private readonly activityReportsService: GralReportsActivityService,
    private readonly scoreReportsService: GralReportsScoreService,
    private readonly commisionReportsService: GralReportsCommissService,
    private readonly reportsService: QueryByConceptService,
  ) {}

  // ASSOCIATES -----------------------------------------------------------------------------------------------------
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets associate reports`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/associates')
  async getReportsAssoc() {
    return this.assocReportsService.getReportsAssoc();
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Triggers & generates weekly associate reports`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('associates/cron')
  async getReportsWeeklyCron() {
    return this.assocReportsService.getReportsAssocWeeklyCron();
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets associates by concept & by dates: 'from a date, to certain date'`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('associatesConcept')
  getReportByTypeFromDateToDate(
    @Query('type') type: EnumReportTypeAssociates,
    @Query('from', ValidateDatePipe) from: string,
    @Query('to', ValidateDatePipe) to: string,
  ) {
    return this.reportsService.getAssociatesReportByTypeFromDateToDate({ type, from, to });
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets associates by concept & by dates: 'from a date, to certain date' || Gets the result by page and limit numbers || This endpoint can export a csv file`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('associatesConceptExportCsv')
  async getAssociatesReportsByTypeFromDateToDateExportCsv(
    @Query('type') type: EnumReportTypeAssociates,
    @Query('from', ValidateDatePipe) from: string,
    @Query('to', ValidateDatePipe) to: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ) {
    const { data } = await this.reportsService.getAssociatesReportByTypeFromDateToDate({
      type,
      from,
      to,
      exportCsv: true,
      limit: limit,
      page: page,
    });
    if (data.length > 0) {
      const opts = { fields: Object.keys(data[0]) };
      const csv: string = await parseAsync(data, opts);
      const readableStream = Readable.from(csv, { encoding: 'utf8' });
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="report_assocciate_concept_${randomUUID()}.csv"`,
      });
      readableStream.pipe(res);
    } else {
      throw new NotFoundException('404', 'No hay datos para exportar');
    }
  }

  // ACTIVITY -----------------------------------------------------------------------------------------------------------------------
  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets Activity reports`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/activity')
  async getReportsActivity() {
    return this.activityReportsService.getReportsActivity();
  }

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Triggers & generates weekly activity reports`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/activity/cron')
  async getReportsActivityWeeklyCron() {
    return this.activityReportsService.getReportsActivityWeeklyCron();
  }

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets activity by concept & by dates: 'from a date, to certain date'`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('activityConcept')
  getActivityReportByTypeFromDateToDate(
    @Query('type') type: EnumReportTypeActivity,
    @Query('from', ValidateDatePipe) from: string,
    @Query('to', ValidateDatePipe) to: string,
  ) {
    return this.reportsService.getActivityReportByTypeFromDateToDate({ type, from, to });
  }

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets activity by concept & by dates: 'from a date, to certain date' || Gets the result by page and limit numbers || This endpoint can export a csv file`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('activityConceptExportCsv')
  async getActivityReportByTypeFromDateToDateExportCsv(
    @Query('type') type: EnumReportTypeActivity,
    @Query('from', ValidateDatePipe) from: string,
    @Query('to', ValidateDatePipe) to: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ) {
    const { data } = await this.reportsService.getActivityReportByTypeFromDateToDate({
      type,
      from,
      to,
      exportCsv: true,
      limit: limit,
      page: page,
    });
    if (data.length > 0) {
      const opts = { fields: Object.keys(data[0]) };
      const csv: string = await parseAsync(data, opts);
      const readableStream = Readable.from(csv, { encoding: 'utf8' });
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="report_activity_concept_${randomUUID()}.csv"`,
      });
      readableStream.pipe(res);
    } else {
      throw new NotFoundException('404', 'No hay datos para exportar');
    }
  }
  // SCORE -----------------------------------------------------------------------------------------------------------------------

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets Score reports`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/score')
  async getReportsScore() {
    return this.scoreReportsService.getReportsScore();
  }

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Triggers & generates monthly score reports`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/score/cron')
  async getReportsScoreMonthlyCron() {
    return this.scoreReportsService.getReportsScoreMonthlyCron();
  }

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets score by concept & by dates: 'from a date, to certain date'`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('scoreConcept')
  getScoreReportsByTypeFromDateToDate(
    @Query('type') type: EnumReportTypeScore,
    @Query('from', ValidateDatePipe) from: string,
    @Query('to', ValidateDatePipe) to: string,
  ) {
    return this.reportsService.getScoreReportsByTypeFromDateToDate({ type, from, to });
  }

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets score by concept & by dates: 'from a date, to certain date' || Gets the result by page and limit numbers || This endpoint can export a csv file`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('scoreConceptExportCsv')
  async getScoreReportsByTypeFromDateToDateExportCsv(
    @Query('type') type: EnumReportTypeScore,
    @Query('from', ValidateDatePipe) from: string,
    @Query('to', ValidateDatePipe) to: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ) {
    const { data } = await this.reportsService.getScoreReportsByTypeFromDateToDate({
      type,
      from,
      to,
      exportCsv: true,
      limit,
      page,
    });
    if (data.length > 0) {
      const opts = { fields: Object.keys(data[0]) };
      const csv: string = await parseAsync(data, opts);
      const readableStream = Readable.from(csv, { encoding: 'utf8' });
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="report_score_concept_${randomUUID()}.csv"`,
      });
      readableStream.pipe(res);
    } else {
      throw new NotFoundException('404', 'No hay datos para exportar');
    }
  }

  // COMMISSION -----------------------------------------------------------------------------------------------------------------------
  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets Comission reports`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/commiss')
  async getReportsCommiss() {
    return this.commisionReportsService.getReportsCommiss();
  }

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Triggers & generates weekly commission reports`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/commiss/cron')
  async getReportsCommissWeeklyCron() {
    return this.commisionReportsService.getReportsCommissWeeklyCron();
  }

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets commissions by concept & by dates: 'from a date, to certain date'`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('commissionConcept')
  getCommissReportsByTypeFromDateToDate(
    @Query('type') type: EnumReportTypeCommissions,
    @Query('from', ValidateDatePipe) from: string,
    @Query('to', ValidateDatePipe) to: string,
  ) {
    return this.reportsService.getCommissReportsByTypeFromDateToDate({ type, from, to });
  }

  @Roles(
    EnumApplicationsType.SUPERADMIN,
    EnumApplicationsType.PAYER,
    EnumApplicationsType.COORDINATION,
    EnumApplicationsType.INFORMATION,
  )
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets commissions by concept & by dates: 'from a date, to certain date' || Gets the result by page and limit numbers || This endpoint can export a csv file`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('commissionConceptExportCsv')
  async getCommissReportsByTypeFromDateToDateExportCsv(
    @Query('type') type: EnumReportTypeCommissions,
    @Query('from', ValidateDatePipe) from: string,
    @Query('to', ValidateDatePipe) to: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ) {
    const { data } = await this.reportsService.getCommissReportsByTypeFromDateToDate({
      type,
      from,
      to,
      exportCsv: true,
      limit,
      page,
    });
    if (data.length > 0) {
      const opts = { fields: Object.keys(data[0]) };
      const csv: string = await parseAsync(data, opts);
      const readableStream = Readable.from(csv, { encoding: 'utf8' });
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="report_commiss_concept_${randomUUID()}.csv"`,
      });
      readableStream.pipe(res);
    } else {
      throw new NotFoundException('404', 'No hay datos para exportar');
    }
  }
}
