import { Entity, Column, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { MODEL_SEQUENTIAL, EnumSecuentialTypes } from '../constants';

@Entity(MODEL_SEQUENTIAL)
export class SequentialEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @Column({ type: 'int', default: 0 })
  seq: number;
}
