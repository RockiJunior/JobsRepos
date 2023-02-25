import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TAGS_CONFIG } from '../../../common/constants';

@Entity({ name: TAGS_CONFIG })
export class TagsConfig {
  @PrimaryGeneratedColumn('increment')
  TagId: number;

  @Column({ type: 'nvarchar', nullable: false })
  TagName: string;

  @Column({ type: 'nvarchar', nullable: false })
  TagValue: string;

  @Column({ type: 'nvarchar', nullable: false })
  Type: string;

  @Column({ type: 'bit', nullable: false })
  Active: boolean;

  @Column({ type: 'datetime', nullable: false })
  DateSave: Date;

  @Column({ type: 'datetime' })
  DateInactive: Date;
}
