import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EnumMovementsStatus, MOVEMENTS } from '../constants';
import { MovementTypes } from './movement_types.entity';
import { Partner } from './partner.entity';
import { LoadMovement } from './loadMovement.entity';

@Entity({ name: MOVEMENTS })
export class Movements {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  folio: string;

  @Column({ type: 'varchar', length: 45 })
  amount: string;

  @Column({ type: 'varchar', length: 45 })
  quantity: string;

  @Column({ type: 'varchar' })
  status: string;

  // @Column({ type: 'varchar' })
  // last: string;

  @Column({ type: 'date', nullable: true })
  date_movement: Date;

  @ManyToOne(() => MovementTypes, movement_types => movement_types.movement)
  movement_types: MovementTypes;

  @ManyToOne(() => Partner, partner => partner.movements)
  partner: Partner;

  @Column({ type: 'int' })
  partnerId: number;

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

  @Column({ type: 'int' })
  id_load: number;

  @Column({ type: 'int', default: false })
  is_deleted: boolean;
}
