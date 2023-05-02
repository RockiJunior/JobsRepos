import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Clients } from '../clients/entities/client.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { BranchOffice } from '../branch-offices/entities/branch-office.entity';
import { Users } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { ConversationsService } from '../conversations/conversations.service';
import {
	Property,
	PropertySchema,
} from '../../Properties/properties/schema/property.schema';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Message,
			Clients,
			Conversation,
			BranchOffice,
			Users,
		]),
		MongooseModule.forFeature([
			{ name: Property.name, schema: PropertySchema },
		]),
	],
	controllers: [MessagesController],
	providers: [
		MessagesController,
		MessagesService,
		AuthService,
		ConversationsService,
	],
	exports: [MessagesService],
})
export class MessagesModule {}
