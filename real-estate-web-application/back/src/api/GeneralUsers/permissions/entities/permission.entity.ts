// Libraries
import {
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

// Databases, Controllers, Services & Dtos
import { EntityNamesGeneralUsers } from 'src/config/entityNames/entityNames';
import { Roles } from '../../roles/entities/role.entity';
import { RoleToPermission } from '../../roles/entities/role_permission.entity';

@Entity(`${EntityNamesGeneralUsers.permissions}`)
export class Permissions {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@Column({ type: 'varchar', length: 80 })
	permissionName: string;

	@Column({ type: 'varchar', length: 50, nullable: true })
	permissionGroup: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	permissionDescription: string;

	// ------------------------------ Relations here...
	// @ManyToMany(() => Roles, { cascade: true })
	// public roles!: Roles[];

	@ManyToOne(
		() => RoleToPermission,
		(roleToPermission) => roleToPermission.permission
	)
	public roleToPermission!: RoleToPermission[];
}
