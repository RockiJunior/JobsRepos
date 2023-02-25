import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LOAD_COURSE_TO_PARTNER } from '../constants';

@Entity({ name: LOAD_COURSE_TO_PARTNER })
export class LoadCourseToPartner {
  @PrimaryGeneratedColumn('identity')
  id_load: number;

  @Column({ type: 'varchar' })
  filename: string;

  @Column({ type: 'timestamp' })
  creation_date: Date;

  @Column({ type: 'timestamp' })
  update_date: Date;

  @Column({ type: 'int' })
  valid_registers: number;

  @Column({ type: 'int' })
  invalid_registers: number;

  @Column({ type: 'int', default: false })
  is_deleted: boolean;

  @BeforeInsert()
  createDateAt() {
    this.creation_date = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async updateDateAt() {
    this.update_date = new Date();
  }
}
