// Libraries
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOfUser } from '../../../config/enum-types';
import { Clients } from '../clients/entities/client.entity';
import { Users } from '../users/entities/user.entity';

// Databases, Controllers, Services & Dtos
@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>,
		@InjectRepository(Clients)
		private readonly clientsRepository: Repository<Clients>
	) {}

	async getPermissionsUser(userId: string): Promise<any> {
		// -----------------------------------------------------------------------------------------------
		const client = await this.clientsRepository.findOne({
			where: {
				id: userId,
			},
		});
		if (client) {
			return false;
		}

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
		if (user.typeOfUser === TypeOfUser.clientUser) {
			return false;
		}
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
				const permissions = [];
				roleToPermission.map((role: any) => {
					role.map(({ permission }) => {
						if (!permissions.some((perm) => perm.id === permission.id))
							permissions.push(permission.name);
					});
				});
				return permissions;
			}
		}
	}
}
