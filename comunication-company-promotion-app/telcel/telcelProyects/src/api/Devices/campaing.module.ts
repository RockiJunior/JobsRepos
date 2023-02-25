import { Module } from '@nestjs/common';
import { CampaingService } from './campaing.service';
import { CampaingController } from './campaing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaing } from './entities/campaing.entity';
import { Document } from '../Documents/entities/document.entity';
import { CampaingDocument } from './entities/campaingDocument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaing, Document, CampaingDocument])],
  controllers: [CampaingController],
  providers: [CampaingService],
})
export class CampaingModule {}
