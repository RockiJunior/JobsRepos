// Libraries
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

// Databases, Controllers, Services & Dtos
import { EntityNamesGeneralUsers } from 'src/config/entityNames/entityNames';
import { Permissions } from '../../permissions/entities/permission.entity';
import { RoleToUser } from './role_user.entity';
import { RealEstate } from '../../real-estate/entities/real-estate.entity';
import { RoleToPermission } from './role_permission.entity';

@Entity(`${EntityNamesGeneralUsers.roles}`)
export class Roles {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 100 })
	name: string;

	// ------------------------------ Relations here...
	@OneToMany(() => RoleToUser, (roleToUser) => roleToUser.role)
	public roleToUser!: RoleToUser[];

	@OneToMany(() => RoleToPermission, (roleToPermission) => roleToPermission.role)
	public roleToPermission!: RoleToPermission[];
	
	@ManyToOne(() => RealEstate, (realEstate) => realEstate.roles)
	public realEstate!: RealEstate[];


	// @ManyToMany(() => Permissions, { cascade: true })
	// @JoinTable({ name: 'role_permission' })
	// public permissions!: Permissions[];
}
