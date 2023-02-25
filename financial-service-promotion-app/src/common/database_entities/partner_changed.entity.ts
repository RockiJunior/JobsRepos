import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToOne } from 'typeorm';
import { PARTNER_CHANGED } from '../constants';
import { Partner } from './partner.entity';

@Entity({ name: PARTNER_CHANGED })
export class PartnerChanged {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  bank: string;

  @Column({ type: 'varchar' })
  accountNumber: string;

  @Column({ type: 'varchar' })
  clabe: string;

  @Column({ type: 'varchar' })
  folioAsociado: string;

  @Column({ type: 'varchar' })
  nombreCompleto: string;

  @Column({ type: 'timestamp' })
  fechaDeAfiliacion: Date;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'int' })
  territorio: number;

  @Column({ type: 'varchar' })
  nivelDeAsociado: string;

  @Column({ type: 'varchar' })
  rfc: string;

  @Column({ type: 'int' })
  isDeleted: boolean;

  @ManyToOne(() => Partner, partner => partner.partnerChanged)
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
