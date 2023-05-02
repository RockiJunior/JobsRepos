import { Module } from '@nestjs/common';
import { MockUpService } from './mock-up.service';
import { MockUpController } from './mock-up.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstate } from '../api/GeneralUsers/real-estate/entities/real-estate.entity';
import { BranchOffice } from '../api/GeneralUsers/branch-offices/entities/branch-office.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from '../api/Properties/properties/schema/property.schema';

@Module({
	imports: [
		TypeOrmModule.forFeature([RealEstate, BranchOffice]),
		MongooseModule.forFeature([
			{ name: Property.name, schema: PropertySchema },
		]),
	],
	controllers: [MockUpController],
	providers: [MockUpService],
})
export class MockUpModule {}
