import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CONTROL_ACCESS_TAG } from '../../../common/constants';

@Entity({ name: CONTROL_ACCESS_TAG })
export class ControlaccessTag {
  @PrimaryGeneratedColumn('increment')
  ControlaccessId: number;

  @Column({ type: 'nvarchar', nullable: false })
  ApplicationId: string;

  @Column({ type: 'nvarchar', nullable: false })
  TagName: string;

  @Column({ type: 'nvarchar', nullable: false })
  TagValue: string;

  //   relacion con control access dates
  //   @Column({ type: 'nvarchar', nullable: false })
  //   ControlaccessdatesId: number;
  @Column({ type: 'datetime', nullable: false })
  DateAssignmentTag: Date;

  @Column({ type: 'bit', default: false })
  Active: boolean;
}
