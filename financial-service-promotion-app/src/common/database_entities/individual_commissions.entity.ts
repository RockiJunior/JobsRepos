import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { INDIVIDUAL_COMMISSIONS } from '../constants';
import { Partner } from './partner.entity';

@Entity({ name: INDIVIDUAL_COMMISSIONS })
export class IndividualCommissions {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  week: number;

  @Column({ type: 'float', nullable: true })
  amount_desembolsos_first: number;

  @Column({ type: 'int' })
  quantity_desembolsos_first: number;

  @Column({ type: 'float' })
  commission_desembolsos_first: number;

  @Column({ type: 'float' })
  fee_first_stretch: number;

  @Column({ type: 'float', nullable: true })
  amount_desembolsos_second: number;

  @Column({ type: 'int' })
  quantity_desembolsos_second: number;

  @Column({ type: 'float' })
  commission_desembolsos_second: number;

  @Column({ type: 'float' })
  fee_second_stretch: number;

  @Column({ type: 'int' })
  quantity_consultas: number;

  @Column({ type: 'int' })
  minimum_consultas: number;

  @Column({ type: 'float' })
  commission_consultas: number;

  @Column({ type: 'float' })
  fee_consultas: number;

  @Column({ type: 'float' })
  amount_recompras: number;

  @Column({ type: 'float' })
  commission_recompras: number;

  @Column({ type: 'float' })
  fee_recompras: number;

  @Column({ type: 'float' })
  commission_casos_al_corriente: number;

  @ManyToOne(() => Partner, partner => partner.individual_commission)
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
