import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CONTROL_ACCESS_DATES } from '../../../common/constants';

@Entity({ name: CONTROL_ACCESS_DATES })
export class Controlaccessdate {
  @PrimaryGeneratedColumn('increment')
  ControlaccessdatesId: number;

  //   relacion con controlaccess...
  //   @Column({ type: 'nvarchar'})
  //   ControlaccessId: string;

  @Column({ type: 'nvarchar', nullable: false })
  IdDocument: string;

  @Column({ type: 'int', nullable: false })
  Typo: number;

  @Column({ type: 'datetime', nullable: false })
  DateAssignment: Date;

  @Column({ type: 'datetime', nullable: false })
  DateLastAcces: Date;

  @Column({ type: 'bit', nullable: false })
  Approved: boolean;

  @Column({ type: 'datetime' })
  DateApproved: Date;

  @Column({ type: 'bit', nullable: false })
  Active: boolean;

  // creo que acá va una relacion con cursos...
  @Column({ type: 'nvarchar' })
  IdDocumentCourses: string;

  @Column({ type: 'int', nullable: false })
  DaysWithoutConsulting: number;
}
