import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LEADERSHIP_COMMISSIONS } from '../constants';
import { Partner } from './partner.entity';

@Entity({ name: LEADERSHIP_COMMISSIONS })
export class LeadershipCommissions {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  week: number;

  @Column({ type: 'float' })
  consultas_commission: number;

  @Column({ type: 'int' })
  consultas_quantity: number;

  @Column({ type: 'float' })
  credito_1: number;

  @Column({ type: 'float' })
  credito_2: number;

  @Column({ type: 'float' })
  credito_3: number;

  @ManyToOne(() => Partner, partner => partner.leadership_commission)
  partner: Partner;

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
