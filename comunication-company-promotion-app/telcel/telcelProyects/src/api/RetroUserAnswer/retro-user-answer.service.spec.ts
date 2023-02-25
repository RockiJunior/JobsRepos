import { Test, TestingModule } from '@nestjs/testing';
import { RetroUserAnswerService } from './retro-user-answer.service';

describe('RetroUserAnswerService', () => {
  let service: RetroUserAnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetroUserAnswerService],
    }).compile();

    service = module.get<RetroUserAnswerService>(RetroUserAnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
