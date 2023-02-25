import { ENTITY_EVALUATION_ANSWER } from 'src/common/constants';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EvaluationQuestion } from './evaluation-question.entity';

@Entity({ name: ENTITY_EVALUATION_ANSWER })
export class EvaluationAnswer {
  @PrimaryGeneratedColumn('uuid')
  IdEvaluationAnswers: string;

  @Column({ type: 'nvarchar', nullable: false })
  AnswerName: string;

  @Column({ type: 'real', nullable: false })
  Weight: number;

  @Column({ type: 'int', nullable: false })
  Priority: number;

  @Column({ type: 'bit', nullable: false })
  Active: boolean;

  @Column({ type: 'datetime', nullable: false })
  DateLow: Date;

  @ManyToOne(
    () => EvaluationQuestion,
    (evaluationQuestion) => evaluationQuestion.answer,
  )
  @JoinColumn({ name: 'IdEvaluationQuestion' })
  question: EvaluationQuestion;
}
