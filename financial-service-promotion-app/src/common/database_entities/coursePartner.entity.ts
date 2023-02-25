import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { COURSE_TO_PARTNER, EnumCoursesStatus } from 'src/common/constants';
import { Partner } from './partner.entity';
import { Course } from './course.entity';

@Entity({ name: COURSE_TO_PARTNER })
export class CourseToPartner {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column()
  status: EnumCoursesStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string;

  @Column({ type: 'timestamp', nullable: true })
  evaluationDate: Date;

  @ManyToOne(() => Partner, partner => partner.courseToPartner)
  partner: Partner;

  @ManyToOne(() => Course, course => course.courses)
  course: any;

  @Column()
  courseId: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  createDateAt() {
    this.createdAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async updateDateAt() {
    this.updatedAt = new Date();
  }
}
