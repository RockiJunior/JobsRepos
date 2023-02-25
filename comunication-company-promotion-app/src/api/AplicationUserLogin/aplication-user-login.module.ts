import { Module } from '@nestjs/common';
import { AplicationUserLoginService } from './aplication-user-login.service';
import { AplicationUserLoginController } from './aplication-user-login.controller';

@Module({
  controllers: [AplicationUserLoginController],
  providers: [AplicationUserLoginService],
})
export class AplicationUserLoginModule {}
