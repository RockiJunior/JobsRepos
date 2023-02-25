import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IMAGE } from '../../../common/constants';

@Entity({ name: IMAGE })
export class Image {
  @PrimaryGeneratedColumn('uuid')
  ImageId: string;

  @Column({ type: 'nvarchar' })
  Title: string;

  @Column({ type: 'nvarchar' })
  Summary: string;

  @Column({ type: 'nvarchar' })
  ImageUrl: string;

  @Column({ type: 'nvarchar' })
  ThumbnailUrl: string;

  @Column({ type: 'nvarchar', nullable: false })
  GalleryId: string;
}
