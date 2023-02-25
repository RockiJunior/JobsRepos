// Libraries
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Databases, Controllers, Services & Dtos
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './entities/role.entity';
import { Permissions } from '../permissions/entities/permission.entity';
import { RoleToUser } from './entities/role_user.entity';
import { RoleToPermission } from './entities/role_permission.entity';
import { Users } from '../users/entities/user.entity';
import { RealEstate } from '../real-estate/entities/real-estate.entity';
import { BranchOfficeToUser } from '../branch-offices/entities/branch-office-user.entity';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Roles)
		private readonly rolesRepository: Repository<Roles>,
		@InjectRepository(Permissions)
		private readonly permissionRepository: Repository<Permissions>,
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>,
		@InjectRepository(RoleToUser)
		private readonly roleToUserRepository: Repository<RoleToUser>,
		@InjectRepository(RoleToPermission)
		private readonly roleToPermissionRepository: Repository<RoleToPermission>,
		@InjectRepository(RealEstate)
		private readonly realEstateRepository: Repository<RealEstate>,
		@InjectRepository(BranchOfficeToUser)
		private readonly branchOfficeToUserRepository: Repository<BranchOfficeToUser>
	) {}

	async create(createRoleDto: CreateRoleDto, realEstateId: number) {
		const { name } = createRoleDto;
		const realEstateFinded: any = await this.realEstateRepository.findOne({
			relations: ['user'],
			where: {
				id: realEstateId,
			},
		});
		if (!realEstateFinded) {
			throw new NotFoundException(
				'No se pudo encontrar el administrador ingresado'
			);
		}
		const roleFinded = await this.rolesRepository.findOne({
			where: {
				realEstate: realEstateFinded,
				name: name,
			},
		});
		if (roleFinded) {
			throw new NotImplementedException(
				'Ya existe un role con el mismo nombre.'
			);
		}
		if (realEstateFinded) {
			const role: any = this.rolesRepository.create({
				name: createRoleDto.name,
				realEstate: realEstateFinded.id,
			});
			await this.rolesRepository.save(role);
			const createdRole: any = await this.rolesRepository.findOne({
				relations: ['roleToPermission'],
				where: {
					id: role.id,
				},
			});
			if (!createdRole) {
				throw new BadRequestException(
					'No se pudo crear el role solicitado; Algo salió mal'
				);
			}
			let permission: any;
			createRoleDto.permissionIds.map(async (el) => {
				permission = await this.permissionRepository.findOne({
					where: {
						id: el,
					},
				});
				const roleToPermissionCreated: any =
					this.roleToPermissionRepository.create({
						permission: permission.id,
						role: createdRole.id,
					});
				await this.roleToPermissionRepository.save(roleToPermissionCreated);
			});
			return {
				message: 'Rol creado con éxito',
			};
		} else {
			throw new NotFoundException(
				'No se encontró la inmobiliaria con el id especificado'
			);
		}
	}

	async update(realEstateId: number, updateRoleDto: UpdateRoleDto) {
		const { name, roleId } = updateRoleDto;

		const realEstateFinded: any = await this.realEstateRepository.findOne({
			relations: ['user'],
			where: {
				id: realEstateId,
			},
		});
		if (!realEstateFinded) {
			throw new NotFoundException(
				'No se pudo encontrar el administrador ingresado'
			);
		}
		if (realEstateFinded) {
			const roleFinded: any = await this.rolesRepository.findOne({
				relations: ['realEstate'],
				where: {
					id: roleId,
					realEstate: realEstateFinded.id,
				},
			});
			if (!roleFinded) {
				throw new BadRequestException(
					'No se pudo encontrar el role solicitado; Algo salió mal'
				);
			}
			await this.rolesRepository.update(roleFinded.id, {
				name: name,
			});
			try {
				await this.roleToPermissionRepository.delete({ role: roleFinded.id });
				updateRoleDto.permissionIds.forEach(async (el: any) => {
					let permission = await this.permissionRepository.findOne({
						where: {
							id: el,
						},
					});
					let roleToPermissionCreated = this.roleToPermissionRepository.create({
						permission: permission,
						role: roleFinded.id,
					});
					await this.roleToPermissionRepository.save(roleToPermissionCreated);
				});
				return {
					message: 'Rol actualizado con éxito',
				};
			} catch (err) {
				return err;
			}
		} else {
			throw new NotFoundException(
				'No se encontró la inmobiliaria con el id especificado'
			);
		}
	}

	async findAll() {
		const roles = await this.rolesRepository.find({
			relations: [
				'roleToPermission',
				'roleToPermission.permission',
				'realEstate',
			],
		});
		if (!roles) {
			throw new NotFoundException('No se encontraron roles');
		}
		return roles;
	}

	async findOne(id: number) {
		const role = await this.rolesRepository.findOne({
			relations: [
				'roleToPermission',
				'roleToPermission.permission',
				'realEstate',
			],
			where: {
				id: id,
			},
		});
		if (!role) {
			throw new NotFoundException('No se encontró el role especificado');
		}
		return role;
	}

	async remove(id: number) {
		const role: any = await this.rolesRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!role) {
			throw new NotFoundException('No se encontró el Rol especificado');
		}
		const roleToPermissionFinded: any =
			await this.roleToPermissionRepository.find({
				where: {
					role: role,
				},
			});
		if (!roleToPermissionFinded) {
			throw new NotFoundException(
				'No se encontró ninguna relacion de rol a permisos'
			);
		}
		roleToPermissionFinded.map(async (el: any) => {
			await this.roleToPermissionRepository.delete(el);
		});
		const roleToUserFinded = await this.roleToUserRepository.findOne({
			where: {
				role: role,
			},
		});
		if (roleToUserFinded) {
			await this.branchOfficeToUserRepository.delete({
				role_id: role.id,
			});
			await this.roleToUserRepository.delete(roleToUserFinded.id);
		}
		await this.rolesRepository.delete(role.id);
		return {
			message: 'Rol borrado exitosamente',
		};
	}
}
