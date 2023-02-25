import { USER_TOKEN } from 'src/common/constants';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: USER_TOKEN })
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ type: 'varchar', nullable: true })
  Token: string;

  @Column({ type: 'varchar' })
  UserId: string;
}
