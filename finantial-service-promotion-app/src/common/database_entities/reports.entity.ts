import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { REPORTS } from '../constants';
import { MovementTypes } from './movement_types.entity';
import { Partner } from './partner.entity';
import { ReportHasMovements } from './report_has_movement.entity';

@Entity({ name: REPORTS })
export class Reports {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  quantity: number;

  @Column()
  amount: number;

  @Column()
  week: number;

  @ManyToOne(() => MovementTypes, movement_types => movement_types.reports)
  movement_type: MovementTypes;

  @ManyToOne(() => Partner, partner => partner.reports)
  partner: Partner;

  @OneToMany(() => ReportHasMovements, report_has_movements => report_has_movements.report, {
    cascade: true,
  })
  report_has_movements: ReportHasMovements[];

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
