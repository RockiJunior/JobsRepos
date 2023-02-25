//Entity properties
// id
// name

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { COMMISSION_TYPES } from '../constants';

@Entity({ name: COMMISSION_TYPES })
export class CommissionType {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  name: string;
}
