import { Test, TestingModule } from '@nestjs/testing';
import { CampaingController } from './campaing.controller';
import { CampaingService } from './campaing.service';

describe('CampaingController', () => {
  let controller: CampaingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaingController],
      providers: [CampaingService],
    }).compile();

    controller = module.get<CampaingController>(CampaingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
