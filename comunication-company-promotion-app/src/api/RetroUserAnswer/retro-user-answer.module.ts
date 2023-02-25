import { Module } from '@nestjs/common';
import { RetroUserAnswerService } from './retro-user-answer.service';
import { RetroUserAnswerController } from './retro-user-answer.controller';

@Module({
  controllers: [RetroUserAnswerController],
  providers: [RetroUserAnswerService]
})
export class RetroUserAnswerModule {}
