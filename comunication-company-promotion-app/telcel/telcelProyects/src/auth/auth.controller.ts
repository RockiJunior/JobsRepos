import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DISTRIBUIDOR } from 'src/common/constants';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { UserLoginDto } from './dto/user-login.dto';
// import { UserRegisterDto } from './dto/user-register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { TokensGuard } from './guards/tokens.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    description: 'User login endpoint',
    status: HttpStatus.ACCEPTED,
    type: UserLoginDto,
  })
  @Post('login')
  async userLogin(@Body() userLoginDto: UserLoginDto) {
    return this.authService.userLogin(userLoginDto);
  }

  @ApiResponse({
    description: 'Block token after 30 minutes of inactivity.',
    status: HttpStatus.ACCEPTED,
    type: String,
  })
  @Post('expire-token/:userId')
  async expireToken(@Param('userId') userId: string) {
    return this.authService.expireToken(userId);
  }

  //Ejemplo de prueba de utilización de guardias
  @Roles(DISTRIBUIDOR)
  @UseGuards(JwtAuthGuard, RolesGuard, TokensGuard)
  @Get('prueba')
  async prueba() {
    console.log('Entró');
    return 'Accede a la ruta.'
  }
}
