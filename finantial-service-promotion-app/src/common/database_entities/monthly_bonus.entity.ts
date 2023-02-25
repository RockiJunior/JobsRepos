import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MONTHLY_BONUS } from '../constants';
import { Partner } from './partner.entity';

@Entity({ name: MONTHLY_BONUS })
export class MonthlyBonus {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'float' })
  commission: number;

  @Column({ type: 'float' })
  total_amount: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Partner, partner => partner.month_bonus)
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
