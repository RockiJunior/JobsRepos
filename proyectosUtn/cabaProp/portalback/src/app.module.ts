// Libraries
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MulterModule } from '@nestjs/platform-express';
// Controllers, modules, & services
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Other files
import { PropertiesModule } from './api/Properties/properties/properties.module';
import { enviroments } from './config/enviroments';
import config from './config/config';
// Gral Users entities
import { Users } from './api/GeneralUsers/users/entities/user.entity';
import { Permissions } from './api/GeneralUsers/permissions/entities/permission.entity';
import { Roles } from './api/GeneralUsers/roles/entities/role.entity';
// Properties entities
import { MongooseModule } from '@nestjs/mongoose';
import {
	Property,
	PropertySchema,
} from './api/Properties/properties/schema/property.schema';
import { RolesModule } from './api/GeneralUsers/roles/roles.module';
import { PermissionsModule } from './api/GeneralUsers/permissions/permissions.module';
import { UsersModule } from './api/GeneralUsers/users/users.module';
import { AuthModule } from './api/GeneralUsers/auth/auth.module';
import { RealEstateModule } from './api/GeneralUsers/real-estate/real-estate.module';
import { BranchOfficesModule } from './api/GeneralUsers/branch-offices/branch-offices.module';
import { RealEstate } from './api/GeneralUsers/real-estate/entities/real-estate.entity';
import { BranchOffice } from './api/GeneralUsers/branch-offices/entities/branch-office.entity';
import { RoleToUser } from './api/GeneralUsers/roles/entities/role_user.entity';
import { BranchOfficeToUser } from './api/GeneralUsers/branch-offices/entities/branch-office-user.entity';
import { MailModule } from './mail/mail.module';
import { Invitations } from './api/GeneralUsers/invitations/entities/invitation.entity';
import { InvitationsModule } from './api/GeneralUsers/invitations/invitations.module';
import { RoleToPermission } from './api/GeneralUsers/roles/entities/role_permission.entity';
import { UtilsModule } from './api/GeneralUsers/utils/utils.module';
import { PropertyTypes } from './api/GeneralUsers/utils/entities/property-types.entity';
import { OperationTypes } from './api/GeneralUsers/utils/entities/operation-types.entity';
import { AntiquityTypes } from './api/GeneralUsers/utils/entities/antiquity-types.entity';
import { GralCharacteristics } from './api/GeneralUsers/utils/entities/gral-characteristics.entity';
import { CurrencyTypes } from './api/GeneralUsers/utils/entities/currency-types.entity';
import { AmbienceTypes } from './api/GeneralUsers/utils/entities/ambience-types.entity';
import { ClientsModule } from './api/GeneralUsers/clients/clients.module';
import { Clients } from './api/GeneralUsers/clients/entities/client.entity';
import { PostsModule } from './api/GeneralUsers/posts/posts.module';
import { SearchesModule } from './api/GeneralUsers/searches/searches.module';
import { Posts } from './api/GeneralUsers/posts/entities/post.entity';
import { Searches } from './api/GeneralUsers/searches/entities/search.entity';
import { ConversationsModule } from './api/GeneralUsers/conversations/conversations.module';
import { MessagesModule } from './api/GeneralUsers/messages/messages.module';
import { Conversation } from './api/GeneralUsers/conversations/entities/conversation.entity';
import { Message } from './api/GeneralUsers/messages/entities/message.entity';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './config/exceptions/all-exceptions.filter';
import { JWTExceptionFilter } from './config/exceptions/jwt-exception-filter';
import { LoggerEntity } from './api/GeneralUsers/_logger/entities/logger.entity';
import { RequestLoggerMiddleware } from './config/middlewares/request-logger.middleware';
import { CloudinaryModule } from './api/Properties/properties/cloudinary/cloudinary.module';
import { DatabaseService } from './config/logicExecuters/clear-db.service';
import { GoogleMapsModule } from './google-maps/google-maps.module';
import { MockUpModule } from './seeder/mock-up.module';
import { MockUpService } from './seeder/mock-up.service';
import { StatisticsModule } from './api/Properties/statistics/statistics.module';
import {
	Statistics,
	StatisticsSchema,
} from './api/Properties/statistics/schema/statistics.schema';
import { CronService } from './config/crons/cron.service';
import { CronModule } from './config/crons/crons.module';
// Module dependencies
@Module({
	imports: [
		// ------------------------------ Config Modules
		ConfigModule.forRoot({
			envFilePath: enviroments[process.env.NODE_ENV] || '.env',
			load: [config],
			isGlobal: true,
			validationSchema: Joi.object({
				// ------------------------------ GRAL_USERS
				GRAL_USERS_DATABASE_HOST: Joi.string().required(),
				GRAL_USERS_DATABASE_PORT: Joi.string().required(),
				GRAL_USERS_DATABASE_USERNAME: Joi.string().required(),
				GRAL_USERS_DATABASE_NAME: Joi.string().required(),
				GRAL_USERS_DATABASE_PASSWORD: Joi.string().required(),
				// ------------------------------ PROPERTIES
				PROPERTIES_DATABASE_HOST: Joi.string().required(),
				PROPERTIES_DATABASE_PORT: Joi.string().required(),
				PROPERTIES_DATABASE_USERNAME: Joi.string().required(),
				PROPERTIES_DATABASE_NAME: Joi.string().required(),
				PROPERTIES_DATABASE_PASSWORD: Joi.string().required(),
				// EXTERNAL CONNECTIONS & MORE
				SERVER_PORT: Joi.string().required(),
				SOCKET_PORT: Joi.string().required(),
				JWT_SECRET: Joi.string().required(),
				MAILER_HOST: Joi.string().required(),
				MAILER_PORT: Joi.string().required(),
				MAILER_AUTH_USER: Joi.string().required(),
				MAILER_AUTH_PASS: Joi.string().required(),
				FB_ID: Joi.string().required(),
				FB_SECRET: Joi.string().required(),
				FB_CALLBACK: Joi.string().required(),
				FRONT_URL: Joi.string().required(),
				CLIENT_URL: Joi.string().required(),
				GOOGLE_ID: Joi.string().required(),
				GOOGLE_SECRET: Joi.string().required(),
				GOOGLE_CALLBACK: Joi.string().required(),
			}),
		}),
		MulterModule.register({
			dest: './files',
		}),
		// ------------------------------ GRAL_USERS
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: `${process.env.GRAL_USERS_DATABASE_HOST}`,
			port: parseInt(`${process.env.GRAL_USERS_DATABASE_PORT}`),
			username: `${process.env.GRAL_USERS_DATABASE_USERNAME}`,
			password: `${process.env.GRAL_USERS_DATABASE_PASSWORD}`,
			database: `${process.env.GRAL_USERS_DATABASE_NAME}`,
			entities: [
				Users,
				Permissions,
				RoleToPermission,
				RoleToUser,
				Roles,
				RealEstate,
				BranchOffice,
				BranchOfficeToUser,
				Invitations,
				PropertyTypes,
				OperationTypes,
				AntiquityTypes,
				GralCharacteristics,
				CurrencyTypes,
				AmbienceTypes,
				Clients,
				Posts,
				Searches,
				Conversation,
				Message,
				LoggerEntity,
			],
			synchronize: true,
		}),
		// ------------------------------ PROPERTIES
		TypeOrmModule.forRoot({
			type: 'mongodb',
			host: `${process.env.PROPERTIES_DATABASE_HOST}`,
			port: parseInt(`${process.env.PROPERTIES_DATABASE_PORT}`),
			username: `${process.env.PROPERTIES_DATABASE_USERNAME}`,
			database: `${process.env.PROPERTIES_DATABASE_NAME}`,
			entities: [Property],
			synchronize: true,
			useUnifiedTopology: true,
		}),
		MongooseModule.forRoot(
			`mongodb://${process.env.PROPERTIES_DATABASE_USERNAME}:${process.env.PROPERTIES_DATABASE_PASSWORD}@${process.env.PROPERTIES_DATABASE_HOST}/${process.env.PROPERTIES_DATABASE_NAME}`
		),
		MongooseModule.forFeature([
			{ name: Property.name, schema: PropertySchema },
			{ name: Statistics.name, schema: StatisticsSchema },
		]),
		TypeOrmModule.forFeature([
			AmbienceTypes,
			AntiquityTypes,
			BranchOffice,
			CurrencyTypes,
			Conversation,
			GralCharacteristics,
			Permissions,
			PropertyTypes,
			OperationTypes,
			RealEstate,
			Users,
			Clients,
			Roles,
			RoleToPermission,
			Permissions,
			LoggerEntity,
			Posts,
		]),
		// ------------------------------ Modules
		HttpModule,
		AuthModule,
		PropertiesModule,
		StatisticsModule,
		UsersModule,
		RolesModule,
		PermissionsModule,
		RealEstateModule,
		BranchOfficesModule,
		MailModule,
		InvitationsModule,
		UtilsModule,
		ClientsModule,
		PostsModule,
		SearchesModule,
		ConversationsModule,
		MessagesModule,
		CloudinaryModule,
		GoogleMapsModule,
		MockUpModule,
		CronModule,
	],
	controllers: [AppController],
	providers: [
		CronService,
		MockUpService,
		DatabaseService,
		AppService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_FILTER,
			useClass: JWTExceptionFilter,
		},
	],
	exports: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RequestLoggerMiddleware).forRoutes('*');
	}
}
