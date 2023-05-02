import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { Property, PropertySchema } from '../properties/schema/property.schema';
import { Statistics, StatisticsSchema } from './schema/statistics.schema';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([
			{ name: Property.name, schema: PropertySchema },
			{ name: Statistics.name, schema: StatisticsSchema },
		]),
	],
	controllers: [StatisticsController],
	providers: [StatisticsService],
	exports: [],
})
export class StatisticsModule {}
