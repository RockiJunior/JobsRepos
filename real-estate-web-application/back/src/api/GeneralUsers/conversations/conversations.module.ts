import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Clients } from '../clients/entities/client.entity';
import {
	Property,
	PropertySchema,
} from '../../Properties/properties/schema/property.schema';
import { Message } from '../messages/entities/message.entity';
import { AuthService } from '../auth/auth.service';
import { Users } from '../users/entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { BranchOffice } from '../branch-offices/entities/branch-office.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Conversation,
			Clients,
			Message,
			Users,
			BranchOffice,
		]),
		MongooseModule.forFeature([
			{ name: Property.name, schema: PropertySchema },
		]),
	],
	controllers: [ConversationsController],
	providers: [ConversationsService, AuthService, JwtStrategy],
	exports: [ConversationsService],
})
export class ConversationsModule {}
