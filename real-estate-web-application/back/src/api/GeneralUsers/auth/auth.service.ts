// Libraries
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { TypeOfUser, PermissionEnumList } from '../../../config/enum-types';
// Databases, Controllers, Services & Dtos
@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(Users) private readonly usersRepository: Repository<Users>
	) {}

	async getPermissionsUser(userId: string): Promise<any> {
		// -----------------------------------------------------------------------------------------------
		const user = await this.usersRepository.findOne({
			relations: [
				'roleToUser',
				'roleToUser.role',
				'roleToUser.role.roleToPermission',
				'roleToUser.role.roleToPermission.permission',
			],
			where: {
				id: userId,
			},
		});
		if (user.typeOfUser === TypeOfUser.adminUser) {
			return []; // means all permissions are allowed
		} else if (user.typeOfUser === TypeOfUser.collabUser) {
			const roles = user.roleToUser.map((roleToUser: any) => {
				return roleToUser.role;
			});
			if (roles.length === 0) {
				return [];
			} else {
				const roleToPermission = roles.map((role: any) => {
					return role.roleToPermission;
				});
				const permissions = roleToPermission[0].map((el: any) => {
					return el.permission.permissionName;
				});
				return permissions;
			}
		}
	}

	async checkPermission(
		permissions?: PermissionEnumList,
		permissionToCheck?: string
	) {
		const prueba = [1, 2, 3, 4, 5];
		let permissionPrueba = 3;
		const result = prueba.includes(permissionPrueba);
		console.log(result);
	}
}
