import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { GRAL_REPORTS_ACTIVITY } from '../constants';

@Entity({ name: GRAL_REPORTS_ACTIVITY })
export class GralReportsActivity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  week: number;

  @Column({ type: 'int' })
  quantityOfDisbursements: number;

  @Column({ type: 'int' })
  quantityOfQueries: number;

  @Column({ type: 'int' })
  quantityOfBuyback: number;

  @Column({ type: 'float' })
  averageOfDisbursements: number;

  @Column({ type: 'float' })
  averageOfQueries: number;

  @Column({ type: 'float' })
  averageOfBuyback: number;

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
  updateDateAt() {
    this.updatedAt = new Date();
  }
}
