import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';

@Entity(EntityNamesGeneralUsers.currency_types)
export class CurrencyTypes {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 50 })
	currencyType: string;
}
