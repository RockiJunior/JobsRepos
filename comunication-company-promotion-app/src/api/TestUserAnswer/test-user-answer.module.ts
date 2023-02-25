import { Module } from '@nestjs/common';
import { TestUserAnswerService } from './test-user-answer.service';
import { TestUserAnswerController } from './test-user-answer.controller';

@Module({
  controllers: [TestUserAnswerController],
  providers: [TestUserAnswerService]
})
export class TestUserAnswerModule {}
