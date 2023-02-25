import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ARTICLE } from '../../../common/constants';

@Entity({ name: ARTICLE })
export class Article {
  @PrimaryGeneratedColumn('uuid')
  IdArticle: string;

  @Column({ type: 'datetime', nullable: false })
  Created: Date;
  @BeforeInsert()
  async created() {
    this.Created = new Date();
  }

  @Column({ type: 'datetime', nullable: false })
  Modified: Date;
  @BeforeInsert()
  @BeforeUpdate()
  async updated() {
    this.Modified = new Date();
  }

  @Column({ type: 'nvarchar' })
  Title: string;

  @Column({ type: 'nvarchar' })
  Author: string;

  @Column({ type: 'nvarchar' })
  Thumbnail: string;

  @Column({ type: 'nvarchar' })
  ArticleUrl: string;

  @Column({ type: 'nvarchar' })
  Origin: string;

  @Column({ type: 'bit', default: false })
  EvaluationArticle: boolean;

  @Column({ type: 'bit', default: true })
  Status: boolean;

  @Column({ type: 'nvarchar', default: false, nullable: true})
  UserId: string;

  @Column({ type: 'datetime', nullable: true })
  DateCancel: Date;

  @Column({ type: 'time', nullable: false })
  Duration: Date;

  @Column({ type: 'nvarchar', default: false })
  Category: string;
}
