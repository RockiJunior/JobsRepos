import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OLD_USER_PASSWORD } from '../../../common/constants';

@Entity({ name: OLD_USER_PASSWORD })
export class OldUserPassword {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ type: 'nvarchar' })
  PasswordHash: string;

  @Column({ type: 'datetimeoffset', nullable: false })
  CreateDate: Date;
  @BeforeInsert()
  async created() {
    this.CreateDate = new Date();
  }

  @Column({ type: 'nvarchar' })
  UserId: string;
}
