import { CourseSurvey } from 'src/api/CourseSurvey/entities/course-survey.entity';
import { Survey } from 'src/api/Survey/entities/survey.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { COURSE } from '../../../common/constants';

@Entity({ name: COURSE })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  IdCourse: string;

  @Column({ type: 'nvarchar' })
  KeyCourse: string;

  @Column({ type: 'bit', nullable: false })
  Active: boolean;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  Created: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  Modified: Date;

  @Column({ type: 'int', default: 0 })
  Priority: number;

  @Column({ type: 'real', default: 0 })
  SurveyAproved: number;

  @ManyToOne(() => Survey, (survey) => survey.course)
  @JoinColumn({ name: 'SurveyId' })
  survey: Survey;

  @OneToMany(() => CourseSurvey, (courseSurvey) => courseSurvey.course)
  courseSurvey: CourseSurvey[];
}
