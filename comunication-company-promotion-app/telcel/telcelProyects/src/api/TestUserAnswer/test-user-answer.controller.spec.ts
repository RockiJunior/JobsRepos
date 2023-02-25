import { Test, TestingModule } from '@nestjs/testing';
import { TestUserAnswerController } from './test-user-answer.controller';
import { TestUserAnswerService } from './test-user-answer.service';

describe('TestUserAnswerController', () => {
  let controller: TestUserAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestUserAnswerController],
      providers: [TestUserAnswerService],
    }).compile();

    controller = module.get<TestUserAnswerController>(TestUserAnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
