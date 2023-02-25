import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GALLERY } from '../../../common/constants';

@Entity({ name: GALLERY })
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  IdGallery: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;
  @BeforeInsert()
  async created() {
    this.Created = new Date();
  }

  @Column({ type: 'nvarchar' })
  Name: string;

  @Column({ type: 'datetime' })
  ThumbnailUrl: string;
}
