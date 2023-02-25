import { Test, TestingModule } from '@nestjs/testing';
import { EventProviderController } from './event-provider.controller';
import { EventProviderService } from './event-provider.service';

describe('EventProviderController', () => {
  let controller: EventProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventProviderController],
      providers: [EventProviderService],
    }).compile();

    controller = module.get<EventProviderController>(EventProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
