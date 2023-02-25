import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SURVEY_DOCUMENT } from '../../../common/constants';

@Entity({ name: SURVEY_DOCUMENT })
export class SurveyDocument {
  @PrimaryGeneratedColumn('uuid')
  IdSurveyDocument: string;

  @Column({ type: 'real', nullable: false })
  Aproved: number;

  @Column({ type: 'nvarchar', nullable: false })
  SurveyId: string;
}
