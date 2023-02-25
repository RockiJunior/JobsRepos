import { Entity, Column, PrimaryGeneratedColumn, Index, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { COURSES } from '../constants';
import { CourseToPartner } from './coursePartner.entity';

@Entity({ name: COURSES })
export class Course {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 255 })
  createDate: string;

  @Column({ type: 'timestamp' })
  validityDate: Date;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'int' })
  initial: boolean;

  @OneToMany(() => CourseToPartner, courseToPartner => courseToPartner.course, {
    cascade: true,
  })
  courses: CourseToPartner[];

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
