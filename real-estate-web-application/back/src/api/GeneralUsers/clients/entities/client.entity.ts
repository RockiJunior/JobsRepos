import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';
import { ClientEnumStatus } from '../../../../config/enum-types';
import { Searches } from '../../searches/entities/search.entity';
import { Posts } from '../../posts/entities/post.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity(EntityNamesGeneralUsers.clients)
export class Clients {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	firstName: string;

	@Column({ type: 'varchar', length: 80 })
	lastName: string;

	@Column({ type: 'varchar', length: 80 })
	email: string;

	@Column({ type: 'varchar', length: 600, nullable: true })
	photo: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	password: string;

	@Column({ type: 'varchar', length: 40, nullable: true })
	phoneNumber: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	accessToken: string;

	@Column({ type: 'enum', enum: ClientEnumStatus, nullable: true })
	status: ClientEnumStatus;

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
	@OneToMany(() => Posts, (post) => post.client)
	post: Posts[];

	@OneToMany(() => Searches, (search) => search.client)
	search: Searches[];

	@OneToMany(() => Conversation, (conversation) => conversation.client)
	conversation: Conversation[];
}
