import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/users/entities/user.entity';
import { UsersService } from 'src/api/users/services/users.service';
import { RankingLeadership } from 'src/common/database_entities/rankingLeadership.entity';
import { Roles } from 'src/common/database_entities/roles.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { RankingLeadershipController } from './rankingLeadership.controller';
import { RankingLeadershipService } from './rankingLeadership.service';

@Module({
  imports: [TypeOrmModule.forFeature([RankingLeadership, User, Sessions, Roles])],
  controllers: [RankingLeadershipController],
  providers: [RankingLeadershipService, UsersService],
  exports: [RankingLeadershipService],
})
export class RankingLeadershipModule {}
//
