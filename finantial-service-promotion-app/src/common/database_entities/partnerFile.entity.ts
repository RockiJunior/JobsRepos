import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { PARTNER_FILES } from '../constants';
import { Partner } from './partner.entity';

@Entity({ name: PARTNER_FILES })
export class PartnerFile {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => Partner, partner => partner.files)
  partner: Partner;

  @Column({ type: 'varchar', update: true, length: 255, nullable: false })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  path: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rejectedStatus: string;

  fullPath: string;

  @Column({ nullable: false })
  partnerId: number;

  /*  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateFullPath(): void {
    this.fullPath = `${process.env.FILES_HOST}/${this.path}`;
  } */

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  createDateAt() {
    this.createdAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async updateDateAt() {
    this.updatedAt = new Date();
  }
}
