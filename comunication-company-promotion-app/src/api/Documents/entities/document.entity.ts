import { ENTITY_DOCUMENT } from 'src/common/constants';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CampaingDocument } from '../../Devices/entities/campaingDocument.entity';

@Entity({ name: ENTITY_DOCUMENT })
export class Document {
  @PrimaryGeneratedColumn('uuid')
  IdDocument: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;

  @Column({ type: 'nvarchar' })
  Name: string;

  @Column({ type: 'nvarchar' })
  PdfName: string;

  @Column({ type: 'datetime', nullable: false })
  Modified: Date;

  @Column({ type: 'nvarchar' })
  DocumentUrl: string;

  @Column({ type: 'int', nullable: false })
  Type: number;

  @Column({ type: 'bit', nullable: false })
  Evaluation: boolean;

  @Column({ type: 'bit', nullable: false })
  Status: boolean;

  @Column({ type: 'nvarchar', nullable: true })
  UserId: string;

  @Column({ type: 'datetime' })
  DateCancel: Date;

  //Relations
  @OneToMany(
    () => CampaingDocument,
    (campaingDocument) => campaingDocument.Document,
  )
  CampaingDocument: Array<CampaingDocument>;
}
