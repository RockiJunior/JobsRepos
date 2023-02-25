import { ENTITY_VIDEO } from 'src/common/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: ENTITY_VIDEO })
export class Video {
  @PrimaryGeneratedColumn('uuid')
  IdVideo: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;

  @Column({ type: 'datetime', nullable: false })
  Modified: Date;

  @Column({ type: 'nvarchar' })
  Title: string;

  @Column({ type: 'nvarchar' })
  Description: string;

  @Column({ type: 'nvarchar' })
  Thumbnail: Date;

  @Column({ type: 'nvarchar' })
  VideoUrl: string;

  @Column({ type: 'nvarchar' })
  Origin: string;

  @Column({ type: 'bit' })
  EvaluationVideo: boolean;

  @Column({ type: 'bit' })
  Status: boolean;

  @Column({ type: 'nvarchar' })
  UserId: string;

  @Column({ type: 'datetime' })
  DateCancel: Date;

  @Column({ type: 'nvarchar' })
  Duration: string;
}
