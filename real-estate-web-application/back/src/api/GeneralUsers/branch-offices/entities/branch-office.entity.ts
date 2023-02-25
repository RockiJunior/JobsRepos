import { EntityNamesGeneralUsers } from 'src/config/entityNames/entityNames';
import {
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
