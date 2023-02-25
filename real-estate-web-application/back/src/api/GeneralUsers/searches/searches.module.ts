import { Module } from '@nestjs/common';
import { SearchesService } from './searches.service';
import { SearchesController } from './searches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Searches } from './entities/search.entity';
import { Clients } from '../clients/entities/client.entity';
import { Users } from '../users/entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthService } from '../auth/auth.service';

@Module({
	imports: [TypeOrmModule.forFeature([Searches, Clients, Users])],
	controllers: [SearchesController],
	providers: [SearchesService, JwtStrategy, AuthService],
	exports: [SearchesService],
})
export class SearchesModule {}
