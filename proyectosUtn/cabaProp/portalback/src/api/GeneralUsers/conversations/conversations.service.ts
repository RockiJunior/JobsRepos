import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from 'src/api/Properties/properties/schema/property.schema';
import { Model } from 'mongoose';
import {
	PropertyDocument,
	PropertySchema,
} from '../../Properties/properties/schema/property.schema';
import { Clients } from '../clients/entities/client.entity';
import { Message } from '../messages/entities/message.entity';
import { BranchOffice } from '../branch-offices/entities/branch-office.entity';

@Injectable()
export class ConversationsService {
	constructor(
		@InjectRepository(Conversation)
		private readonly conversationRepository: Repository<Conversation>,
		@InjectModel(Property.name)
		private propertiesSchema: Model<PropertyDocument>,
		@InjectRepository(Clients)
		private readonly clientRepository: Repository<Clients>,
		@InjectRepository(BranchOffice)
		private readonly branchOfficeRepository: Repository<BranchOffice>
	) {}

	async findConversationsByPropertyId(propertyId: string) {
		const conversations = await this.conversationRepository.find({
			relations: [
				'client',
				'branchOffice',
				'messages',
				'messages.user',
				'messages.conversation',
			],
			where: {
				propertyId: propertyId,
			},
			order: { created_at: 'DESC', messages: { created_at: 'ASC' } },
		});
		return conversations;
	}

	async findConversationsByBranchOfficeId(branchOfficeId: number) {
		const branchOfficeFinded: any = await this.branchOfficeRepository.findOne({
			where: {
				id: branchOfficeId,
			},
		});

		const conversations = await this.conversationRepository.find({
			relations: [
				'client',
				'branchOffice',
				'messages',
				'messages.user',
				'messages.conversation',
			],
			where: {
				branchOffice: branchOfficeFinded,
			},
			order: { created_at: 'DESC', messages: { created_at: 'ASC' } },
		});
		return conversations;
	}

	async findConversationsByClientId(clientId: string) {
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
		const conversations = await this.conversationRepository.find({
			relations: [
				'client',
				'messages',
				'messages.user',
				'messages.conversation',
				'branchOffice',
			],
			where: {
				client: clientFinded,
			},
			order: { updated_at: 'DESC', messages: { created_at: 'ASC' } },
		});
		if (conversations.length === 0) {
			return {
				messages: 'Aún no hay mensajes',
				result: []
			}
		}

		let result = conversations.map(async (el: any) => {
			let property: any = await this.propertiesSchema.findOne({
				_id: el.propertyId,
			});
			return {
				...el,
				property,
			};
		});
		return Promise.all(result);
	}

	async findByConversationId(conversationId: number) {
		const conversation = await this.conversationRepository.findOne({
			relations: [
				'client',
				'messages',
				'messages.user',
				'messages.conversation',
				'branchOffice',
			],
			where: {
				id: conversationId,
			},
			order: { updated_at: 'DESC', messages: { updated_at: 'ASC' } },
		});
		if (!conversation) {
			throw new NotFoundException(
				'No se han encontrado conversaciones sobre la propiedad especificada'
			);
		}
		let property: any = await this.propertiesSchema.findOne({
			_id: conversation.propertyId,
		});
		return { ...conversation, property };
	}

	async findConversationByPropertyAndClientId(
		clientId: string,
		propertyId: string
	) {
		const clientFinded: any = await this.clientRepository.findOne({
			where: {
				id: clientId,
			},
		});
		const conversation = await this.conversationRepository.findOne({
			where: {
				propertyId: propertyId,
				client: clientFinded,
			},
		});
		if (!conversation) {
			return null;
		}
		return conversation;
	}
}
