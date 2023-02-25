// Libraries
import {
	PrimaryGeneratedColumn,
	Column,
	BeforeInsert,
	BeforeUpdate,
	Entity,
	OneToMany,
} from 'typeorm';

// Databases, Controllers, Services & Dtos
import { EntityNamesGeneralUsers } from 'src/config/entityNames/entityNames';
import { RoleToUser } from '../../roles/entities/role_user.entity';
import { BranchOfficeToUser } from '../../branch-offices/entities/branch-office-user.entity';
import { UserEnumStatus, TypeOfUser } from '../../../../config/enum-types';
import { Message } from '../../messages/entities/message.entity';

@Entity(`${EntityNamesGeneralUsers.users}`)
export class Users {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	firstName: string;

	@Column({ type: 'varchar', length: 80 })
	lastName: string;

	@Column({ type: 'varchar', length: 80 })
	email: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	password: string;

	@Column({ type: 'varchar', length: 600, nullable: true })
	photo: string;

	@Column({ type: 'varchar', length: 40, nullable: true })
	phoneNumber: string;

	@Column({ type: 'varchar', length: 40 })
	dni: string;

	@Column({ type: 'enum', enum: TypeOfUser, nullable: false })
	typeOfUser: TypeOfUser;

	@Column({ type: 'varchar', length: 255, nullable: true })
	adminUserId: string;

	@Column({
		type: 'enum',
		enum: UserEnumStatus,
		default: UserEnumStatus.pending,
	})
	status: UserEnumStatus;

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

	// ------------------------------ deleted_at
	@Column({ type: 'timestamp', nullable: true })
	deleted_at: Date;

	// ------------------------------ Relations here...

	@OneToMany(() => RoleToUser, (roleToUser) => roleToUser.user)
	public roleToUser!: RoleToUser[];

	@OneToMany(
		() => BranchOfficeToUser,
		(branchOfficeToUser) => branchOfficeToUser.user
	)
	public branchOfficeToUser!: BranchOfficeToUser[];

	@OneToMany(() => Message, (message) => message.user)
	message: Message[];
}
