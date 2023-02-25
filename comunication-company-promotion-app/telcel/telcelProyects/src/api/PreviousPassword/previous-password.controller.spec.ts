import { Test, TestingModule } from '@nestjs/testing';
import { PreviousPasswordController } from './previous-password.controller';
import { PreviousPasswordService } from './previous-password.service';

describe('PreviousPasswordController', () => {
  let controller: PreviousPasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreviousPasswordController],
      providers: [PreviousPasswordService],
    }).compile();

    controller = module.get<PreviousPasswordController>(PreviousPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
