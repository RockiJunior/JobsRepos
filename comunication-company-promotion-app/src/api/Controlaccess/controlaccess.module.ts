import { Module } from '@nestjs/common';
import { ControlaccessService } from './controlaccess.service';
import { ControlaccessController } from './controlaccess.controller';

@Module({
  controllers: [ControlaccessController],
  providers: [ControlaccessService]
})
export class ControlaccessModule {}
