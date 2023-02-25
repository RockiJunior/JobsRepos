import { BadRequestException, NotFoundException } from '@nestjs/common';
export const mockUpRoleExecuter = async (
	repository: any,
	data: any,
	realEstateRepository: any,
	permissionsRepository: any,
	roleToPermissionRepository: any
) => {
	try {
		const realEstateFinded: any = await realEstateRepository.findOne({
			relations: ['user'],
			where: {
				id: data.realEstateId,
			},
		});
		if (!realEstateFinded) {
			throw new NotFoundException(
				'No se pudo encontrar el administrador ingresado'
			);
		}
		if (realEstateFinded) {
			const role: any = repository.create({
				name: data.name,
				realEstate: realEstateFinded.id,
			});
			await repository.save(role);
			const createdRole: any = await repository.findOne({
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
			data.permissionIds.map(async (el) => {
				permission = await permissionsRepository.findOne({
					where: {
						id: el,
					},
				});
				const roleToPermissionCreated: any = roleToPermissionRepository.create({
					permission: permission.id,
					role: createdRole.id,
				});
				await roleToPermissionRepository.save(roleToPermissionCreated);
			});
			return {
				message: 'Rol creado con éxito',
			};
		} else {
			throw new NotFoundException(
				'No se encontró la inmobiliaria con el id especificado'
			);
		}
	} catch (err) {
		return err;
	}
};
