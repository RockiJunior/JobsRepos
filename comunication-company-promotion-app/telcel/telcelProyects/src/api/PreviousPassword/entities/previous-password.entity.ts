import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PREVIOUS_PASSWORD } from '../../../common/constants';

@Entity({ name: PREVIOUS_PASSWORD })
export class PreviousPassword {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ type: 'nvarchar' })
  UserId: string;

  @Column({ type: 'nvarchar' })
  LastPassword: string;

  @Column({ type: 'nvarchar' })
  ApplicationUser_Id: string;
}
