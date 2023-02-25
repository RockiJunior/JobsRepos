import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MODEL_TERRITORIES } from '../constants';
import { Partner } from './partner.entity';

@Entity(MODEL_TERRITORIES)
export class Territory {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'varchar' })
  state: string;

  @Column({ type: 'varchar' })
  municipality: string;

  @Column({ type: 'varchar' })
  colony: string;

  @Column({ type: 'varchar' })
  territorial: string;

  @OneToMany(() => Partner, partner => partner.territory)
  partners: Partner[];
}
