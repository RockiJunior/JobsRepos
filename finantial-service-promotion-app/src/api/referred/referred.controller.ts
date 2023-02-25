import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ExceptionResponseError } from '../../config/exceptions/dto/exceptions.response.errors';
import { PartnerGuard } from '../../auth/guards/partner.guard';
import { ReferredService } from './referred.service';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EnumApplicationsType } from '../../common/constants';

//DTO´s
import { ReferredResponseDTO } from './dto/referred.response.dto';
import { Partner } from 'src/common/database_entities/partner.entity';
import { PartnerResponseDTO } from './dto/partner.response.dto';
import { TotalCoursesResponseDTO } from './dto/total.courses.response.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('referred')
@Controller('referred')
export class ReferredController {
  constructor(private readonly referredService: ReferredService) {}

  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Login data for referred',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ReferredResponseDTO,
    description: 'Login data for referred.',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Post()
  async register(@Body() referredRegisterDTO) {
    await this.referredService.registerReferred(referredRegisterDTO);
  }

  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gets Referred by partner Id',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ReferredResponseDTO, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get()
  async getReferredbyUserId(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return this.referredService.listReferred(partner);
  }

  @Get('profile/accreditation')
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @ApiOperation({
    summary: 'Gets acreditation data by partner Id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: PartnerResponseDTO, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async acreditationData(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return await this.referredService.getAcreditationData(partner);
  }

  @Get('network/courses')
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gets courses of the network partners',
  })
  @ApiResponse({ status: HttpStatus.OK, type: TotalCoursesResponseDTO, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async networkcourses(@Req() req: Request) {
    const partner = req['partner'] as Partner;
    return await this.referredService.getNetworkcourses(partner);
  }

  @Delete(':referredId')
  @Roles(EnumApplicationsType.PARTNER, EnumApplicationsType.ASSOCIATED)
  @UseGuards(RolesGuard, PartnerGuard) @ApiOperation({
    summary: 'Removes a specific referred by Id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'It only returns a status NO_CONTENT' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async deleteRole(@Param('referredId') referredId: string) {
    await this.referredService.deleteReferred(referredId);
  }
}
