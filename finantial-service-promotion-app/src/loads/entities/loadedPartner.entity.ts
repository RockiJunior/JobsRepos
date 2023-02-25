import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, BeforeUpdate, BeforeInsert } from 'typeorm';

import { Load } from './load.entity';

@Entity('loaded_partners')
export class LoadedPartner {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => Load, load => load.loadedPartners)
  load: Load;

  @Column({ type: 'varchar', length: 7, nullable: false })
  @Index({ unique: true })
  partnerCode: string;

  @Column({ type: 'varchar', length: 7, nullable: false })
  leaderCode: string;

  @Column({ type: 'int', nullable: false })
  coordinationCode: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  coordinationName: string;

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
