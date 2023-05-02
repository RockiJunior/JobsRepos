import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from './api/GeneralUsers/auth/decorators/public.decorator';
import { AppService } from './app.service';
import { CheckPermissions } from './api/GeneralUsers/auth/decorators/permission.decorator';
import { PermissionEnumList } from './config/enum-types';
import { PermissionGuard } from './api/GeneralUsers/auth/guards/permission-guard';
import * as fs from 'fs';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello() {
		return this.appService.getHello();
	}

	@Public()
	@Get('version')
	getVersion() {
		// const packageJson = fs.readFileSync('package.json', 'utf8');
		// return this.appService.getServerVersion(packageJson);
		const version = '1.0.9';
		return this.appService.getServerVersion(version);
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

	@Public()
	@Post('test-mail')
	testMail(@Body() user: any) {
		const { token } = user;
		return this.appService.sendTestMail(user, token);
	}
}
