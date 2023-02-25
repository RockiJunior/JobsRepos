import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { APPLICATION_USER_LOGIN } from '../../../common/constants';

@Entity({ name: APPLICATION_USER_LOGIN })
export class ApplicationUserLogin {
  @PrimaryGeneratedColumn('uuid')
  UserId: string;

  @Column({ type: 'nvarchar', nullable: true })
  LoginProvider: string;

  @Column({ type: 'nvarchar', nullable: true })
  ProviderKey: string;

  @Column({ type: 'nvarchar', nullable: true })
  ApplicationUser_id: string;
}
