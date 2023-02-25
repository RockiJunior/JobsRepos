import { Course } from 'src/api/Course/entities/course.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SURVEY } from '../../../common/constants';

@Entity({ name: SURVEY })
export class Survey {
  @PrimaryGeneratedColumn('uuid')
  IdSurvey: string;

  @Column({ type: 'nvarchar' })
  Name: string;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  Created: Date;

  @OneToMany(() => Course, (course) => course.survey)
  course: Course;
}
