import { Test, TestingModule } from '@nestjs/testing';
import { MockUpController } from './mock-up.controller';
import { MockUpService } from './mock-up.service';

describe('MockUpController', () => {
  let controller: MockUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockUpController],
      providers: [MockUpService],
    }).compile();

    controller = module.get<MockUpController>(MockUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
