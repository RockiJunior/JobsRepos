import { Test, TestingModule } from '@nestjs/testing';
import { CampaingService } from './campaing.service';

describe('CampaingService', () => {
  let service: CampaingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaingService],
    }).compile();

    service = module.get<CampaingService>(CampaingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
