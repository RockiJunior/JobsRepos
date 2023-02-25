import { number } from 'joi';
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EnumPeriodRanking, EnumRankType } from '../constants';
import { Partner } from './partner.entity';

@Entity()
export class Ranking {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'int' })
  period: number;

  @ManyToOne(() => Partner, partner => partner.ranking)
  partner: Partner;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @BeforeInsert()
  createDateAt() {
    this.createdAt = new Date();
  }
}
