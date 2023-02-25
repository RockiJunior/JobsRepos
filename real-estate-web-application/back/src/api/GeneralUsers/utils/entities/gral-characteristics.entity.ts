import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';

@Entity(EntityNamesGeneralUsers.gral_characteristics)
export class GralCharacteristics {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 50 })
	name: string;
}
