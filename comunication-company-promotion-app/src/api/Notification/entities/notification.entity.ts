import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NOTIFICATION } from '../../../common/constants';

@Entity({ name: NOTIFICATION })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  IdNotification: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;
  @BeforeInsert()
  async created() {
    this.Created = new Date();
  }

  @Column({ type: 'datetime', nullable: false })
  Modified: Date;
  @BeforeInsert()
  @BeforeUpdate()
  async updated() {
    this.Modified = new Date();
  }

  @Column({ type: 'nvarchar' })
  Title: string;

  @Column({ type: 'nvarchar' })
  Description: string;

  @Column({ type: 'nvarchar' })
  Image: string;

  @Column({ type: 'int', nullable: false })
  Priority: number;

  @Column({ type: 'int', nullable: false })
  ShowTimes: number;

  @Column({ type: 'bit', nullable: false })
  Active: boolean;

  @Column({ type: 'int', nullable: false })
  Type: number;
}
