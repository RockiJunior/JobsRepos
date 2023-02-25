import { Module } from '@nestjs/common';
import { CompletedUserPodcastService } from './completed-user-podcast.service';
import { CompletedUserPodcastController } from './completed-user-podcast.controller';

@Module({
  controllers: [CompletedUserPodcastController],
  providers: [CompletedUserPodcastService]
})
export class CompletedUserPodcastModule {}
