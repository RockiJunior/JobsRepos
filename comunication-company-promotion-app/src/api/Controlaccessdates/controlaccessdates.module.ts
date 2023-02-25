import { Module } from '@nestjs/common';
import { ControlaccessdatesService } from './controlaccessdates.service';
import { ControlaccessdatesController } from './controlaccessdates.controller';

@Module({
  controllers: [ControlaccessdatesController],
  providers: [ControlaccessdatesService]
})
export class ControlaccessdatesModule {}
