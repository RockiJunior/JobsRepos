import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { MEASUREMENT_UNITS } from '../constants';

@Entity({ name: MEASUREMENT_UNITS })
export class MeasurementUnit {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;
}
