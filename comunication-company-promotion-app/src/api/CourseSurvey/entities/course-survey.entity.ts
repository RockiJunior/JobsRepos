import { Course } from 'src/api/Course/entities/course.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { COURSE_SURVEY } from '../../../common/constants';

@Entity({ name: COURSE_SURVEY })
export class CourseSurvey {
  @PrimaryColumn()
  SurveyDocumentId: string;

  @Column({ type: 'bit', nullable: false })
  Active: boolean;

  @Column({ type: 'int', nullable: false })
  Priority: number;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  Created: Date;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  Modified: Date;

  @ManyToOne(() => Course, (course) => course.courseSurvey)
  @JoinColumn({ name: 'CourseId' })
  course: Course;
}
