// Libraries
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
// Databases, Controllers, Services & Dtos
import { EntityNamesGeneralUsers } from 'src/config/entityNames/entityNames';
import { BranchOffice } from '../../branch-offices/entities/branch-office.entity';
import { Roles } from '../../roles/entities/role.entity';
import { Users } from '../../users/entities/user.entity';

@Entity(`${EntityNamesGeneralUsers.real_estate}`)
export class RealEstate {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 255 })
	name: string;

	// ------------------------------ Relations here...
	@OneToMany(() => Roles, (roles) => roles.realEstate)
	roles: Roles[];

	@OneToMany(() => BranchOffice, (branchOffice) => branchOffice.realEstate)
	branchOffice: BranchOffice[];

	@OneToOne(() => Users)
	@JoinColumn()
	user: Users[];
}
