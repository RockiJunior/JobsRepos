import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';
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

	// -------------------------------- created_at
	@Column({ type: 'timestamp', nullable: true })
	created_at: Date;
	@BeforeInsert()
	async createDateAt() {
		this.created_at = new Date();
	}

	// -------------------------------- updated_at
	@Column({ type: 'timestamp', nullable: true })
	updated_at: Date;
	@BeforeInsert()
	@BeforeUpdate()
	async updateDateAt() {
		this.updated_at = new Date();
	}
}
