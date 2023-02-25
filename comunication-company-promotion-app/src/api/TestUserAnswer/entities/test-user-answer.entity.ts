import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TEST_USER_ANSWER } from '../../../common/constants';

@Entity({ name: TEST_USER_ANSWER })
export class TestUserAnswer {
  @PrimaryGeneratedColumn('uuid')
  IdTestUserAnswer: string;

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

  @Column({ type: 'real', nullable: false })
  Start: Date;

  @Column({ type: 'real', nullable: false })
  End: Date;

  @Column({ type: 'nvarchar', nullable: false })
  UserId: string;

  @Column({ type: 'nvarchar', nullable: false })
  SurveyDocumentId: string;

  @Column({ type: 'xml', nullable: false })
  Answers: string;
}
