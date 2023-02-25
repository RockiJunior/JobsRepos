import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { USER_ANSWER } from '../../../common/constants';

@Entity({ name: USER_ANSWER })
export class UserAnswer {
  @PrimaryGeneratedColumn('uuid')
  IdUserAnswer: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;
  @BeforeInsert()
  async created() {
    this.Created = new Date();
  }

  @Column({ type: 'real', nullable: false })
  Qualification: number;

  @Column({ type: 'real', nullable: false })
  Aproved: number;

  @Column({ type: 'int', nullable: false })
  AprovedStatus: number;

  @Column({ type: 'datetime', nullable: false })
  Start: Date;

  @Column({ type: 'datetime', nullable: false })
  End: Date;

  @Column({ type: 'nvarchar', nullable: false })
  UserId: string;

  @Column({ type: 'nvarchar', nullable: false })
  EventProviderId: string;

  @Column({ type: 'xml', nullable: false })
  Answers: string;
}
