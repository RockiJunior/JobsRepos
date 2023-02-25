// Entity properties
// id
// concept

import { Entity, Column, PrimaryGeneratedColumn, Index, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { CONCEPTS } from '../constants';

@Entity({ name: CONCEPTS })
export class Concept {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  concept: string;
}
