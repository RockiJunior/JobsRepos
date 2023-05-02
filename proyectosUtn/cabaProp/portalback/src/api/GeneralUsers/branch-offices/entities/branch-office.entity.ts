import { EntityNamesGeneralUsers } from 'src/config/entityNames/entityNames';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	JoinTable,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { BranchOfficeToUser } from './branch-office-user.entity';
import { RealEstate } from '../../real-estate/entities/real-estate.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity(`${EntityNamesGeneralUsers.branch_office}`)
export class BranchOffice {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 255 })
	branch_office_name: string;

	@Column({ type: 'bool', nullable: true })
	isCentral: boolean;

	@Column({ type: 'bool', nullable: true })
	isActive: boolean;

	@Column({ type: 'varchar', length: 40, nullable: true })
	phoneNumber: string;

	@Column({ type: 'varchar', length: 60, nullable: true })
	openingHours: string;

	@Column({ type: 'varchar', length: 80, nullable: true })
	address: string;

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
	@OneToMany(
		() => BranchOfficeToUser,
		(branchOfficeToUser) => branchOfficeToUser.branchOffice
	)
	public branchOfficeToUser!: BranchOfficeToUser[];

	@ManyToOne(() => RealEstate, (realEstate) => realEstate.branchOffice)
	public realEstate!: RealEstate;

	@OneToMany(() => Conversation, (conversation) => conversation.branchOffice)
	conversation: Conversation[];
}
