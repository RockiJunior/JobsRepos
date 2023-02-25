import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EVENT } from '../../../common/constants';

@Entity({ name: EVENT })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  IdEvent: string;

  @Column({ type: 'nvarchar' })
  Name: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;
  @BeforeInsert()
  async created() {
    this.Created = new Date();
  }

  @Column({ type: 'datetime', nullable: false })
  StartDate: Date;

  @Column({ type: 'datetime', nullable: false })
  EndDate: Date;

  @Column({ type: 'nvarchar', nullable: false })
  ThumnailSmartphoneUrl: string;

  @Column({ type: 'nvarchar', nullable: false })
  ImageSmartphoneUrl: string;

  @Column({ type: 'nvarchar', nullable: false })
  ImageTabletUrl: string;

  @Column({ type: 'nvarchar', nullable: false })
  Title: string;

  @Column({ type: 'nvarchar', nullable: false })
  Content: string;

  @Column({ type: 'datetime', nullable: false })
  Modified: Date;
  @BeforeInsert()
  @BeforeUpdate()
  async updated() {
    this.Modified = new Date();
  }

  @Column({ type: 'int', nullable: false })
  Type: number;

  @Column({ type: 'datetime', nullable: false })
  Status: number;
}
