// Libraries
import {
	BeforeInsert,
	BeforeUpdate,
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

	@Column({ type: 'varchar', length: 600, nullable: true })
	description: string;

	// @Column({ type: 'varchar', length: 40, nullable: true })
	// phoneNumber: string;

	// @Column({ type: 'varchar', length: 80, nullable: true })
	// address: string;

	// @Column({ type: 'varchar', length: 60, nullable: true })
	// website: boolean;

	@Column({ type: 'varchar', length: 600, nullable: true })
	logo: string;

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
	@OneToMany(() => Roles, (roles) => roles.realEstate)
	roles: Roles[];

	@OneToMany(() => BranchOffice, (branchOffice) => branchOffice.realEstate)
	branchOffice: BranchOffice[];

	@OneToOne(() => Users)
	@JoinColumn()
	user: Users[];
}
