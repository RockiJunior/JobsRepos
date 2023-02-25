import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GRAL_REPORTS_ASSOC } from '../constants';

@Entity({ name: GRAL_REPORTS_ASSOC })
export class GralReportsAssoc {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  week: number;

  @Column({ type: 'int' })
  quantityAffiliates: number;

  @Column({ type: 'int' })
  quantityPendingAffiliates: number;

  @Column({ type: 'int' })
  quantityRejectedAffiliates: number;

  @Column({ type: 'float' })
  averageAffiliates: number;

  @Column({ type: 'float' })
  averagePendings: number;

  @Column({ type: 'float' })
  averageRejected: number;

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
