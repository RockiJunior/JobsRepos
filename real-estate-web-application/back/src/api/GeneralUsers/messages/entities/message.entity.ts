import {
	PrimaryGeneratedColumn,
	Entity,
	ManyToOne,
	Column,
	BeforeUpdate,
} from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { Users } from '../../users/entities/user.entity';
import { BeforeInsert } from 'typeorm';

@Entity(EntityNamesGeneralUsers.messages)
export class Message {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'timestamp', nullable: true })
	read_at: Date;

	@Column({ type: 'varchar', length: 1000, nullable: true })
	message: string;

	@Column({ type: 'timestamp', nullable: true })
	answered_on: Date;

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
	@ManyToOne(() => Conversation, (conversation) => conversation.messages)
	public conversation!: Conversation;

	@ManyToOne(() => Users, (user) => user.message)
	public user!: Users;
}
