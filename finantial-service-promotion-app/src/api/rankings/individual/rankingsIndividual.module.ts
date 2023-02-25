import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/users/entities/user.entity';
import { UsersService } from 'src/api/users/services/users.service';
import { RankingIndividual } from 'src/common/database_entities/rankingIndividual.entity';
import { Roles } from 'src/common/database_entities/roles.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { RankingIndividualController } from './rankingsIndividual.controller';
import { RankingIndividualService } from './rankingsIndividual.service';

@Module({
  imports: [TypeOrmModule.forFeature([RankingIndividual, User, Sessions, Roles])],
  controllers: [RankingIndividualController],
  providers: [RankingIndividualService, UsersService],
  exports: [RankingIndividualService],
})
export class RankingIndividualModule {}
//
