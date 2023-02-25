// Libraries
import { Controller } from '@nestjs/common';
// Databases, Controllers, Services & Dtos
import { AuthService } from './auth.service';

// @ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
}
