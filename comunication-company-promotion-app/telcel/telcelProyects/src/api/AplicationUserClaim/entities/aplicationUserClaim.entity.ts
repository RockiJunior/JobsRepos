import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { APPLICATION_USER_CLAIM } from '../../../common/constants';

@Entity({ name: APPLICATION_USER_CLAIM })
export class ApplicationUserClaim {
  @PrimaryGeneratedColumn('increment')
  Id: number;

  @Column({ type: 'nvarchar', nullable: true })
  UserId: string;

  @Column({ type: 'nvarchar', nullable: true })
  ClaimType: string;

  @Column({ type: 'nvarchar', nullable: true })
  ClaimValue: string;

  // @Column({type: 'nvarchar', nullable: true})
  // ApplicationUser_Id
}
