import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EVENT_PROVIDER } from '../../../common/constants';

@Entity({ name: EVENT_PROVIDER })
export class EventProvider {
  @PrimaryGeneratedColumn('uuid')
  IdEventProvider: string;

  @Column({ type: 'nvarchar', nullable: false })
  EventId: string;

  @Column({ type: 'nvarchar', nullable: false })
  ProviderId: string;

  @Column({ type: 'nvarchar' })
  SurveyId: string;

  @Column({ type: 'real', nullable: false })
  Aproved: number;

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
}
