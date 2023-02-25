import { Test, TestingModule } from '@nestjs/testing';
import { CompletedUserPodcastService } from './completed-user-podcast.service';

describe('CompletedUserPodcastService', () => {
  let service: CompletedUserPodcastService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompletedUserPodcastService],
    }).compile();

    service = module.get<CompletedUserPodcastService>(CompletedUserPodcastService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
