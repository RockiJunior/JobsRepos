import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MODEL_REFERRED } from '../constants';
import { Partner } from './partner.entity';

@Entity({ name: MODEL_REFERRED })
export class ReferredEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => Partner, partner => partner.referred)
  @JoinColumn()
  partner: Partner;

  @ManyToOne(() => Partner, partner => partner)
  @JoinColumn()
  referred: Partner;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'int', default: false })
  isDeleted: boolean;

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
