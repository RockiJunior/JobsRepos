import { Test, TestingModule } from '@nestjs/testing';
import { BranchOfficesController } from './branch-offices.controller';
import { BranchOfficesService } from './branch-offices.service';

describe('BranchOfficesController', () => {
  let controller: BranchOfficesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchOfficesController],
      providers: [BranchOfficesService],
    }).compile();

    controller = module.get<BranchOfficesController>(BranchOfficesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
