import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CAMPAING } from '../../../common/constants';
import { CampaingDocument } from './campaingDocument.entity';

@Entity({ name: CAMPAING })
export class Campaing {
  @PrimaryGeneratedColumn('uuid')
  IdCampaing: string;

  @Column({ type: 'nvarchar' })
  CampaingName: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;
  campaingDocument: any;
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

  @OneToMany(
    () => CampaingDocument,
    (campaingDocument: CampaingDocument) => campaingDocument.Campaing,
  )
  CampaingDocument: Array<CampaingDocument>;
}
