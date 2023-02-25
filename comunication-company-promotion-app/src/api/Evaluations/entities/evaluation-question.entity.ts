import { ENTITY_EVALUATION_QUESTION } from 'src/common/constants';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { DocumentType } from '../../Document-type/entities/document-type.entity';
import { EvaluationAnswer } from './evaluation-answer.entity';

@Entity({ name: ENTITY_EVALUATION_QUESTION })
export class EvaluationQuestion {
  @PrimaryGeneratedColumn('uuid')
  IdEvaluationQuestion: string;

  @Column({ type: 'nvarchar', nullable: false })
  QuestionName: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;

  @Column({ type: 'bit', nullable: false })
  QuestionVideo: boolean;

  @OneToOne(
    () => DocumentType,
    (documentType) => documentType.evaluationQuestion,
  )
  @JoinColumn({ name: 'IdDocumentType' })
  documentType: DocumentType;

  @OneToMany(
    () => EvaluationAnswer,
    (evaluationAnswer) => evaluationAnswer.question,
  )
  answer: EvaluationAnswer;
}
