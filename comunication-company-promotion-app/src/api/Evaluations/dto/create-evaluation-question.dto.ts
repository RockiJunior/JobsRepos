import { CreateEvaluationAnswerDto } from './create-evaluation-answer.dto';

export class CreateEvaluationQuestionDto {
  question: string;
  documentType: number;
  answers: [CreateEvaluationAnswerDto];
}
