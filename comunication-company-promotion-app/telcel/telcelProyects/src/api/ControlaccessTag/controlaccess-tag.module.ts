import { Module } from '@nestjs/common';
import { ControlaccessTagService } from './controlaccess-tag.service';
import { ControlaccessTagController } from './controlaccess-tag.controller';

@Module({
  controllers: [ControlaccessTagController],
  providers: [ControlaccessTagService]
})
export class ControlaccessTagModule {}
