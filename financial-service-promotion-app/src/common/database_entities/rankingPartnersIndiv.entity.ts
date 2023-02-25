import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EnumCuatrimRanking, RANKING_PARTNER_INDIVIDUAL } from '../constants';
import { Partner } from './partner.entity';

@Entity({ name: RANKING_PARTNER_INDIVIDUAL })
export class RankingPartnersIndiv {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  rank: string;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'int' })
  cuatrim: number;

  @Column({ type: 'int', nullable: true })
  week: number;

  @ManyToOne(() => Partner, partner => partner.individual_ranking)
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
