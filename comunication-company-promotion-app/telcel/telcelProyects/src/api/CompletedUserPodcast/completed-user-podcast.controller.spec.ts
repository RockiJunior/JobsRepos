import { Test, TestingModule } from '@nestjs/testing';
import { CompletedUserPodcastController } from './completed-user-podcast.controller';
import { CompletedUserPodcastService } from './completed-user-podcast.service';

describe('CompletedUserPodcastController', () => {
  let controller: CompletedUserPodcastController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompletedUserPodcastController],
      providers: [CompletedUserPodcastService],
    }).compile();

    controller = module.get<CompletedUserPodcastController>(CompletedUserPodcastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
