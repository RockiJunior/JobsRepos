import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PROVIDER } from '../../../common/constants';

@Entity({ name: PROVIDER })
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  IdProvider: string;

  @Column({ type: 'nvarchar', nullable: false })
  Name: string;

  @Column({ type: 'nvarchar' })
  ImageUrl: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;
  @BeforeInsert()
  async created() {
    this.Created = new Date();
  }
}
