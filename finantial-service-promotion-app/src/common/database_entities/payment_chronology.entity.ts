import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PAYMENT_CHRONOLOGY } from '../constants';

@Entity({ name: PAYMENT_CHRONOLOGY })
export class PaymentChronology {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  chronology: string;
}
