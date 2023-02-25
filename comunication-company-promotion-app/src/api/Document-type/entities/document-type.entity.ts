import { ENTITY_DOCUMENT_TYPE } from 'src/common/constants';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { EvaluationQuestion } from '../../Evaluations/entities/evaluation-question.entity';

@Entity({ name: ENTITY_DOCUMENT_TYPE })
export class DocumentType {
  @PrimaryGeneratedColumn({ type: 'int' })
  IdDocumentType: number;

  @Column({ type: 'nvarchar' })
  DocuemntTypeName: string;

  @Column({ type: 'datetime' })
  DateAD: Date;

  @OneToOne(
    () => EvaluationQuestion,
    (evaluationQuestion) => evaluationQuestion.documentType,
  )
  evaluationQuestion: EvaluationQuestion;
}
