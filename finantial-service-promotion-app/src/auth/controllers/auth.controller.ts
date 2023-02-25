import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './../services/auth.service';
import { User } from '../../api/users/entities/user.entity';
import { Partner } from '../../common/database_entities/partner.entity';
import { LoginPartnerDto, LoginUserDto } from '../dtos/auth.dto';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: `Login of User`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() _: LoginUserDto, @Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }

  @ApiOperation({
    summary: `Login of User for use in Crons ONLY`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @UseGuards(AuthGuard('local'))
  @Post('generate-withOutExpToken')
  generateJWTWithOutExp(@Body() _: LoginUserDto, @Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWTWithOutExp(user);
  }

  @ApiOperation({
    summary: `Logout of User`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @UseGuards(AuthGuard('local'))
  @Post('logout')
  logout(@Body() _: LoginUserDto, @Req() req: Request) {
    const user = req.user as User;
    return this.authService.logout(user);
  }

  @ApiOperation({
    summary: `Login of Partners`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @UseGuards(AuthGuard('partner_local'))
  @Post('partners/login')
  partnerLogin(@Body() _: LoginPartnerDto, @Req() req: Request) {
    const user = req.user as Partner;
    return this.authService.generatePartnerJWT(user);
  }

  @ApiOperation({
    summary: `Logout of Partners`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @UseGuards(AuthGuard('partner_local'))
  @Post('partners/logout')
  @HttpCode(HttpStatus.OK)
  partnerLogout(@Req() req: Request) {
    const partner = req.user as Partner;
    return this.authService.partersLogout(partner);
  }
}
