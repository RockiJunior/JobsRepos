import { SESSIONS } from 'src/common/constants';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './roles.entity';
import { Partner } from './partner.entity';
import { User } from 'src/api/users/entities/user.entity';

@Entity({ name: SESSIONS })
export class Sessions {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 600, nullable: true })
  accessToken: string;

  @Column({ type: 'varchar', length: 600, nullable: true })
  refreshToken: string;

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string;

  @Column({ type: 'varchar', nullable: true })
  recoveryToken: string;

  @Column({ type: 'int', nullable: true })
  attemps: number;

  @Column({ type: 'int', nullable: true })
  blocked: number;

  @OneToOne(() => Partner)
  @JoinColumn()
  partner: Partner;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Roles, roles => roles.session)
  role: Roles;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
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
