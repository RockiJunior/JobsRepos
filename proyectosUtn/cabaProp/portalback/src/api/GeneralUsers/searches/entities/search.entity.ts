import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';
import { ManyToOne } from 'typeorm';
import { Clients } from '../../clients/entities/client.entity';
import { AlertEnumTypes } from '../../../../config/enum-types';
@Entity(EntityNamesGeneralUsers.searches)
export class Searches {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: true })
	name?: string;

	@Column({ type: 'text', nullable: true, array: true })
	tags: string[];

	@Column({ type: 'varchar', length: 255, nullable: true })
	path?: string;

	// @Column({ type: 'enum', enum: AlertEnumTypes, nullable: true })
	// alert: AlertEnumTypes;

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
	// ------------------------------ Relations here...
	@ManyToOne(() => Clients, (client) => client.search)
	client: Clients;
}
