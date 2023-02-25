import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { Roles } from './auth/decorators/roles.decorator';

import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { UserGuard } from './auth/guards/users.guard';
import { EnumApplicationsType } from './common/constants';
import { RolesGuard } from './auth/guards/roles.guard';

@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Roles(EnumApplicationsType.SUPERADMIN)
  // @UseGuards(RolesGuard, UserGuard)
  @Public()
  @Post()
  executeMockUps() {
    try{
      return this.appService.executeMockUps();
    }catch(err){
      return {
        message: `Can't create mockups!`,
        err
      }
    }
  }
}
