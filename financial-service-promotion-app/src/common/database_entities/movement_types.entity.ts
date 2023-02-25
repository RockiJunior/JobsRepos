import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MOVEMENT_TYPES } from '../constants';
import { Movements } from './movements.entity';
import { Reports } from './reports.entity';

@Entity({ name: MOVEMENT_TYPES })
export class MovementTypes {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Movements, movements => movements.movement_types)
  movement: Movements;

  @OneToMany(() => Reports, reports => reports.movement_type, {
    cascade: true,
  })
  reports: Reports[];
}
