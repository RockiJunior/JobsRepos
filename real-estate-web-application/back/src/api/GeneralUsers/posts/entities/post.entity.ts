import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';
import { Clients } from '../../clients/entities/client.entity';
@Entity(EntityNamesGeneralUsers.posts)
export class Posts {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 100, nullable: false })
	propertyId: string;

	// ------------------------------ Relations here...
	@ManyToOne(() => Clients, (client) => client.post)
	client: Clients;
}
