import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNamesGeneralUsers } from '../../../../config/entityNames/entityNames';
import { Permissions } from '../../permissions/entities/permission.entity';
import { Roles } from './role.entity';

@Entity(EntityNamesGeneralUsers.role_permission)
export class RoleToPermission {
	@PrimaryGeneratedColumn('identity')
	id: number;

	@ManyToOne(() => Roles, (role) => role.roleToPermission, { cascade: true })
	public role!: Roles;

	@ManyToOne(() => Permissions, (role) => role.roleToPermission, {
		cascade: true,
	})
	public permission!: Permissions;
}
