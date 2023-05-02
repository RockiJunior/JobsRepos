import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Property } from './entities/property.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertySchema, Property } from './schema/property.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmbienceTypes } from 'src/api/GeneralUsers/utils/entities/ambience-types.entity';
import { AntiquityTypes } from '../../GeneralUsers/utils/entities/antiquity-types.entity';
import { CurrencyTypes } from 'src/api/GeneralUsers/utils/entities/currency-types.entity';
import { GralCharacteristics } from 'src/api/GeneralUsers/utils/entities/gral-characteristics.entity';
import { OperationTypes } from 'src/api/GeneralUsers/utils/entities/operation-types.entity';
import { PropertyTypes } from 'src/api/GeneralUsers/utils/entities/property-types.entity';
import { AuthService } from 'src/api/GeneralUsers/auth/auth.service';
import { Users } from '../../GeneralUsers/users/entities/user.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { RealEstate } from '../../GeneralUsers/real-estate/entities/real-estate.entity';
import { GoogleMapsService } from '../../../google-maps/google-maps.service';
import { BranchOffice } from '../../GeneralUsers/branch-offices/entities/branch-office.entity';
import {
	Statistics,
	StatisticsSchema,
} from '../statistics/schema/statistics.schema';
import { Conversation } from 'src/api/GeneralUsers/conversations/entities/conversation.entity';
import { Clients } from 'src/api/GeneralUsers/clients/entities/client.entity';
import { Posts } from 'src/api/GeneralUsers/posts/entities/post.entity';

@Module({
	imports: [
		CloudinaryModule,
		TypeOrmModule.forFeature([
			AmbienceTypes,
			AntiquityTypes,
			CurrencyTypes,
			OperationTypes,
			PropertyTypes,
			GralCharacteristics,
			Users,
			RealEstate,
			BranchOffice,
			Conversation,
			Clients,
			Posts,
		]),
		MongooseModule.forFeature([
			{ name: Property.name, schema: PropertySchema },
			{ name: Statistics.name, schema: StatisticsSchema },
		]),
	],
	controllers: [PropertiesController],
	providers: [PropertiesService, AuthService, GoogleMapsService],
	exports: [PropertiesService],
})
export class PropertiesModule {}
