import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { GRAL_REPORTS_SCORE } from '../constants';

@Entity({ name: GRAL_REPORTS_SCORE })
export class GralReportsScore {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  quarter: number;

  @Column({ type: 'int' })
  quantityOfAssoc: number;

  @Column({ type: 'int' })
  quantityOfSilver: number;

  @Column({ type: 'int' })
  quantityOfGold: number;

  @Column({ type: 'float' })
  averageOfAssoc: number;

  @Column({ type: 'float' })
  averageOfSilver: number;

  @Column({ type: 'float' })
  averageOfGold: number;

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
