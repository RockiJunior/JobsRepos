import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';
import { Users } from '../../users/entities/user.entity';
import { BranchOffice } from './branch-office.entity';

@Entity(`${EntityNamesGeneralUsers.branch_office_user}`)
export class BranchOfficeToUser {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'int', nullable: true })
	role_id: number;

	// ------------------------------ Relations here...
	@ManyToOne(
		() => BranchOffice,
		(branchOffice) => branchOffice.branchOfficeToUser,
	)
	public branchOffice!: BranchOffice;

	@ManyToOne(() => Users, (user) => user.branchOfficeToUser, )
	public user!: Users;
}
