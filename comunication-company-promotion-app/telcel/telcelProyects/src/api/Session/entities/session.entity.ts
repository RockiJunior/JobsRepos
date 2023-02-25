import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SESSION } from '../../../common/constants';

@Entity({ name: SESSION })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  IdSession: string;

  @Column({ type: 'nvarchar' })
  Device: string;

  @Column({ type: 'nvarchar', nullable: false })
  Token: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;
  @BeforeInsert()
  async created() {
    this.Created = new Date();
  }

  @Column({ type: 'nvarchar', nullable: false })
  UserId: string;

  @Column({ type: 'nvarchar' })
  Platform: string;
}
