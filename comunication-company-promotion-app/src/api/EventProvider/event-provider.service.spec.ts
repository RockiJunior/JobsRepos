import { Test, TestingModule } from '@nestjs/testing';
import { EventProviderService } from './event-provider.service';

describe('EventProviderService', () => {
  let service: EventProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventProviderService],
    }).compile();

    service = module.get<EventProviderService>(EventProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
