import { ENTITY_PODCAST } from 'src/common/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: ENTITY_PODCAST })
export class Podcast {
  @PrimaryGeneratedColumn('uuid')
  IdPodcast: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;

  @Column({ type: 'datetime', nullable: false })
  Modified: Date;

  @Column({ type: 'nvarchar' })
  Title: string;

  @Column({ type: 'nvarchar' })
  Description: string;

  @Column({ type: 'nvarchar' })
  Thumbnail: string;

  @Column({ type: 'nvarchar' })
  PodcastUrl: string;

  @Column({ type: 'nvarchar' })
  Origin: string;

  @Column({ type: 'bit' })
  EvaluationPodcast: boolean;

  @Column({ type: 'bit' })
  Status: boolean;

  @Column({ type: 'nvarchar' })
  UserId: string;

  @Column({ type: 'datetime' })
  DateCancel: Date;

  @Column({ type: 'time' })
  Duration: string;
}
