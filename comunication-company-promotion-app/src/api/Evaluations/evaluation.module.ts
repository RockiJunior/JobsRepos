import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluation.service';
import { EvaluationsController } from './evaluation.controller';
import { EvaluationQuestion } from './entities/evaluation-question.entity';
import { EvaluationAnswer } from './entities/evaluation-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationQuestion, EvaluationAnswer])],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
})
export class EvaluationsModule {}
