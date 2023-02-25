import { APPLICATION_ROLE } from 'src/common/constants';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: APPLICATION_ROLE })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ type: 'nvarchar', nullable: false })
  Name: string;

  //Relations
  @ManyToMany(() => User, (user) => user.Role)
  User: User[];
}
