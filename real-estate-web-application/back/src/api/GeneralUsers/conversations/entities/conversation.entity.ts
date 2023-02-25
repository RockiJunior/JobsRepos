import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
	BeforeUpdate,
} from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';
import { Clients } from '../../clients/entities/client.entity';
import { BranchOffice } from '../../branch-offices/entities/branch-office.entity';
import { Message } from '../../messages/entities/message.entity';
import { BeforeInsert } from 'typeorm';

@Entity(EntityNamesGeneralUsers.conversations)
export class Conversation {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: true })
	propertyId: string;

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

	// ------------------------------ Relations here...
	@ManyToOne(() => Clients, (client) => client.conversation)
	client: Clients;

	@ManyToOne(() => BranchOffice, (branchOffice) => branchOffice.conversation)
	branchOffice: Clients;

	@OneToMany(() => Message, (messages) => messages.conversation)
	messages: Message[];
}
