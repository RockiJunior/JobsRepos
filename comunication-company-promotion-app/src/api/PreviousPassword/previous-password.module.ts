import { Module } from '@nestjs/common';
import { PreviousPasswordService } from './previous-password.service';
import { PreviousPasswordController } from './previous-password.controller';

@Module({
  controllers: [PreviousPasswordController],
  providers: [PreviousPasswordService]
})
export class PreviousPasswordModule {}
