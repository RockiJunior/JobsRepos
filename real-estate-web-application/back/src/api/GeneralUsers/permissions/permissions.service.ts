// Libraries
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Databases, Controllers, Services & Dtos
import { Permissions } from './entities/permission.entity';
import { permissions } from 'src/config/constants';

@Injectable()
export class PermissionsService {
	constructor(
		@InjectRepository(Permissions)
		private readonly permissionRepository: Repository<Permissions>
	) {}
	async findAll() {
		try {
			const properties = await this.permissionRepository.find({
				where: {
					permissionGroup: permissions.PROPERTY,
				},
			});
			const mesaging = await this.permissionRepository.find({
				where: {
					permissionGroup: permissions.MESAGING,
				},
			});

			const users = await this.permissionRepository.find({
				where: {
					permissionGroup: permissions.USERS,
				},
			});

			const roles = await this.permissionRepository.find({
				where: {
					permissionGroup: permissions.ROLES,
				},
			});

			const result = [properties, mesaging, users, roles];
			const response = result.map((el) => {
				return {
					name: el.map((el) => el.permissionGroup)[0],
					permissions: el,
				};
			});
			return response;
		} catch (err) {
			throw new NotFoundException(
				'No se pudieron encontrar los permisos solicitados'
			);
		}
	}
}
