// Libraries
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	NotImplementedException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, Not } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Databases, Controllers, Services & Dtos
import { Users } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { MailService } from 'src/mail/mail.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { Invitations } from '../invitations/entities/invitation.entity';
import { UserEnumStatus } from 'src/config/enum-types';
import { BranchOfficeToUser } from '../branch-offices/entities/branch-office-user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BranchOffice } from '../branch-offices/entities/branch-office.entity';
import { RoleToUser } from '../roles/entities/role_user.entity';
import { Roles } from '../roles/entities/role.entity';
import { ReSendDto } from './dto/reSend-email.dto';
import { RealEstate } from '../real-estate/entities/real-estate.entity';
import { UpdateUserProfileDto } from './dto/update-profile-user-dto';
import { UpdateUserRolesDto } from './dto/update-roles.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { TypeOfUser } from '../../../config/enum-types';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UploadProfileUserPhotoDto } from './dto/profile-user-photo.dto';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import Axios from 'axios';
import { RecoveryPasswordDto } from '../clients/dto/recovery-password.dto';
import { SendVerificationTokenDto } from '../clients/dto/send-recovery-password.dto';
import { UpdateOrCreateDataDto } from './dto/update-or-create-data.dto';
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users) private readonly userRepository: Repository<Users>,
		@InjectRepository(BranchOffice)
		private readonly branchOfficeRepository: Repository<BranchOffice>,
		@InjectRepository(RealEstate)
		private readonly realEstateRepository: Repository<RealEstate>,
		@InjectRepository(Invitations)
		private readonly invitationsRepository: Repository<Invitations>,
		@InjectRepository(BranchOfficeToUser)
		private readonly branchOfficeToUserRepository: Repository<BranchOfficeToUser>,
		@InjectRepository(RoleToUser)
		private readonly roleToUserRepository: Repository<RoleToUser>,
		@InjectRepository(Roles) private readonly roleRepository: Repository<Roles>,
		private jwtService: JwtService,
		private mailService: MailService
	) {}

	async findOne(id: string) {
		const userFounded: any = await this.userRepository.findOne({
			relations: ['roleToUser', 'roleToUser.role'],
			where: {
				id: id,
				typeOfUser: TypeOfUser.collabUser,
				status: Not(UserEnumStatus.deleted),
			},
		});
		if (!userFounded) {
			throw new NotFoundException('No se encontró el usuario especificado');
		}
		const userEdited = { ...userFounded, branchOfficeToUser: [] };

		const branchOfficeToUser: any =
			await this.branchOfficeToUserRepository.find({
				relations: ['branchOffice'],
				where: {
					user: userFounded,
				},
			});
		delete userEdited.password;
		return { ...userFounded, branchOfficeToUser: branchOfficeToUser };
	}

	async getUserPermissionsByRoleId(roleId: number) {
		const role = await this.roleRepository.findOne({
			relations: [
				'roleToPermission',
				'roleToPermission.permission',
				'realEstate',
			],
			where: {
				id: roleId,
			},
		});
		if (!role) {
			throw new NotFoundException('No se encontró el role especificado');
		}
		return role;
	}

	async findAll(user: any) {
		const adminId =
			user.typeOfUser === TypeOfUser.adminUser ? user.id : user.adminUser;
		const findUsers = await this.userRepository.find({
			relations: ['roleToUser', 'roleToUser.role'],
			where: {
				adminUserId: adminId,
				typeOfUser: TypeOfUser.collabUser,
				status: Not(UserEnumStatus.deleted),
			},
		});
		if (!findUsers) {
			throw new NotFoundException('No se encontraron usuarios');
		}
		return findUsers;
	}

	async getUsersByStatus(status: UserEnumStatus) {
		if (status === UserEnumStatus.deleted) {
			throw new BadRequestException(
				'No se puede consultar por el status solicitado'
			);
		}
		const usersByStatus: any = await this.userRepository.find({
			where: {
				status: status,
				typeOfUser: TypeOfUser.collabUser,
			},
			relations: [
				'roleToUser',
				'roleToUser.role',
				'branchOfficeToUser',
				'branchOfficeToUser.branchOffice',
			],
		});
		if (!usersByStatus) {
			throw new NotFoundException(
				'No se encontraron usuarios con el status ingresado'
			);
		}
		return usersByStatus;
	}

	async createAdminUser(createAdminDto: CreateAdminDto, realEstateId: number) {
		let { email, dni, password } = createAdminDto;
		createAdminDto = {
			...createAdminDto,
			status: UserEnumStatus.active,
			typeOfUser: TypeOfUser.adminUser,
		};
		const userEmailFinded = await this.userRepository.findOne({
			where: {
				email: email,
			},
		});
		if (userEmailFinded) {
			throw new NotImplementedException('El email ingresado ya existe');
		}
		const userDniFinded = await this.userRepository.findOne({
			where: {
				dni: dni,
			},
		});
		if (userDniFinded) {
			throw new NotImplementedException('El dni ingresado ya existe');
		}
		const hashPass = await hash(password, 10);
		password = hashPass;

		const userCreated: any = this.userRepository.create({
			...createAdminDto,
			password: password,
			typeOfUser: TypeOfUser.adminUser,
			photo: null,
		});
		if (!userCreated) {
			throw new NotImplementedException(
				'Ha occurrido un error; el usuario administrador no se ha creado'
			);
		}
		const realEstateFinded: any = await this.realEstateRepository.findOne({
			relations: ['user'],
			where: {
				id: realEstateId,
			},
		});
		if (!realEstateFinded) {
			throw new NotFoundException(
				'No se ha encontrado la inmoboliaria especificada'
			);
		}
		await this.userRepository.save(userCreated);
		await this.realEstateRepository.update(realEstateId, {
			user: userCreated,
		});
		return {
			message: 'Usuario administrador creado con éxito',
		};
	}

	async createCollabUser(createUserDto: CreateUserDto, userId: string) {
		const { firstName, lastName, branchOffices, email, dni } = createUserDto;
		const adminUserFinded = await this.userRepository.findOne({
			where: {
				id: userId,
			},
		});
		if (!adminUserFinded) {
			throw new NotFoundException(
				'No se ha encontrado el usuario administrador especificado'
			);
		}
		if (adminUserFinded.typeOfUser === TypeOfUser.adminUser) {
			const userEmailFinded = await this.userRepository.findOne({
				where: {
					email: email,
					typeOfUser: TypeOfUser.collabUser,
				},
			});
			const userDniFinded = await this.userRepository.findOne({
				where: {
					dni: dni,
					typeOfUser: TypeOfUser.collabUser,
				},
			});
			if (
				userEmailFinded &&
				userEmailFinded.email === email &&
				userEmailFinded.id !== userId &&
				userEmailFinded.status !== 'deleted'
			) {
				if (
					userDniFinded &&
					userDniFinded.dni === dni &&
					userDniFinded.id !== userId
				) {
					throw new NotImplementedException(
						'El email y el dni ingresados ya estan en uso.'
					);
				} else {
					throw new NotImplementedException('El email ingresado ya existe');
				}
			}
			if (
				userDniFinded &&
				userDniFinded.dni === dni &&
				userDniFinded.id !== userId
			) {
				throw new NotImplementedException('El dni ingresado ya existe');
			}
			// Creamos una invitacion
			const token = uuidv4();
			const invitationCreated = this.invitationsRepository.create({
				firstName: firstName,
				lastName: lastName,
				email: email,
				token: token,
				created_at: new Date(),
				typeOfUser: TypeOfUser.collabUser,
			});
			await this.invitationsRepository.save(invitationCreated); // guardamos la invitacion
			await this.mailService.sendUserConfirmation(createUserDto, token); // envio el mail de confirmación

			const userCreated: any = this.userRepository.create({
				...createUserDto,
				status: UserEnumStatus.pending,
				typeOfUser: TypeOfUser.collabUser,
				adminUserId: userId,
				photo: null,
			});
			await this.userRepository.save(userCreated);
			const createdUser = await this.userRepository.findOne({
				where: {
					id: userCreated.id,
				},
			});
			if (!createdUser) {
				throw new NotImplementedException('No se pudo crear el usuario');
			}
			if (branchOffices.length > 0) {
				branchOffices.map(async (el: any) => {
					const branchOfficeFinded: any =
						await this.branchOfficeRepository.findOne({
							where: {
								id: el.branchOfficeId,
							},
						});
					if (el.roleId) {
						const roleFinded: any = await this.roleRepository.findOne({
							where: {
								id: el.roleId,
							},
						});
						if (roleFinded) {
							const branchOfficeToUserCreated =
								this.branchOfficeToUserRepository.create({
									role_id: roleFinded.id,
									branchOffice: branchOfficeFinded,
									user: createdUser,
								});
							const roleToUserCreated = this.roleToUserRepository.create({
								branch_office_id: el.branchOfficeId,
								role: roleFinded,
								user: userCreated,
							});
							await this.branchOfficeToUserRepository.save(
								branchOfficeToUserCreated
							);
							await this.roleToUserRepository.save(roleToUserCreated);
						}
					}
				});
			}
			return {
				message: 'Usuario creado con éxito',
				body: {
					firsName: createdUser.firstName,
					lastName: createdUser.lastName,
				},
			};
		} else if (adminUserFinded.typeOfUser === TypeOfUser.collabUser) {
			throw new BadRequestException(
				'No tiene los permisos para crear un administrador'
			);
		}
	}

	async uploadCollabProfilePhoto(
		photoInController: UploadProfileUserPhotoDto,
		userId: string,
		token: string
	) {
		const { photo } = photoInController;
		const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.id === userId) {
			const user = await this.userRepository.findOne({
				where: {
					id: userId,
				},
			});
			if (!user) {
				throw new NotFoundException(
					'No se ha encontrado el usuario especificado'
				);
			}
			const photoPath = photo[0].filename.replace(/^\./, '');
			await this.userRepository.update(user.id, {
				photo: photoPath,
			});
			// 		fs.rmdirSync(`./uploads/clients/profile-pictures/${cliendId}`, {
			// 	recursive: true,
			// });
			return { photo: photoPath };
		} else {
			throw new UnauthorizedException(
				'No puedes editar un perfil de otro usuario'
			);
		}
	}

	async updateRoles(userId: string, updateRolesDto: UpdateUserRolesDto) {
		//  encontrar primero
		let { roleId, branchOfficeId } = updateRolesDto;
		// ---------------------------------------------------------------- FindUser busco el usuario
		const findedUser: any = await this.userRepository.findOne({
			where: {
				id: userId,
			},
		});
		if (!findedUser) {
			throw new NotFoundException(
				'No se pudo encontrar el usuario especificado'
			);
		}
		if (findedUser.typeOfUser === TypeOfUser.adminUser) {
			throw new NotImplementedException(
				'No se puede asignar roles a un usuario administrador'
			);
		}
		// ---------------------------------------------------------------- FindRole el role
		const findedRole: any = await this.roleRepository.findOne({
			where: {
				id: roleId,
			},
		});
		if (!findedRole && roleId !== 0) {
			throw new BadRequestException('No se pudo encontrar el role solicitado');
		}
		// ---------------------------------------------------------------- FindBranchOffice busco la oficina
		const findedBranchOffice: any = await this.branchOfficeRepository.findOne({
			where: {
				id: branchOfficeId,
			},
		});
		if (!findedBranchOffice) {
			throw new BadRequestException(
				'No se pudo encontrar la sucursal solicitada'
			);
		}
		if (roleId !== 0) {
			// busco la oficina del usuario
			const branchOfficeToUserFinded =
				await this.branchOfficeToUserRepository.findOne({
					where: {
						user: findedUser,
						branchOffice: findedBranchOffice,
					},
				});
			if (branchOfficeToUserFinded) {
				await this.branchOfficeToUserRepository.delete(
					branchOfficeToUserFinded.id
				);
				const branchOfficeToUserCreated =
					this.branchOfficeToUserRepository.create({
						role_id: findedRole.id,
						branchOffice: findedBranchOffice,
						user: findedUser,
					});
				await this.branchOfficeToUserRepository.save(branchOfficeToUserCreated);
			} else {
				const branchOfficeToUserCreated =
					this.branchOfficeToUserRepository.create({
						role_id: findedRole.id,
						branchOffice: findedBranchOffice,
						user: findedUser,
					});
				await this.branchOfficeToUserRepository.save(branchOfficeToUserCreated);
			}
			// busco el role del usuario
			const roleToUserFinded = await this.roleToUserRepository.findOne({
				where: {
					user: findedUser,
					branch_office_id: findedBranchOffice.id,
				},
			});
			if (roleToUserFinded) {
				await this.roleToUserRepository.delete(roleToUserFinded.id);
				const roleToUserCreated = this.roleToUserRepository.create({
					branch_office_id: branchOfficeId,
					role: findedRole,
					user: findedUser,
				});
				await this.roleToUserRepository.save(roleToUserCreated);
			} else {
				const roleToUserCreated = this.roleToUserRepository.create({
					branch_office_id: branchOfficeId,
					role: findedRole,
					user: findedUser,
				});
				await this.roleToUserRepository.save(roleToUserCreated);
			}
			return {
				message: 'Usuario actualizado con éxito',
			};
		} else if (roleId === 0) {
			const branchOfficeToUserFinded: any =
				await this.branchOfficeToUserRepository.findOne({
					where: {
						user: findedUser,
						branchOffice: findedBranchOffice,
					},
				});
			if (branchOfficeToUserFinded) {
				await this.branchOfficeToUserRepository.delete(
					branchOfficeToUserFinded.id
				);
			}
			const roleToUserFinded = await this.roleToUserRepository.findOne({
				where: {
					user: findedUser,
					branch_office_id: findedBranchOffice.id,
				},
			});
			if (roleToUserFinded) {
				await this.roleToUserRepository.delete(roleToUserFinded.id);
			}
			return {
				message: 'Usuario actualizado con éxito',
			};
		}
	}

	// para el administrador
	async updateData(userId: string, updateUserDataDto: UpdateUserDataDto) {
		let { firstName, lastName, email, phoneNumber, dni, status } =
			updateUserDataDto;
		const userFounded = await this.userRepository.findOne({
			where: {
				id: userId,
			},
		});
		if (!userFounded) {
			throw new NotFoundException(
				'No se pudo encontrar el usuario especificado'
			);
		}
		const mailFounded = await this.userRepository.findOne({
			where: {
				email: email,
			},
		});
		const dniFounded = await this.userRepository.findOne({
			where: {
				dni: dni,
			},
		});
		if (
			mailFounded &&
			mailFounded.email === email &&
			mailFounded.id !== userId &&
			mailFounded.status !== 'deleted'
		) {
			if (dniFounded && dniFounded.dni === dni && dniFounded.id !== userId) {
				throw new NotImplementedException(
					'El email y el dni ingresados ya estan en uso.'
				);
			} else {
				throw new NotImplementedException('El email ingresado ya existe');
			}
		}
		if (dniFounded && dniFounded.dni === dni && dniFounded.id !== userId) {
			throw new NotImplementedException('El dni ingresado ya existe');
		}
		await this.userRepository.update(userFounded.id, {
			firstName: firstName,
			lastName: lastName,
			email: email,
			phoneNumber: phoneNumber,
			dni: dni,
			updated_at: new Date(),
			status: status,
		});
		return {
			message: 'Usuario actualizado con éxito',
		};
	}

	// para el collab
	async updateProfile(
		userId: string,
		updateUserDto: UpdateUserProfileDto,
		token: string
	) {
		let { phoneNumber, newPassword, actualPassword, email } = updateUserDto;
		const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
		const userFounded: any = await this.userRepository.findOne({
			where: {
				id: userId,
			},
		});
		if (userFounded.id === decoded.id) {
			const userMailRepeated: any = await this.userRepository.findOne({
				where: {
					email: email || userFounded.email,
				},
			});
			if (userFounded.status === UserEnumStatus.deleted) {
				throw new NotImplementedException(
					'No se puede actualizar un usuario que ya ha sido eliminado'
				);
			}
			if (userMailRepeated && userMailRepeated.id !== userId) {
				throw new NotImplementedException('El mail ingresado ya está en uso');
			}
			if (!actualPassword || !newPassword) {
				await this.userRepository.update(userFounded.id, {
					phoneNumber: phoneNumber || userFounded.phoneNumber,
					email: email || userFounded.email,
					updated_at: new Date(),
				});
			} else {
				const checkSamePassword = await compare(
					newPassword,
					userFounded.password
				);
				if (checkSamePassword) {
					throw new BadRequestException(
						'La nueva contraseña debe ser distinta a las anteriores. Corríjalo intente nuevamente'
					);
				} else {
					const checkpass = await compare(actualPassword, userFounded.password);
					if (checkpass) {
						const hashPass = await hash(newPassword, 10);
						newPassword = hashPass;
						await this.userRepository.update(userFounded.id, {
							email: email,
							phoneNumber: phoneNumber,
							password: newPassword,
							updated_at: new Date(),
						});
					} else {
						throw new BadRequestException(
							'La contraseña actual ingresada es incorrecta. Corrija su contraseña e intente nuevamente'
						);
					}
				}
			}
			const userUpdatedFounded = await this.userRepository.findOne({
				relations: [
					'roleToUser',
					'roleToUser.role',
					'roleToUser.role.roleToPermission.permission',
				],
				where: {
					id: userFounded.id,
				},
			});
			let { roleToUser }: any = userUpdatedFounded;
			let branchOfficeToUser: any =
				await this.branchOfficeToUserRepository.find({
					relations: ['branchOffice', 'branchOffice.realEstate'],
					where: {
						user: {
							email: userUpdatedFounded.email,
						},
					},
				});
			if (
				userFounded.typeOfUser === TypeOfUser.collabUser &&
				branchOfficeToUser.length > 0
			) {
				let realEstate: any;
				realEstate = await this.realEstateRepository.findOne({
					where: {
						id: branchOfficeToUser[0].branchOffice.realEstate.id,
					},
				});
				// -------------------------------------------- refactoring result data for frontend
				// -------------------------------------------- roles
				let roles = [];
				roleToUser.forEach(async (el: any) => {
					let role = {
						id: el.role.id,
						branch_office_id: el.branch_office_id,
						permissions: [],
					};
					el.role.roleToPermission.forEach((rtp: any) => {
						role.permissions.push({
							id: rtp.permission.id,
							name: rtp.permission.permissionName,
							group: rtp.permission.permissionGroup,
							key: rtp.permission.key,
							roleToPermissionId: rtp.id,
						});
					});
					roles.push(role);
				});
				// // -------------------------------------------- branchOffices
				let branchOffices = [];
				branchOfficeToUser.map((el: any) => {
					delete el.id;
					delete el.branchOffice.realEstate;
					let branchOffice = {
						id: el.branchOffice.id,
						branch_office_name: el.branchOffice.branch_office_name,
						realEstate: el.branchOffice.realEstate,
					};
					branchOffices.push({ ...branchOffice, role_id: el.role_id });
				});
				delete userUpdatedFounded.roleToUser;
				// -------------------------------------------- transforming to token

				const token = this.jwtService.sign({
					...userUpdatedFounded,
					roles: roles,
					realEstate: realEstate,
					branchOffices: branchOffices,
				});
				return {
					token,
					message: 'Usuario actualizado con éxito',
				};
			} else if (userFounded.typeOfUser === TypeOfUser.adminUser) {
				const adminUser: any = await this.userRepository.findOne({
					where: {
						id: userFounded.id,
					},
				});
				const realEstate = await this.realEstateRepository.findOne({
					relations: ['branchOffice'],
					where: {
						user: adminUser,
					},
				});
				const token = this.jwtService.sign({
					...userUpdatedFounded,
					realEstate,
				});
				return {
					message: 'Usuario actualizado con éxito',
					token,
				};
			} else if (userFounded.typeOfUser === TypeOfUser.collabUser) {
				const adminUser: any = await this.userRepository.findOne({
					where: {
						id: userFounded.adminUserId,
					},
				});
				const realEstate = await this.realEstateRepository.findOne({
					relations: ['branchOffice'],
					where: {
						user: adminUser,
					},
				});
				const token = this.jwtService.sign({
					...userUpdatedFounded,
					roles: [],
					realEstate: realEstate,
					branchOffices: [],
				});
				return {
					token,
					message: 'Usuario actualizado con éxito',
				};
			}
		} else {
			throw new NotImplementedException('No tiene permisos suficientes');
		}
	}

	async verifyUser(validateUserDto: ValidateUserDto) {
		let { token, password } = validateUserDto;

		const invitationFinded = await this.invitationsRepository.findOne({
			where: {
				token: token,
			},
		});
		const currentDate = new Date();

		if (!invitationFinded) {
			throw new NotFoundException(
				'No se pudo encontrar el usuario, o el usuario ya ha sido verificado'
			);
		}
		if (invitationFinded.expired_at <= currentDate) {
			throw new NotImplementedException(
				'Fecha de invitación expirada, por favor, contacte con soporte'
			);
		}
		const userFinded = await this.userRepository.findOne({
			where: {
				email: invitationFinded.email,
				typeOfUser: TypeOfUser.collabUser,
				status: UserEnumStatus.pending,
			},
		});
		if (!userFinded) {
			throw new NotFoundException(
				'No se pudo encontrar el usuario asociado al administrador'
			);
		}
		const hashPass = await hash(password, 10);
		password = hashPass;
		await this.userRepository.update(userFinded.id, {
			status: UserEnumStatus.active,
			password: password,
		});
		await this.invitationsRepository.delete(invitationFinded.id);

		const adminUserFinded = await this.userRepository.findOne({
			where: {
				id: userFinded.adminUserId,
			},
		});
		await this.mailService.sendUserCreatedNotification(
			adminUserFinded,
			userFinded
		);
		return {
			message: 'Usuario verificado correctamente',
		};
	}

	async reSendUserConfirmation(reSendDto: ReSendDto) {
		const { email, dni } = reSendDto;
		const user = await this.userRepository.findOne({
			where: {
				email: email,
				dni: dni,
			},
		});
		if (!user) {
			throw new NotFoundException(
				'No se pudo encontrar el mail o el dni ingresado'
			);
		}
		const invitation = await this.invitationsRepository.findOne({
			where: {
				email: user.email,
			},
		});
		const token = uuidv4();
		await this.invitationsRepository.update(invitation.id, {
			expired_at: new Date(Date.now() + 3600 * 1000 * 24),
			token: token,
		});
		await this.userRepository.update(user.id, {
			status: UserEnumStatus.pending,
		});
		await this.mailService.sendUserConfirmation(user, token);
		return {
			message: 'Reenvio de confirmacion de contraseña realizado con éxito',
		};
	}

	async refreshToken(token: string) {
		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET);
		if (!decodedToken) {
			throw new Error('Token is invalid or has expired');
		}
		const currentTime = Math.floor(Date.now() / 1000);
		const exp = decodedToken['exp'];
		if (exp < currentTime) {
			throw new Error('Token has already expired');
		}
		if (exp - currentTime <= 1800) {
			const newToken = jwt.sign(
				{ ...decodedToken, exp: currentTime + 86400 },
				process.env.JWT_SECRET
			);
			return { newToken };
		}
	}

	async regenerateToken(token: string) {
		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET);
		const { email } = decodedToken;
		let findUser: any = await this.userRepository.findOne({
			relations: [
				'roleToUser',
				'roleToUser.role',
				'roleToUser.role.roleToPermission.permission',
			],
			where: {
				email,
				status: UserEnumStatus.active,
			},
		});
		if (!findUser) {
			throw new NotFoundException(
				'No se ha encontrado el usuario especificado'
			);
		}
		if (findUser.typeOfUser === TypeOfUser.adminUser) {
			const realEstate = await this.realEstateRepository.findOne({
				relations: ['branchOffice'],
				where: {
					user: findUser,
				},
			});
			const token = this.jwtService.sign({
				...findUser,
				realEstate,
			});
			return {
				token,
			};
		} else if (findUser.typeOfUser === TypeOfUser.collabUser) {
			let { roleToUser, adminUser }: any = findUser;
			let branchOfficeToUser: any =
				await this.branchOfficeToUserRepository.find({
					relations: ['branchOffice', 'branchOffice.realEstate'],
					where: {
						user: {
							email: findUser.email,
						},
					},
				});
			let realEstate: any;
			if (branchOfficeToUser.length > 0) {
				realEstate = await this.realEstateRepository.findOne({
					where: {
						id: branchOfficeToUser[0].branchOffice.realEstate.id,
					},
				});
				// -------------------------------------------- refactoring result data for frontend
				// -------------------------------------------- roles
				let roles = [];
				roleToUser.forEach(async (el: any) => {
					let role = {
						id: el.role.id,
						branch_office_id: el.branch_office_id,
						permissions: [],
					};
					el.role.roleToPermission.forEach((rtp: any) => {
						role.permissions.push({
							id: rtp.permission.id,
							name: rtp.permission.permissionName,
							group: rtp.permission.permissionGroup,
							key: rtp.permission.key,
							roleToPermissionId: rtp.id,
						});
					});
					roles.push(role);
				});
				// // -------------------------------------------- branchOffices
				let branchOffices = [];
				branchOfficeToUser.map((el: any) => {
					delete el.id;
					delete el.branchOffice.realEstate;
					let branchOffice = {
						id: el.branchOffice.id,
						branch_office_name: el.branchOffice.branch_office_name,
						realEstate: el.branchOffice.realEstate,
					};
					branchOffices.push({ ...branchOffice, role_id: el.role_id });
				});
				delete findUser.roleToUser;
				// -------------------------------------------- transforming to token
				const token = this.jwtService.sign({
					...findUser,
					roles: roles,
					realEstate: realEstate,
					branchOffices: branchOffices,
				});
				return {
					token,
					// ...findUser,
					// roles: roles,
					// realEstate: realEstate,
					// branchOffices: branchOffices,
				};
			} else {
				const adminUserFound: any = await this.userRepository.findOne({
					where: {
						id: findUser.adminUserId,
					},
				});
				const realEstate = await this.realEstateRepository.findOne({
					relations: ['branchOffice'],
					where: {
						user: adminUserFound,
					},
				});
				// -------------------------------------------- deleting delicated information
				// delete findUser.dni;
				delete findUser.roleToUser;
				// -------------------------------------------- transforming to token
				const token = this.jwtService.sign({
					...findUser,
					roles: [],
					branchOffices: [],
					realEstate,
				});
				return {
					token,
				};
			}
		}
	}

	async loginUser(userLogin: LoginUserDto) {
		let { email, password } = userLogin;
		try {
			let findUser: any = await this.userRepository.findOne({
				relations: [
					'roleToUser',
					'roleToUser.role',
					'roleToUser.role.roleToPermission.permission',
				],
				where: {
					email,
					status: UserEnumStatus.active,
				},
			});
			if (!findUser) {
				throw new NotFoundException(
					'El usuario ingresado no se encuentra registrado en CabaProp'
				);
			}
			if (findUser.typeOfUser === TypeOfUser.adminUser) {
				const response = await Axios.post(
					`${process.env.INTRANET_URL}/auth/login_cabaprop`,
					{
						email: email,
						contrasenia: password,
					}
				);
				if (response.status === 200) {
					// busco el usuario de nuevo porque esta en otro scope, y no funciona bien
					const userFounded: any = await this.userRepository.findOne({
						where: {
							id: findUser.id,
						},
					});
					// ---------------------------------------------------------------- Real Estate
					const realEstateFinded: any = await this.realEstateRepository.findOne(
						{
							where: {
								user: userFounded,
							},
						}
					);
					if (!realEstateFinded) {
						throw new NotFoundException(' puta madre');
					}
					// ---------------------------------------------------------------- Branch Office
					const branchOfficesFinded: any =
						await this.branchOfficeRepository.find({
							where: {
								realEstate: realEstateFinded,
							},
						});
					// ---------------------------------------------------------------- TOKEN
					const newToken = this.jwtService.sign({
						...findUser,
						realEstate: realEstateFinded,
						branchOffices: branchOfficesFinded,
					});
					return {
						token: newToken,
					};
				} else if (response.status === 400 || response.status === 401) {
					throw new UnauthorizedException(
						'El usuario no se encuentra habilitado para trabajar'
					);
				}
			} else if (findUser.typeOfUser === TypeOfUser.collabUser) {
				let { roleToUser }: any = findUser;
				if (!findUser.password) {
					throw new BadRequestException(
						'El usuario aun no ha sido verificado. Verifíquelo e intente nuevamente'
					);
				}
				let branchOfficeToUser: any =
					await this.branchOfficeToUserRepository.find({
						relations: ['branchOffice', 'branchOffice.realEstate'],
						where: {
							user: {
								email: findUser.email,
							},
						},
					});
				let realEstate: any;
				if (branchOfficeToUser.length > 0) {
					const checkPass = await compare(password, findUser.password);
					if (!checkPass) {
						throw new UnauthorizedException('Contraseña incorrecta');
					}
					realEstate = await this.realEstateRepository.findOne({
						where: {
							id: branchOfficeToUser[0].branchOffice.realEstate.id,
						},
					});
					// -------------------------------------------- roles
					let roles = [];
					roleToUser.forEach(async (el: any) => {
						let role = {
							id: el.role.id,
							branch_office_id: el.branch_office_id,
							permissions: [],
						};
						el.role.roleToPermission.forEach((rtp: any) => {
							role.permissions.push({
								id: rtp.permission.id,
								name: rtp.permission.permissionName,
								group: rtp.permission.permissionGroup,
								key: rtp.permission.key,
								roleToPermissionId: rtp.id,
							});
						});
						roles.push(role);
					});
					// // -------------------------------------------- branchOffices
					let branchOffices = [];
					branchOfficeToUser.map((el: any) => {
						delete el.id;
						delete el.branchOffice.realEstate;
						let branchOffice = {
							id: el.branchOffice.id,
							branch_office_name: el.branchOffice.branch_office_name,
							realEstate: el.branchOffice.realEstate,
						};
						branchOffices.push({ ...branchOffice, role_id: el.role_id });
					});
					delete findUser.roleToUser;
					// ---------------------------------------------------------------- TOKEN
					const token = this.jwtService.sign({
						...findUser,
						roles: roles,
						realEstate: realEstate,
						branchOffices: branchOffices,
					});
					return {
						token,
					};
				} else {
					const checkPass = await compare(password, findUser.password);
					if (!checkPass) {
						throw new UnauthorizedException('Contraseña incorrecta');
					}
					const adminUserFound: any = await this.userRepository.findOne({
						where: {
							id: findUser.adminUserId,
						},
					});
					const realEstate = await this.realEstateRepository.findOne({
						relations: ['branchOffice'],
						where: {
							user: adminUserFound,
						},
					});
					delete findUser.roleToUser;
					// ---------------------------------------------------------------- TOKEN
					const token = this.jwtService.sign({
						...findUser,
						roles: [],
						branchOffices: [],
						realEstate,
					});
					return {
						token,
					};
				}
			}
		} catch (error) {
			throw new UnauthorizedException('No autorizado');
		}
	}

	async loginLocalUser(userLogin: LoginUserDto) {
		let { email, password } = userLogin;
		try {
			let findUser: any = await this.userRepository.findOne({
				relations: [
					'roleToUser',
					'roleToUser.role',
					'roleToUser.role.roleToPermission.permission',
				],
				where: {
					email,
					status: UserEnumStatus.active,
				},
			});
			if (!findUser) {
				// creo
				const response = await Axios.post(
					`${process.env.INTRANET_URL}/auth/login_cabaprop`,
					{
						email: email,
						contrasenia: password,
					}
				);
				if (response.status === 200) {
					const token = response.data.response;
					const decoded: any = jwt.verify(
						token,
						process.env.INTRANET_JWT_SECRET
					);
					let {
						nombre,
						apellido,
						nombreFantasia,
						celularParticular,
						telefonoParticular,
						telefonoComercial,
						domicilioReal,
						domicilioLegal,
						dni,
						matricula,
					} = decoded.usuario;
					let { sucursales } = decoded;
					if (!nombreFantasia) {
						nombreFantasia = `${apellido}`;
					}
					// ---------------------------------------------------------------- User
					const hashPass = await hash(password, 10);
					password = hashPass;
					const userCreated: any = this.userRepository.create({
						firstName: nombre,
						lastName: apellido,
						email: email,
						photo: null,
						fixNumber: telefonoParticular,
						phoneNumber: celularParticular,
						dni: dni,
						realAddress: domicilioReal,
						legalAddress: domicilioLegal,
						typeOfUser: TypeOfUser.adminUser,
						adminUserId: null,
						status: UserEnumStatus.active,
						registration: matricula,
						created_at: new Date(),
						updated_at: new Date(),
						deleted_at: null,
					});
					await this.userRepository.save(userCreated);
					// ---------------------------------------------------------------- Real Estate
					const realEstateCreated: any = this.realEstateRepository.create({
						name: `Inmobiliaria ${apellido} ${sucursales[0].domicilio}`,
						description: null,
						logo: null,
						// website: null,
						user: userCreated,
					});
					await this.realEstateRepository.save(realEstateCreated);
					// ---------------------------------------------------------------- Branch Office
					sucursales.forEach(async (brOf: any, index: number) => {
						const branchOfficeCreated = this.branchOfficeRepository.create({
							branch_office_name: !index
								? `Casa Central ${nombreFantasia}`
								: `Sucursal ${nombreFantasia} Nro ${index}`,
							isCentral: index === 0 ? true : false,
							isActive: true,
							address: brOf.domicilio,
							phoneNumber: brOf.telefono,
							openingHours: '',
							realEstate: realEstateCreated,
						});
						if (branchOfficeCreated) {
							await this.branchOfficeRepository.save(branchOfficeCreated);
						}
					});
					// ---------------------------------------------------------------- TOKEN
					const userFinded = await this.userRepository.findOne({
						relations: [
							'roleToUser',
							'roleToUser.role',
							'roleToUser.role.roleToPermission.permission',
						],
						where: {
							id: userCreated.id,
						},
					});
					const branchOfficesFinded: any =
						await this.branchOfficeRepository.find({
							where: {
								realEstate: realEstateCreated,
							},
						});
					const newToken = this.jwtService.sign({
						...userFinded,
						realEstate: realEstateCreated,
						branchOffices: branchOfficesFinded,
					});
					return {
						token: newToken,
					};
				} else if (response.status === 400 || response.status === 401) {
					throw new UnauthorizedException(
						'El usuario no esta habilitado para trabajar'
					);
				}
			} else {
				// actualizo
				if (findUser.typeOfUser === TypeOfUser.adminUser) {
					const response = await Axios.post(
						`${process.env.INTRANET_URL}/auth/login_cabaprop`,
						{
							email: email,
							contrasenia: password,
						}
					);
					if (response.status === 200) {
						const token = response.data.response;
						const decoded: any = jwt.verify(
							token,
							process.env.INTRANET_JWT_SECRET
						);
						let { sucursales, usuario } = decoded;
						let {
							nombre,
							apellido,
							celularParticular,
							telefonoParticular,
							telefonoComercial,
							nombreFantasia,
							domicilioReal,
							domicilioLegal,
							dni,
							matricula,
						} = usuario;
						if (!nombreFantasia) {
							nombreFantasia = `${apellido}`;
						}
						// ---------------------------------------------------------------- User
						await this.userRepository.update(findUser.id, {
							firstName: nombre,
							lastName: apellido,
							fixNumber: telefonoParticular,
							phoneNumber: celularParticular,
							dni: dni,
							realAddress: domicilioReal,
							legalAddress: domicilioLegal,
							registration: matricula,
							updated_at: new Date(),
							deleted_at: null,
						});
						const userUpdated: any = await this.userRepository.findOne({
							where: {
								id: findUser.id,
							},
						});
						// ---------------------------------------------------------------- Real Estate
						const realEstateFinded: any =
							await this.realEstateRepository.findOne({
								where: {
									user: userUpdated,
								},
							});
						await this.realEstateRepository.update(realEstateFinded.id, {
							name: `Inmobiliaria ${apellido} ${sucursales[0].domicilio}`, // => checkear esto, si esta bien
						});
						const realEstateUpdated: any =
							await this.realEstateRepository.findOne({
								where: {
									id: realEstateFinded.id,
								},
							});
						// ---------------------------------------------------------------- Branch Office
						const branchOffices: any = await this.branchOfficeRepository.find({
							where: {
								realEstate: realEstateFinded,
								isCentral: false,
							},
						});
						//  primero verifico si alguna de las sucursales en mi base de datos no existe en sucursales
						//  si no es asi, updateo isActive en false para esas sucursales en mi base de datos
						for (const branchOffice of branchOffices) {
							const sucursal = sucursales.find(
								(s: any) => s.domicilio === branchOffice.address
							);
							if (!sucursal) {
								await this.branchOfficeRepository.update(branchOffice.id, {
									isActive: false,
								});
							}
						}
						for (const [index, sucursal] of sucursales.entries()) {
							// luego busca una sucursal existente en la base de datos con la misma direccion
							const branchOffice = await this.branchOfficeRepository.findOne({
								where: {
									address: sucursal.domicilio,
								},
							});
							// si existe una sucursal en la base de datos con la misma direccion, actualiza el registro existente
							if (branchOffice) {
								await this.branchOfficeRepository.update(branchOffice.id, {
									isActive: true,
								});
							} else {
								// si no existe una sucursal en la base de datos con la misma direccion, crea un nuevo registro
								const branchOfficeCreated = this.branchOfficeRepository.create({
									branch_office_name: `Sucursal ${nombreFantasia} Nro ${
										index + 1
									}`,
									isCentral: false,
									isActive: true,
									address: sucursal.domicilio,
									phoneNumber: sucursal.telefono,
									openingHours: '',
									realEstate: realEstateUpdated.id,
								});
								await this.branchOfficeRepository.save(branchOfficeCreated);
							}
						}
						const branchOfficesFinded: any =
							await this.branchOfficeRepository.find({
								where: {
									realEstate: realEstateFinded,
								},
							});
						// ---------------------------------------------------------------- TOKEN
						const newToken = this.jwtService.sign({
							...findUser,
							realEstate: realEstateFinded,
							branchOffices: branchOfficesFinded,
						});
						return {
							token: newToken,
						};
					} else if (response.status === 400 || response.status === 401) {
						throw new UnauthorizedException(
							'El usuario no esta habilitado para trabajar'
						);
					}
				} else if (findUser.typeOfUser === TypeOfUser.collabUser) {
					let { roleToUser }: any = findUser;
					if (!findUser.password) {
						throw new BadRequestException(
							'El usuario aun no ha sido verificado. Verifíquelo e intente nuevamente'
						);
					}
					let branchOfficeToUser: any =
						await this.branchOfficeToUserRepository.find({
							relations: ['branchOffice', 'branchOffice.realEstate'],
							where: {
								user: {
									email: findUser.email,
								},
							},
						});
					let realEstate: any;
					if (branchOfficeToUser.length > 0) {
						const checkPass = await compare(password, findUser.password);
						if (!checkPass) {
							throw new UnauthorizedException('Contraseña incorrecta');
						}
						realEstate = await this.realEstateRepository.findOne({
							where: {
								id: branchOfficeToUser[0].branchOffice.realEstate.id,
							},
						});
						// -------------------------------------------- roles
						let roles = [];
						roleToUser.forEach(async (el: any) => {
							let role = {
								id: el.role.id,
								branch_office_id: el.branch_office_id,
								permissions: [],
							};
							el.role.roleToPermission.forEach((rtp: any) => {
								role.permissions.push({
									id: rtp.permission.id,
									name: rtp.permission.permissionName,
									group: rtp.permission.permissionGroup,
									key: rtp.permission.key,
									roleToPermissionId: rtp.id,
								});
							});
							roles.push(role);
						});
						// // -------------------------------------------- branchOffices
						let branchOffices = [];
						branchOfficeToUser.map((el: any) => {
							delete el.id;
							delete el.branchOffice.realEstate;
							let branchOffice = {
								id: el.branchOffice.id,
								branch_office_name: el.branchOffice.branch_office_name,
								realEstate: el.branchOffice.realEstate,
							};
							branchOffices.push({ ...branchOffice, role_id: el.role_id });
						});
						delete findUser.roleToUser;
						// ---------------------------------------------------------------- TOKEN
						const token = this.jwtService.sign({
							...findUser,
							roles: roles,
							realEstate: realEstate,
							branchOffices: branchOffices,
						});
						return {
							token,
						};
					} else {
						const checkPass = await compare(password, findUser.password);
						if (!checkPass) {
							throw new UnauthorizedException('Contraseña incorrecta');
						}
						const adminUserFound: any = await this.userRepository.findOne({
							where: {
								id: findUser.adminUserId,
							},
						});
						const realEstate = await this.realEstateRepository.findOne({
							relations: ['branchOffice'],
							where: {
								user: adminUserFound,
							},
						});
						delete findUser.roleToUser;
						// ---------------------------------------------------------------- TOKEN
						const token = this.jwtService.sign({
							...findUser,
							roles: [],
							branchOffices: [],
							realEstate,
						});
						return {
							token,
						};
					}
				}
			}
		} catch (err) {
			throw new UnauthorizedException('No autorizado');
		}
	}

	async reActivateUser(userId: string) {
		await this.userRepository.update(userId, {
			status: UserEnumStatus.active,
			deleted_at: null,
		});
		return {
			message: 'Usuario reactivado con éxito',
		};
	}

	async remove(id: string) {
		const user = await this.userRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!user) {
			throw new NotFoundException('No se encontró el usuario especificado');
		}
		await this.userRepository.update(user.id, {
			deleted_at: new Date(),
			status: UserEnumStatus.deleted,
		});
		return {
			message: 'Usuario eliminado con éxito',
		};
	}

	async removePhoto(userId: string) {
		const user = await this.userRepository.findOne({
			where: {
				id: userId,
			},
		});

		await this.userRepository.update(user.id, {
			photo: null,
		});

		fs.rmdirSync(`./uploads/users/profile-pictures/${userId}`, {
			recursive: true,
		});

		const token = this.jwtService.sign({
			...user,
		});

		return {
			token,
			message: 'Imagen eliminada',
		};
	}

	async sendRecoveryPasswordToken(collab: SendVerificationTokenDto) {
		const { email } = collab;
		const userFinded = await this.userRepository.findOne({
			where: {
				email,
				status: UserEnumStatus.active,
			},
		});
		if (!userFinded) {
			throw new NotFoundException(
				'El email ingresado no exíste o el usuario está deshabilitado'
			);
		}
		const accessToken = uuidv4();
		const invitationFinded = await this.invitationsRepository.findOne({
			where: {
				email: email,
			},
		});
		if (invitationFinded) {
			throw new NotImplementedException(
				'Este usuario ya solicitó un mail de reestablecimiento. Por favor, revise su casilla de correos. Si el problema persiste, contacte a soporte.'
			);
		}
		const invitationCreated = this.invitationsRepository.create({
			email: email,
			token: accessToken,
			expired_at: new Date(Date.now() + 3600 * 1000 * 24),
			typeOfUser: TypeOfUser.collabUser,
		});
		await this.invitationsRepository.save(invitationCreated);
		await this.mailService.sendUserRecovery(userFinded, accessToken);
	}

	async recoveryPassword(recoveryPasswordDto: RecoveryPasswordDto) {
		const { recoveryToken, password } = recoveryPasswordDto;
		const invitationFinded = await this.invitationsRepository.findOne({
			where: {
				token: recoveryToken,
			},
		});
		if (!invitationFinded) {
			throw new NotFoundException(
				'No se ha encontrado la invitacion. Si el problema persiste, comuniquese con soporte'
			);
		}
		const collabFinded = await this.userRepository.findOne({
			where: {
				email: invitationFinded.email,
				status: UserEnumStatus.active,
			},
		});
		if (!collabFinded) {
			throw new NotFoundException('No se ha encontrado el email especificado');
		}

		const hashPass = await hash(password, 10);
		const currentDate = new Date();

		if (invitationFinded.expired_at <= currentDate) {
			await this.invitationsRepository.delete(invitationFinded.id);
			throw new NotImplementedException(
				'El enlace de recuperación ha caducado. Por favor, realizá nuevamente el proceso desde el comienzo'
			);
		}
		await this.invitationsRepository.delete(invitationFinded.id);
		await this.userRepository.update(collabFinded.id, {
			password: hashPass,
		});
		return {
			message: 'Contraseña reestablecida con éxito',
		};
	}

	async updateOrCreateAdminData(updateOrCreateDto: UpdateOrCreateDataDto) {
		let {
			email,
			nombre,
			apellido,
			nombreFantasia,
			celularParticular,
			telefonoParticular,
			telefonoComercial,
			domicilioReal,
			domicilioLegal,
			dni,
			matricula,
			sucursales,
		} = updateOrCreateDto;
		if (!nombreFantasia) {
			nombreFantasia = `${apellido}`;
		}
		try {
			let findUser: any = await this.userRepository.findOne({
				relations: [
					'roleToUser',
					'roleToUser.role',
					'roleToUser.role.roleToPermission.permission',
				],
				where: {
					email,
					status: UserEnumStatus.active,
				},
			});
			if (!findUser) {
				// creo
				// ---------------------------------------------------------------- User
				const userCreated: any = this.userRepository.create({
					firstName: nombre,
					lastName: apellido,
					email: email,
					photo: null,
					fixNumber: telefonoParticular,
					phoneNumber: celularParticular,
					dni: dni,
					realAddress: domicilioReal,
					legalAddress: domicilioLegal,
					typeOfUser: TypeOfUser.adminUser,
					adminUserId: null,
					status: UserEnumStatus.active,
					registration: matricula,
					created_at: new Date(),
					updated_at: new Date(),
					deleted_at: null,
				});
				await this.userRepository.save(userCreated);
				// ---------------------------------------------------------------- Real Estate
				const realEstateCreated: any = this.realEstateRepository.create({
					name: `Inmobiliaria ${apellido} ${sucursales[0].domicilio}`,
					description: null,
					logo: null,
					// website: null,
					user: userCreated,
				});
				await this.realEstateRepository.save(realEstateCreated);
				// ---------------------------------------------------------------- Branch Office
				sucursales.forEach(async (brOf: any, index: number) => {
					const branchOfficeCreated = this.branchOfficeRepository.create({
						branch_office_name: !index
							? `Casa Central ${nombreFantasia}`
							: `Sucursal ${nombreFantasia} Nro ${index}`,
						isCentral: index === 0 ? true : false,
						isActive: true,
						address: brOf.domicilio,
						phoneNumber: brOf.telefono,
						openingHours: '',
						realEstate: realEstateCreated,
					});
					if (branchOfficeCreated) {
						await this.branchOfficeRepository.save(branchOfficeCreated);
					}
				});
				return {
					message: 'Usuario exitosamente cargado en CabaProp',
				};
			} else {
				// actualizo
				// ---------------------------------------------------------------- User
				await this.userRepository.update(findUser.id, {
					firstName: nombre,
					lastName: apellido,
					fixNumber: telefonoParticular,
					phoneNumber: celularParticular,
					dni: dni,
					realAddress: domicilioReal,
					legalAddress: domicilioLegal,
					registration: matricula,
					updated_at: new Date(),
					deleted_at: null,
				});
				const userUpdated: any = await this.userRepository.findOne({
					where: {
						id: findUser.id,
					},
				});
				// ---------------------------------------------------------------- Real Estate
				const realEstateFinded: any = await this.realEstateRepository.findOne({
					where: {
						user: userUpdated,
					},
				});
				await this.realEstateRepository.update(realEstateFinded.id, {
					name: `Inmobiliaria ${apellido} ${sucursales[0].domicilio}`, // => checkear esto, si esta bien
				});
				const realEstateUpdated: any = await this.realEstateRepository.findOne({
					where: {
						id: realEstateFinded.id,
					},
				});
				// ---------------------------------------------------------------- Branch Office
				const branchOffices: any = await this.branchOfficeRepository.find({
					where: {
						realEstate: realEstateFinded,
						isCentral: false,
					},
				});
				//  primero verifico si alguna de las sucursales en mi base de datos no existe en sucursales
				//  si no es asi, updateo isActive en false para esas sucursales en mi base de datos
				for (const branchOffice of branchOffices) {
					const sucursal = sucursales.find(
						(s: any) => s.domicilio === branchOffice.address
					);
					if (!sucursal) {
						await this.branchOfficeRepository.update(branchOffice.id, {
							isActive: false,
						});
					}
				}
				for (const [index, sucursal] of sucursales.entries()) {
					// luego busca una sucursal existente en la base de datos con la misma direccion
					const branchOffice = await this.branchOfficeRepository.findOne({
						where: {
							address: sucursal.domicilio,
						},
					});
					// si existe una sucursal en la base de datos con la misma direccion, actualiza el registro existente
					if (branchOffice) {
						await this.branchOfficeRepository.update(branchOffice.id, {
							isActive: true,
						});
					} else {
						// si no existe una sucursal en la base de datos con la misma direccion, crea un nuevo registro
						const branchOfficeCreated = this.branchOfficeRepository.create({
							branch_office_name: `Sucursal ${nombreFantasia} Nro ${index + 1}`,
							isCentral: false,
							isActive: true,
							address: sucursal.domicilio,
							phoneNumber: sucursal.telefono,
							openingHours: '',
							realEstate: realEstateUpdated.id,
						});
						await this.branchOfficeRepository.save(branchOfficeCreated);
					}
				}
				return {
					message: 'Usuario actualizado exitosamente en CabaProp',
				};
			}
		} catch (error) {
			throw new UnauthorizedException('No authorizado');
		}
	}
}
