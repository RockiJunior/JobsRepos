import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RANKING_INDIVIDUAL } from '../constants';

@Entity({ name: RANKING_INDIVIDUAL })
export class RankingIndividual {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', nullable: true })
  level: string;

  @Column({ type: 'int', nullable: false })
  status: boolean;

  @Column({ type: 'timestamp', nullable: false })
  apply_since: Date;

  @Column({ type: 'int', nullable: true })
  min: number;

  @Column({ type: 'int', nullable: true })
  max: number;

  @Column({ type: 'int', nullable: true })
  score: number;

  @Column({ type: 'varchar', nullable: true })
  activity: string;
}
