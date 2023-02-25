import { Test, TestingModule } from '@nestjs/testing';
import { RetroUserAnswerController } from './retro-user-answer.controller';
import { RetroUserAnswerService } from './retro-user-answer.service';

describe('RetroUserAnswerController', () => {
  let controller: RetroUserAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetroUserAnswerController],
      providers: [RetroUserAnswerService],
    }).compile();

    controller = module.get<RetroUserAnswerController>(RetroUserAnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
