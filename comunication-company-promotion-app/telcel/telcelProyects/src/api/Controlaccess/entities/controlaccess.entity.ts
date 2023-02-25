import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CONTROL_ACCESS } from '../../../common/constants';

@Entity({ name: CONTROL_ACCESS })
export class Controlaccess {
  @PrimaryGeneratedColumn('increment')
  ControlaccessId: number;

  //   Relacion con User
  //   @Column({ type: 'nvarchar', nullable: false })
  //   UserId: string;

  @Column({ type: 'nvarchar', nullable: false })
  Hwidn: string;

  @Column({ type: 'nvarchar', nullable: false })
  Push_Token: string;
}
