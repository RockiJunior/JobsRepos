import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MONTHLY_GOAL } from '../constants';
import { Partner } from './partner.entity';

@Entity({ name: MONTHLY_GOAL })
export class MonthlyGoal {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'float' })
  meta_2: number;

  @Column({ type: 'float' })
  meta_3: number;

  @Column({ type: 'int' })
  goal: number;

  @Column({ type: 'int' })
  desembolsos_red: number;

  @Column({ type: 'float' })
  fee: number;

  @Column({ type: 'float' })
  earnings: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Partner, partner => partner.monthly_goal)
  partner: Partner;

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
