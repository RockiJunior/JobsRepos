import { Entity, Column, PrimaryGeneratedColumn, Index, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { COMMISSIONS } from '../constants';

@Entity({ name: COMMISSIONS })
export class Commission {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  commissionName: string;

  @Column({ type: 'int' })
  conceptId: number;

  @Column({ type: 'int' })
  typeCommissionId: number;

  @Column({ type: 'varchar' })
  ranking: string;

  @Column({ type: 'varchar' })
  group: string;

  @Column({ type: 'int' })
  levelId: number;

  @Column({ type: 'varchar' })
  calculationBasis: string;

  @Column({ type: 'varchar', nullable: true })
  rule: string;

  @Column({ type: 'varchar', nullable: true })
  ruleValue: string;

  @Column({ type: 'float' })
  ruleComputeValue: number;

  @Column({ type: 'int' })
  measurmentUnitId: number;

  @Column({ type: 'int' })
  measurment_value: number;

  @Column({ type: 'int' })
  paymentChronologyId: number;

  @Column({ type: 'date' })
  apply_since: Date;

  @Column({ type: 'int' })
  is_active: boolean;
}
