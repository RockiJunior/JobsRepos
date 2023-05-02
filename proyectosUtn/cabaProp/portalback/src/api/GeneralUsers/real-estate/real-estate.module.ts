import { Module } from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { RealEstateController } from './real-estate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstate } from './entities/real-estate.entity';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Users } from '../users/entities/user.entity';
import { BranchOffice } from '../branch-offices/entities/branch-office.entity';
import { Clients } from '../clients/entities/client.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([RealEstate, BranchOffice, Users, Clients]),
	],
	controllers: [RealEstateController],
	providers: [RealEstateService, AuthService],
	exports: [RealEstateService],
})
export class RealEstateModule {}
