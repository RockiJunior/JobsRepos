// Libraries
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Databases, Controllers, Services & Dtos
import { EntityNamesGeneralUsers } from 'src/config/entityNames/entityNames';
import { Users } from '../../users/entities/user.entity';
import { Roles } from './role.entity';

@Entity(`${EntityNamesGeneralUsers.user_role}`)
export class RoleToUser {
	@PrimaryGeneratedColumn(`identity`)
	id: number;

	@Column({ type: 'int' })
	branch_office_id: number;

	// ------------------------------ Relations here...
	@ManyToOne(() => Roles, (role) => role.roleToUser, { cascade: true })
	public role!: Roles;

	@ManyToOne(() => Users, (user) => user.roleToUser, { cascade: true })
	public user!: Users;
}
