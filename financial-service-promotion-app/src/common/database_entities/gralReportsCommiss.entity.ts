import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { GRAL_REPORTS_COMMISS } from '../constants';

@Entity({ name: GRAL_REPORTS_COMMISS })
export class GralReportsCommiss {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  week: number;

  @Column({ type: 'int' })
  amountOfDisbursements: number;

  @Column({ type: 'int' })
  amountOfQueries: number;

  @Column({ type: 'int' })
  amountOfBuyBacks: number;

  @Column({ type: 'float' })
  averageOfDisbursements: number;

  @Column({ type: 'float' })
  averageOfQueries: number;

  @Column({ type: 'float' })
  averageOfBuyBacks: number;

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
