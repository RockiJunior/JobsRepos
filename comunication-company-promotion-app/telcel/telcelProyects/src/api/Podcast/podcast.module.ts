import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { Document } from '../Documents/entities/document.entity';
import { User } from '../Users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Document, User])],
  controllers: [PodcastController],
  providers: [PodcastService],
})
export class PodcastModule {}
