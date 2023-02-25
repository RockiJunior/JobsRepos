import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserGuard } from 'src/auth/guards/users.guard';
import { EnumApplicationsType } from 'src/common/constants';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';
import { RankingLeadershipPatchDTO } from '../dto/rankingsLeadership.path.dto';
import { RankingLeadershipService } from './rankingLeadership.service';

@UseGuards(JwtAuthGuard)
@ApiTags('rankingsLeadership')
@Controller('rankingsLeadership')
export class RankingLeadershipController {
  constructor(private rankingLeadershipService: RankingLeadershipService) {}

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets all leadership ranking`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get()
  async getAllRankings(@Req() req: Request) {
    return this.rankingLeadershipService.findAll();
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Gets a specific leadership ranking by Id`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get(':idRanking')
  async getRankingById(@Param('idRanking') id: string) {
    return this.rankingLeadershipService.findById(id);
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  // @ApiExcludeEndpoint()
  @ApiOperation({
    summary: `Updates a leadership ranking`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @ApiBody({ type: RankingLeadershipPatchDTO })
  @Patch('update-ranking')
  async updateRanking(@Body() rankingLeadership: RankingLeadershipPatchDTO) {
    return this.rankingLeadershipService.updateRanking(rankingLeadership);
  }

  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: `Updates a leadership ranking`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @ApiBody({ type: RankingLeadershipPatchDTO })
  @Patch('update-ranking/:idRanking')
  async updateRankingById(@Param('idRanking') id: string, @Body() rankingLeadership: RankingLeadershipPatchDTO) {
    return this.rankingLeadershipService.updateRankingById(id, rankingLeadership);
  }
}
