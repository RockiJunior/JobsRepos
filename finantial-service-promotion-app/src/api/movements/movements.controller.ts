import { Controller, Get, HttpCode, HttpStatus, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PartnerGuard } from '../../auth/guards/partner.guard';
import { EnumApplicationsType, EnumMovementTypes, EnumRankType } from 'src/common/constants';
import { Partner } from 'src/common/database_entities/partner.entity';
import { MovementsService } from './movements.service';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserGuard } from '../../auth/guards/users.guard';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';

@UseGuards(JwtAuthGuard)
@ApiTags('movements')
@Controller('movements')
export class MovementsController {
  constructor(private movementsService: MovementsService) {}

  @Roles(EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Gets all movements by type`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get()
  async getMovements(@Query('type') type: EnumMovementTypes, @Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.movementsService.findAll({ type, partner });
  }
  // Individual Ranking
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Cron that Triggers & generates individual ranking`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('individualRankingCron')
  async individualRankingCron() {
    return this.movementsService.individualRankingCron();
  }

  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Gets individual movements`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('get-individual')
  async individualRanking(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    const lastMonthResume = await this.movementsService.montlhyResume(partner);
    return this.movementsService.totalResume(partner, lastMonthResume);
  }

  // leadership Ranking
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Cron that Triggers & generates leadership ranking`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('leadershipRankingCron')
  async leadershipRankingCron() {
    return this.movementsService.leadershipRankingCron();
  }

  @Roles(EnumApplicationsType.ASSOCIATED, EnumApplicationsType.PARTNER)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Gets Leadership movements`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('get-leadership')
  async getLeadership(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.movementsService.getLeadership(partner);
  }

  @Roles(EnumApplicationsType.ASSOCIATED, EnumApplicationsType.PARTNER)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Gets score system`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('score-system')
  async getScoreSystem(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.movementsService.scoreSystem(partner);
  }

  // reports
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Cron that Triggers & generates reports for all partners`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('generateReportsCron')
  async createReport() {
    await this.movementsService.generateReportsCron();
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Generates ranking by time range: Week || Month || Bimester`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('generateRanking/:timeRange')
  async generateRanking(@Param('timeRange') timeRange: EnumRankType) {
    await this.movementsService.generateRanking(timeRange);
  }
}
