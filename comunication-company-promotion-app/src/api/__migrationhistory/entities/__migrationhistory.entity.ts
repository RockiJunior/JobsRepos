import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { __MIGRATION_HISTORY } from '../../../common/constants';

@Entity({ name: __MIGRATION_HISTORY })
export class __Migrationhistory {
  @PrimaryGeneratedColumn('identity')
  MigrationId: string;

  @Column({ type: 'nvarchar', nullable: false })
  ContextKey: string;

  @Column({ type: 'varbinary', nullable: false })
  Model: string;

  @Column({ type: 'nvarchar', nullable: false })
  ProductVersion: string;
}
