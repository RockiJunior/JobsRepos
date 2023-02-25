import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EnumLeaderRank, EnumPeriodRanking, RANKING_PARTNERS_LEADERSHIP } from '../constants';
import { Partner } from './partner.entity';

@Entity({ name: RANKING_PARTNERS_LEADERSHIP })
export class RankingPartnersLead {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'int' })
  period: number;

  @Column({ type: 'int' })
  level: string;

  @Column({ type: 'int', default: 0 })
  bonusGoal: number;

  @Column({ type: 'int', default: 0 })
  monthlyBonus: number;

  @Column({ type: 'int', default: 0 })
  networkProd: number;

  @ManyToOne(() => Partner, partner => partner.leadership_ranking)
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
