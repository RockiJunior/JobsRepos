import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CAMPAING_DOCUMENT } from '../../../common/constants';
import { Campaing } from './campaing.entity';
import { Document } from '../../Documents/entities/document.entity';
@Entity({
  name: CAMPAING_DOCUMENT,
})
export class CampaingDocument {
  @PrimaryGeneratedColumn('uuid')
  IdCampaingDocument: string;

  @Column({ type: 'nvarchar', nullable: false })
  DocumentId: string;

  @Column({ type: 'nvarchar', nullable: false })
  CampaingId: string;

  @Column({ type: 'bit', nullable: false })
  EvaluationCampaing: boolean;

  @Column({ type: 'bit', nullable: false })
  Status: boolean;

  @Column({ type: 'nvarchar', nullable: true })
  UserId: string;

  @Column({ type: 'datetime', nullable: true })
  DateCancel: Date;

  @ManyToOne(() => Campaing, (campaing: Campaing) => campaing.CampaingDocument)
  @JoinColumn({ name: 'CampaingId' })
  Campaing: Campaing;

  @ManyToOne(() => Document, (document: Document) => document.CampaingDocument)
  @JoinColumn({ name: 'DocumentId' })
  Document: Document;
}
