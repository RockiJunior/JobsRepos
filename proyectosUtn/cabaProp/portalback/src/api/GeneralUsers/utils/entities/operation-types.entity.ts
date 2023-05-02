import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';

@Entity(EntityNamesGeneralUsers.operation_types)
export class OperationTypes {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 50 })
	operationType: string;
}
