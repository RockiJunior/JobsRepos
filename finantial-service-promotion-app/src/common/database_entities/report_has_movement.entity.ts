import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EnumMovementsStatus, REPORT_HAS_MOVEMENTS } from '../constants';
import { Movements } from './movements.entity';
import { Reports } from './reports.entity';

@Entity({ name: REPORT_HAS_MOVEMENTS })
export class ReportHasMovements {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  status: EnumMovementsStatus;

  @ManyToOne(() => Reports, reports => reports.report_has_movements)
  report: Reports;

  @OneToOne(() => Movements)
  @JoinColumn()
  movement: Movements;
}
