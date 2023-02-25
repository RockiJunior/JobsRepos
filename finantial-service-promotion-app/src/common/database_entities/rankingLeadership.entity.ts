import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RANKING_LEADERSHIP } from '../constants';

@Entity({ name: RANKING_LEADERSHIP })
export class RankingLeadership {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', nullable: true })
  level: string;

  @Column({ type: 'int', nullable: false })
  status: boolean;

  @Column({ type: 'timestamp', nullable: false })
  apply_since: Date;

  @Column({ type: 'int', nullable: true })
  minimal_associates: number;

  @Column({ type: 'varchar', nullable: true })
  associate_type: string;

  @Column({ type: 'int', nullable: true })
  minimum_outlay: number;

  @Column({ type: 'int', nullable: true })
  min_act_percentage: number;

  @Column({ type: 'int', nullable: false, default: 1})
  trainging_status: boolean;
}
