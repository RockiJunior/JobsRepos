import { Module } from '@nestjs/common';
import { OldUserPasswordService } from './old-user-password.service';
import { OldUserPasswordController } from './old-user-password.controller';

@Module({
  controllers: [OldUserPasswordController],
  providers: [OldUserPasswordService]
})
export class OldUserPasswordModule {}
