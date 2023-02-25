// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Databases, Controllers, Services & Dtos
import { BranchOfficesService } from './branch-offices.service';
import { BranchOfficesController } from './branch-offices.controller';
import { BranchOffice } from './entities/branch-office.entity';
import { BranchOfficeToUser } from './entities/branch-office-user.entity';
import { RealEstate } from '../real-estate/entities/real-estate.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([BranchOffice, BranchOfficeToUser, RealEstate]),
	],
	controllers: [BranchOfficesController],
	providers: [BranchOfficesService],
	exports: [BranchOfficesService],
})
export class BranchOfficesModule {}
