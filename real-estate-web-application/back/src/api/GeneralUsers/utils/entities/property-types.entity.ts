export class Util {}
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';

@Entity(EntityNamesGeneralUsers.property_types)
export class PropertyTypes {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 50 })
	propertyType: string;
}
