import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from './api/GeneralUsers/auth/decorators/public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@ApiOperation({ summary: 'Executes Permissions MockUp' })
	@Public()
	@Post('create-mockups')
	executeMockUps() {
		try {
			return this.appService.executeMockUps();
		} catch (err) {
			return {
				message: `Can't create mockups!`,
				err,
			};
		}
	}
}
