import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/document.entity';
import { Podcast } from '../Podcast/entities/podcast.entity';
import { Video } from '../Video/entities/video.entity';
import { CampaingDocument } from '../Devices/entities/campaingDocument.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Podcast, Video, CampaingDocument]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
