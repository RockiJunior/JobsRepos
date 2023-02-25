import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserGuard } from 'src/auth/guards/users.guard';
import { EnumApplicationsType } from 'src/common/constants';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';
import { RankingIndividualPatchDTO } from '../dto/rankingsIndividual.patch.dto';
import { RankingIndividualService } from './rankingsIndividual.service';

@UseGuards(JwtAuthGuard)
@ApiTags('rankingsIndividual')
@Controller('rankingsIndividual')
export class RankingIndividualController {
  constructor(private rankingIndividualService: RankingIndividualService) {}

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets all Ranking individual`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get()
  async getAllRankings(@Req() req: Request) {
    return this.rankingIndividualService.findAll();
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets all ranking individual for level`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get('for-level')
  async getRankingsForLevel() {
    return this.rankingIndividualService.findAllForLevel();
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get('for-score')
  async getRankingsForScore() {
    return this.rankingIndividualService.findAllForScore();
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Find a specific ranking by Id`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get(':idRanking')
  async getRankingById(@Param('idRanking') id: string) {
    return this.rankingIndividualService.findById(id);
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Updates a specific ranking by Id`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @ApiBody({ type: RankingIndividualPatchDTO })
  @Patch('update-ranking/:idRanking')
  async updateRankingById(@Param('idRanking') id: string, @Body() rankingIndividual: RankingIndividualPatchDTO) {
    return this.rankingIndividualService.updateRankingById(id, rankingIndividual);
  }
}
