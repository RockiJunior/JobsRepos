import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { COURSE_TO_PARTNER, EnumCoursesStatus } from 'src/common/constants';
import { Partner } from 'src/common/database_entities/partner.entity';
import { Course } from 'src/common/database_entities/course.entity';

@Entity({ name: COURSE_TO_PARTNER })
export class LoadedCoursePartner {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column()
  status: EnumCoursesStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string;

  @Column({ type: 'timestamp' })
  evaluationDate: Date;

  @ManyToOne(() => Partner, partner => partner.courseToPartner)
  partner: Partner;

  @ManyToOne(() => Course, course => course.courses)
  course: Course;

  @Column()
  courseId: number;

  @Column()
  partnerId: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'int', nullable: true })
  id_load: number;

  @Column({ type: 'int', nullable: true })
  is_deleted: boolean;

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
