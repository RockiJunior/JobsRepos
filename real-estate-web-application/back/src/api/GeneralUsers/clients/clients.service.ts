import {
	Injectable,
	NotImplementedException,
	NotFoundException,
	UnauthorizedException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Clients } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Invitations } from '../invitations/entities/invitation.entity';
import { MailService } from '../../../mail/mail.service';
import { ClientEnumStatus } from 'src/config/enum-types';
import { hash, compare } from 'bcrypt';
import { LoginClientDto } from './dto/login-client.dto';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { SendVerificationTokenDto } from './dto/send-recovery-password.dto';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { UploadProfileClientPhotoDto } from './dto/profile-client-photo.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
@Injectable()
export class ClientsService {
	constructor(
		@InjectRepository(Clients)
		private readonly clientsRepository: Repository<Clients>,
		@InjectRepository(Invitations)
		private readonly invitationsRepository: Repository<Invitations>,
		private mailService: MailService,
		private jwtService: JwtService
	) {}

	async create(createClientDto: CreateClientDto) {
		let { password, email } = createClientDto;
		const clientFinded = await this.clientsRepository.findOne({
			where: {
				email: email,
			},
		});
		if (clientFinded) {
			throw new NotImplementedException(
				'Ya existe un usuario con este email; el usuario no se ha creado'
			);
		}

		const hashPass = await hash(password, 10);
		const client = this.clientsRepository.create({
			...createClientDto,
			password: hashPass,
			status: ClientEnumStatus.pending,
			photo: null,
		});
		if (!client) {
			throw new NotImplementedException(
				'Hubo un error, el clinte no se ha creado'
			);
		}
		await this.clientsRepository.save(client);
		const clientCreatedFinded = await this.clientsRepository.findOne({
			where: {
				email: client.email,
			},
		});
		const newName = clientCreatedFinded.id;
		fs.mkdir(
			`./uploads/clients/profile-pictures/${newName}`,
			{ recursive: true },
			(err) => {
				if (err) {
					return err;
				}
			}
		);
		return {
			message: 'Usuario creado con ??xito',
		};
	}

	async uploadProfilePhoto(
		photoInController: UploadProfileClientPhotoDto,
		clientId: string
	) {
		try {
			const { photo } = photoInController;
			const client = await this.clientsRepository.findOne({
				where: {
					id: clientId,
				},
			});
			if (!client) {
				throw new NotFoundException(
					'No se ha encontrado el cliente especificado'
				);
			}
			await this.clientsRepository.update(client.id, {
				photo: photo[0].filename,
			});
			const findUpdatedUser = await this.clientsRepository.findOne({
				where: {
					id: client.id,
				},
			});
			const token = this.jwtService.sign({ ...findUpdatedUser });
			return {
				token,
				message: 'Imagen cargada con ??xito',
			};
		} catch (err) {
			return err;
		}
	}

	async updateData(id: string, updateClientDto: UpdateClientDto) {
		let { firstName, lastName, phoneNumber } = updateClientDto;
		const client = await this.clientsRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!client) {
			throw new NotFoundException('No se encontr?? el usuario especificado');
		}
		await this.clientsRepository.update(id, {
			firstName: firstName,
			lastName: lastName,
			phoneNumber: phoneNumber,
		});
		const findUpdatedUser = await this.clientsRepository.findOne({
			where: {
				id: client.id,
			},
		});
		const token = this.jwtService.sign({ ...findUpdatedUser });
		return {
			message: 'Usuario actualizado con ??xito',
			token: token,
		};
	}

	async updatePassword(clientId: string, updatePasswordDto: UpdatePasswordDto) {
		let { newPassword, actualPassword } = updatePasswordDto;
		const clientFounded = await this.clientsRepository.findOne({
			where: {
				id: clientId,
			},
		});
		if (!clientFounded) {
			throw new NotFoundException('No se encontr?? el usuario especificado');
		}
		const checkSamePassword = await compare(
			newPassword,
			clientFounded.password
		);
		if (checkSamePassword) {
			throw new BadRequestException(
				'La contrase??a actual es la misma que la ingresada. Coloque una nueva contrase??a e intente nuevamente'
			);
		}
		const checkpass = await compare(actualPassword, clientFounded.password);
		if (checkpass) {
			const hashPass = await hash(newPassword, 10);
			newPassword = hashPass;
			await this.clientsRepository.update(clientFounded.id, {
				password: newPassword,
				updated_at: new Date(),
			});
			const findUpdatedUser = await this.clientsRepository.findOne({
				where: {
					id: clientFounded.id,
				},
			});
			const token = this.jwtService.sign({ ...findUpdatedUser });
			return {
				message: 'Contrase??a actualizada con ??xito',
				token: token,
			};
		} else {
			throw new BadRequestException(
				'La contrase??a actual es incorrecta. Corrija su contrase??a e intente nuevamente'
			);
		}
	}

	async clientLogin(clientLogin: LoginClientDto) {
		const { password, email } = clientLogin;
		const findClient = await this.clientsRepository.findOne({
			where: {
				email: email,
			},
		});
		if (!findClient) {
			throw new NotFoundException('El email ingresado no existe');
		}
		const checkPass = await compare(password, findClient.password);
		if (!checkPass) {
			throw new UnauthorizedException('Contrase??a incorrecta');
		}
		const token = this.jwtService.sign({
			...findClient,
		});
		return {
			token,
		};
	}

	async sendRecoveryPasswordToken(client: SendVerificationTokenDto) {
		const { email } = client;
		const accessToken = uuidv4();
		const invitationFinded = await this.invitationsRepository.findOne({
			where: {
				email: email,
			},
		});
		if (invitationFinded) {
			throw new NotImplementedException(
				'Email ya enviado. Ingrese a su correo para verificarlo, caso contrario, cont??ctese con soporte'
			);
		}
		const invitationCreated = this.invitationsRepository.create({
			email: email,
			token: accessToken,
			expired_at: new Date(Date.now() + 3600 * 1000 * 24),
		});
		await this.invitationsRepository.save(invitationCreated);
		await this.mailService.sendUserConfirmation(client, accessToken);
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

		const clientFinded = await this.clientsRepository.findOne({
			where: {
				email: invitationFinded.email,
			},
		});
		if (!clientFinded) {
			throw new NotFoundException('No se ha encontrado el email especificado');
		}

		const hashPass = await hash(password, 10);
		const currentDate = new Date();

		if (invitationFinded.expired_at <= currentDate) {
			throw new NotImplementedException(
				'Fecha de invitaci??n expirada, por favor, contacte a soporte'
			);
		}
		await this.invitationsRepository.delete(invitationFinded.id);
		await this.clientsRepository.update(clientFinded.id, {
			password: hashPass,
		});
		return {
			message: 'Contrase??a reestablecida con ??xito',
		};
	}

	async loginFacebookRedirect(user: any) {
		try {
			const { accessToken } = user;
			const clientFinded = await this.clientsRepository.findOne({
				where: {
					email: user.email,
				},
			});
			if (clientFinded) {
				await this.clientsRepository.update(clientFinded.id, {
					accessToken: accessToken,
				});
			} else {
				const clientCreated = this.clientsRepository.create({
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					photo: user.photos,
					accessToken: user.accessToken,
				});
				if (!clientCreated) {
					throw new NotImplementedException(
						'Ha ocurrido un error, no se pudo crear el usuario'
					);
				}
				await this.clientsRepository.save(clientCreated);
			}
			return {
				message: 'User information from google',
				user: user,
			};
		} catch (err) {
			return err;
		}
	}

	async loginGoogleRedirect(user: any) {
		try {
			const { accessToken, photo } = user;
			if (!user) {
				return 'No user from google';
			}
			const clientFinded = await this.clientsRepository.findOne({
				where: {
					email: user.email,
				},
			});
			if (clientFinded) {
				await this.clientsRepository.update(clientFinded.id, {
					accessToken: accessToken,
				});
			} else {
				const clientCreated = this.clientsRepository.create({
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					photo: photo,
					accessToken: user.accessToken,
				});
				if (!clientCreated) {
					throw new NotImplementedException(
						'Ha ocurrido un error, no se pudo crear el usuario'
					);
				}
				await this.clientsRepository.save(clientCreated);
			}
			return {
				message: 'User information from google',
				user: user,
			};
		} catch (err) {
			return err;
		}
	}

	async findClientByAccessToken(accessToken: string) {
		const clientFinded = await this.clientsRepository.findOne({
			where: {
				accessToken: accessToken,
			},
		});
		if (!clientFinded) {
			throw new NotFoundException('No se pudo encontrar el cliente solicitado');
		}
		const token = this.jwtService.sign({
			...clientFinded,
		});
		return {
			token,
		};
	}

	async findAll() {
		const clients = await this.clientsRepository.find();
		if (!clients) {
			throw new NotFoundException('No se encontraron los clientes');
		}
		return clients;
	}

	async findOne(id: string) {
		const client = await this.clientsRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!client) {
			throw new NotFoundException('No se encontr?? el cliente especificado');
		}
		return client;
	}

	async remove(id: string) {
		const client = await this.clientsRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!client) {
			throw new NotFoundException('No se encontr?? el usuario especificado');
		}
		await this.clientsRepository.update(id, {
			status: ClientEnumStatus.disabled,
		});
		return {
			message: 'Usuario eliminado con ??xito',
		};
	}

	async removeProfilePicture(cliendId: string) {
		const clientFinded = await this.clientsRepository.findOne({
			where: {
				id: cliendId,
			},
		});

		await this.clientsRepository.update(clientFinded.id, {
			photo: null,
		});

		fs.rmdirSync(`./uploads/clients/profile-pictures/${cliendId}`, {
			recursive: true,
		});

		const clientUpdatedFinded = await this.clientsRepository.findOne({
			where: {
				id: cliendId,
			},
		});

		const token = this.jwtService.sign({
			...clientUpdatedFinded,
		});

		return {
			token,
			message: 'Imagen eliminada',
		};
	}
}
