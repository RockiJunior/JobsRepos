import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import {
	Property,
	PropertySchema,
} from 'src/api/Properties/properties/schema/property.schema';
import {
	Statistics,
	StatisticsSchema,
} from 'src/api/Properties/statistics/schema/statistics.schema';

import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/api/GeneralUsers/posts/entities/post.entity';
import { Conversation } from 'src/api/GeneralUsers/conversations/entities/conversation.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Posts, Conversation]),
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([
			{ name: Property.name, schema: PropertySchema },
			{ name: Statistics.name, schema: StatisticsSchema },
		]),
	],
	providers: [CronService],
})
export class CronModule {}
