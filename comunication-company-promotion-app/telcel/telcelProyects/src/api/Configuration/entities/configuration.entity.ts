import { CONFIGURATION } from 'src/common/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: CONFIGURATION })
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  IdConfiguration: string;

  @Column({ type: 'nvarchar', nullable: false })
  Key: string;

  @Column({ type: 'xml', nullable: false })
  Value: string;
}
