import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';

@Entity(EntityNamesGeneralUsers.antiquity_types)
export class AntiquityTypes {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 50 })
	antiquityType: string;
}
