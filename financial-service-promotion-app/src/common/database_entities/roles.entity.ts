import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EnumApplicationsType, ROLES } from '../constants';
import { Sessions } from './sessions.entity';

@Entity({ name: ROLES })
export class Roles {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @OneToMany(() => Sessions, session => session.role)
  session: Sessions;
}
