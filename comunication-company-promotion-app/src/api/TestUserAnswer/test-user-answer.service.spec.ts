import { Test, TestingModule } from '@nestjs/testing';
import { TestUserAnswerService } from './test-user-answer.service';

describe('TestUserAnswerService', () => {
  let service: TestUserAnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestUserAnswerService],
    }).compile();

    service = module.get<TestUserAnswerService>(TestUserAnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
