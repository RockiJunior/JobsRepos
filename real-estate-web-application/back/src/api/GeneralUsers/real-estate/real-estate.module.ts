import { Module } from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { RealEstateController } from './real-estate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstate } from './entities/real-estate.entity';

@Module({
	imports: [TypeOrmModule.forFeature([RealEstate])],
	controllers: [RealEstateController],
	providers: [RealEstateService],
	exports: [RealEstateService],
})
export class RealEstateModule {}
