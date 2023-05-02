import { Module } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { GoogleMapsController } from './google-maps.controller';

@Module({
  controllers: [GoogleMapsController],
  providers: [GoogleMapsService]
})
export class GoogleMapsModule {}
