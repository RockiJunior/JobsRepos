//Entity properties
// id
// name

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { LEVELS } from '../constants';

@Entity({ name: LEVELS })
export class Level {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 15 })
  name: string;

  @Column({ type: 'varchar', length: 3 })
  type: string;
}
