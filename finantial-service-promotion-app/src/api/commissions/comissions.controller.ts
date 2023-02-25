import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserGuard } from 'src/auth/guards/users.guard';
import { EnumApplicationsType } from 'src/common/constants';
import { Partner } from 'src/common/database_entities/partner.entity';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';
import { PartnerGuard } from '../../auth/guards/partner.guard';
import { CommissionsService } from './commissions.service';
import { CommissionsPatchDTO } from './dtos/patch_commisions.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('commissions')
@Controller('commissions')
export class CommissionsController {
  constructor(private commissionsService: CommissionsService) {}

  //Get individual commissions configs CMS
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets individual commissions Config(CMS)`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/individual')
  async getCommissionsIndividual() {
    return this.commissionsService.findAll(true);
  }

  //Get leadership commissions configs CMS
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets leadership commissions Config(CMS)`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/leadership')
  async getCommissionsLeadership() {
    return this.commissionsService.findAll(false);
  }

  //Generate individual commission
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Generates individual commissions`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('generateIndividualCron')
  async generateIndividualCommissionCron() {
    return this.commissionsService.generateIndividualCommCron();
  }

  //Get partner individual commissions
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Gets individual-commissions`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('get-individual')
  async getIndividualCommission(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.commissionsService.getIndividualCommission(partner);
  }

  //Generate leadership commissions
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Generates leadership-commissions`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('generateLeadershipCron')
  async generateLeadershipCommission() {
    await this.commissionsService.generateLeadershipCommCron();
  }

  //Generate partner monthly bonus
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Generates Monthly bonus`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('generateMonthlyBonusCron')
  async generateMonthlyBonus() {
    return this.commissionsService.generateMonthlyBonusCron();
  }

  //Generate partner monthly goal
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Generates Monthly Goal`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('generateMonthlyGoalCron')
  async generateMonthlyGoal() {
    return this.commissionsService.generateMonthlyGoalCron();
  }

  //Get partner monthly bonus
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Gets monthly bonus`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Get('get-monthly-bonus')
  async getMonthlyBonus(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.commissionsService.getMonthlyBonus(partner);
  }

  //Get partner account state
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: `Gets account state`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('account-state')
  async getAccountState(@Req() req: Request, @Query('mes') mes: number) {
    const partner = req['partner'] as Partner;
    return this.commissionsService.getAccountState(partner, mes);
  }

  //Find commission by id
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets a specific comission by Id`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('/:id')
  async getCommissionById(@Param('id') id: number) {
    return this.commissionsService.findById(id);
  }

  //Update commission by id
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Updates a specific comission by Id`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Patch('/update/:id')
  async updateCommissionById(@Param('id') id: number, @Body() commission: CommissionsPatchDTO) {
    return this.commissionsService.update(id, commission);
  }

  //Delete commission by id
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Deletes a specific comission by Id`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Delete('/delete/:id')
  async deleteCommissionById(@Param('id') id: number) {
    return this.commissionsService.delete(id);
  }
}
