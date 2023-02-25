import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';

import { LoadedPartner } from './loadedPartner.entity';
import { User } from 'src/api/users/entities/user.entity';

@Entity('loads')
export class Load {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => User, user => user.loads)
  user: User;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'int' })
  acceptedRecords: number;

  @Column({ type: 'int' })
  rejectedRecords: number;

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

  @OneToMany(() => LoadedPartner, loaderPartner => loaderPartner.load, {
    cascade: true,
  })
  loadedPartners: LoadedPartner[];
}
