import {
	Injectable,
	NotFoundException,
	NotImplementedException,
} from '@nestjs/common';
import { CreateClientMessageDto } from './dto/create-client-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '../conversations/entities/conversation.entity';
import {
	Property,
	PropertyDocument,
} from '../../Properties/properties/schema/property.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clients } from '../clients/entities/client.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { BranchOffice } from '../branch-offices/entities/branch-office.entity';
import { Users } from '../users/entities/user.entity';
import { CreateUserMessageDto } from './dto/create-user-message.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@Injectable()
export class MessagesService {
	constructor(
		@InjectModel(Property.name)
		private propertiesSchema: Model<PropertyDocument>,
		@InjectRepository(Message)
		private readonly messageRepository: Repository<Message>,
		@InjectRepository(Conversation)
		private readonly conversationRepository: Repository<Conversation>,
		@InjectRepository(Clients)
		private readonly clientRepository: Repository<Clients>,
		@InjectRepository(BranchOffice)
		private readonly branchOfficeRepository: Repository<BranchOffice>,
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>
	) {}
	async createClientMessage(
		createClientMessageDto: CreateClientMessageDto
		// clientId: string
	) {
		const { branchOfficeId, propertyId, clientId, message, conversationId } =
			createClientMessageDto;
		// ---------------------------------------------------------------------------- Conversation
		const conversation = await this.conversationRepository.findOne({
			where: {
				id: conversationId,
			},
		});
		const branchOfficeFinded: any = await this.branchOfficeRepository.findOne({
			where: {
				id: branchOfficeId,
			},
		});
		if (!branchOfficeFinded) {
			throw new NotFoundException(
				'No se ha encontrado la sucursal especificada'
			);
		}
		const clientFinded: any = await this.clientRepository.findOne({
			where: {
				id: clientId,
			},
		});
		if (!clientFinded) {
			throw new NotFoundException(
				'No se ha encontrado el cliente especificado'
			);
		}
		const propertyFinded: any = await this.propertiesSchema.findOne({
			_id: propertyId,
		});
		if (!propertyFinded) {
			throw new NotFoundException(
				'No se ha encontrado la propiedad especificada'
			);
		}
		if (!conversationId) {
			const conversationCreated = this.conversationRepository.create({
				branchOffice: branchOfficeFinded,
				client: clientFinded,
				propertyId: `${propertyFinded._id}`,
				created_at: new Date(),
				updated_at: new Date(),
			});
			if (!conversationCreated) {
				throw new NotImplementedException(
					'Algo ha salido mal, no se pudo crear la conversacion'
				);
			}
			await this.conversationRepository.save(conversationCreated);
			const conversationFinded: any = await this.conversationRepository.findOne(
				{
					where: {
						id: conversationCreated.id,
					},
				}
			);
			if (!conversationFinded) {
				throw new NotFoundException(
					'No se ha encontrado la conversación especificada'
				);
			}
			// ---------------------------------------------------------------------------- ConversationMessage
			const messageCreated = this.messageRepository.create({
				conversation: conversationFinded,
				message: message,
				updated_at: new Date(),
			});
			if (!messageCreated) {
				throw new NotImplementedException(
					'Algo ha salido mal, no se pudo crear el mensaje'
				);
			}
			await this.messageRepository.save(messageCreated);
			return {
				conversationId: conversationFinded.id,
				message,
			};
		} else {
			const conversationFinded: any = await this.conversationRepository.findOne(
				{
					where: {
						id: conversation.id,
						propertyId: propertyId,
						client: clientFinded,
					},
				}
			);
			if (!conversationFinded) {
				throw new NotFoundException(
					'No se ha encontrado la conversación especificada'
				);
			}
			// ---------------------------------------------------------------------------- ConversationMessage
			const messageCreated = this.messageRepository.create({
				conversation: conversationFinded,
				message: message,
				answered_on: new Date(),
				created_at: new Date(),
				updated_at: new Date(),
			});
			await this.conversationRepository.update(conversationFinded.id, {
				updated_at: new Date(),
			});
			if (!messageCreated) {
				throw new NotImplementedException(
					'Algo ha salido mal, no se pudo crear el mensaje'
				);
			}
			await this.messageRepository.save(messageCreated);
			return {
				conversation: conversationFinded.id,
				message,
			};
		}
	}

	async createUserMessage(createUserMessageDto: CreateUserMessageDto) {
		try {
			const { branchOfficeId, propertyId, userId, message, conversationId } =
				createUserMessageDto;

			// ---------------------------------------------------------------------------- Conversation
			const userFinded = await this.usersRepository.findOne({
				where: {
					id: userId,
				},
			});
			if (!userFinded) {
				throw new NotFoundException(
					'No se ha encontrado el usuario especificado'
				);
			}
			const branchOfficeFinded: any = await this.branchOfficeRepository.findOne(
				{
					where: {
						id: branchOfficeId,
					},
				}
			);
			if (!branchOfficeFinded) {
				throw new NotFoundException(
					'No se ha encontrado la sucursal especificada'
				);
			}
			const propertyFinded: any = await this.propertiesSchema.findOne({
				_id: propertyId,
			});
			if (!propertyFinded) {
				throw new NotFoundException(
					'No se ha encontrado la propiedad especificada'
				);
			}

			const conversationFinded: any = await this.conversationRepository.findOne(
				{
					where: {
						id: conversationId,
					},
				}
			);
			// ---------------------------------------------------------------------------- ConversationMessage
			const messageCreated = this.messageRepository.create({
				conversation: conversationFinded,
				message: message,
				user: userFinded,
				answered_on: new Date(),
				created_at: new Date(),
				updated_at: new Date(),
			});
			if (!messageCreated) {
				throw new NotImplementedException(
					'Algo ha salido mal, no se pudo crear el mensaje'
				);
			}
			await this.conversationRepository.update(conversationFinded.id, {
				updated_at: new Date(),
			});
			await this.messageRepository.save(messageCreated);
			return message;
		} catch (err) {
			return err;
		}
	}

	async findMessagesByConversationId(conversationId: number) {
		const conversationFinded: any = await this.conversationRepository.findOne({
			where: {
				id: conversationId,
			},
			// order: { updated_at: 'DESC', messages: { updated_at: 'ASC' } },
		});
		if (!conversationFinded) {
			throw new NotFoundException(
				'No se ha encontrado la conversación especificada'
			);
		}
		const messages = await this.messageRepository.find({
			order: {
				updated_at: 'ASC',
			},
			relations: ['user'],
			where: {
				conversation: conversationFinded,
			},
		});
		if (messages.length === 0) {
			throw new NotFoundException('No hay mensajes en esta conversacion');
		}
		return messages;
	}

	async updateMessage(messageId: number, updateMessageDto: UpdateMessageDto) {
		const { message } = updateMessageDto;
		const messageFinded = await this.messageRepository.findOne({
			where: {
				id: messageId,
			},
		});
		if (!messageFinded) {
			throw new NotFoundException(
				'No se ha encontrado el mensaje especificado'
			);
		}
		await this.messageRepository.update(messageFinded.id, {
			message: message,
			updated_at: new Date(),
		});
		return {
			message: 'Mensaje actualizado con éxito',
		};
	}

	async updateReadAt(messageId: number) {
		const messageFInded = await this.messageRepository.findOne({
			where: {
				id: messageId,
			},
		});
		if (!messageFInded) {
			throw new NotFoundException('No se encontró el mensaje especificado');
		}
		await this.messageRepository.update(messageFInded.id, {
			read_at: new Date(),
		});
	}

	async remove(messageId: number) {
		try {
			await this.messageRepository.delete(messageId);
			return {
				message: 'Mensaje eliminado con éxito',
			};
		} catch (err) {
			return err;
		}
	}

	async identify(joinRoomDto: JoinRoomDto, clientId: string) {
		// de este lado ya se quien es la persona que esta joineando
		console.log(joinRoomDto, clientId);
		return { joinRoomDto, clientId };
	}

	async getClientName(clientId: string) {
		const client = await this.clientRepository.findOne({
			where: {
				id: clientId,
			},
		});
		if (!client) {
			throw new NotFoundException('No se encontró el usuario especificado');
		}
		return client.firstName + ' ' + client.lastName;
	}
}
