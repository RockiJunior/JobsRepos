import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LOAD_MOVEMENTS } from '../constants';

@Entity({ name: LOAD_MOVEMENTS })
export class LoadMovement {
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
