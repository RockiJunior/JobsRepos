import { Module } from '@nestjs/common';
import { EventProviderService } from './event-provider.service';
import { EventProviderController } from './event-provider.controller';

@Module({
  controllers: [EventProviderController],
  providers: [EventProviderService]
})
export class EventProviderModule {}
