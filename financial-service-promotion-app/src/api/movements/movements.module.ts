import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movements } from 'src/common/database_entities/movements.entity';
import { MovementTypes } from 'src/common/database_entities/movement_types.entity';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';
import { PartnersService } from '../partners/partners.service';
import { CourseToPartner } from 'src/common/database_entities/coursePartner.entity';
import { BankAccountEntity } from 'src/common/database_entities/bankAccount.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { Partner } from 'src/common/database_entities/partner.entity';
import { Reports } from 'src/common/database_entities/reports.entity';
import { ReportHasMovements } from 'src/common/database_entities/report_has_movement.entity';
import { PartnerFile } from 'src/common/database_entities/partnerFile.entity';
import { RankingIndividual } from 'src/common/database_entities/rankingIndividual.entity';
import { RankingPartnersLead } from 'src/common/database_entities/rankingPartnersLead.entity';

import { ReferredEntity } from 'src/common/database_entities/referred.entity';
import { RankingPartnersIndiv } from 'src/common/database_entities/rankingPartnersIndiv.entity';
import { PartnerChanged } from '../../common/database_entities/partner_changed.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Roles } from 'src/common/database_entities/roles.entity';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';
import { Course } from '../../common/database_entities/course.entity';
import { Ranking } from 'src/common/database_entities/ranking_partners.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      Movements,
      MovementTypes,
      BankAccountEntity,
      Sessions,
      CourseToPartner,
      Course,
      Partner,
      Reports,
      ReportHasMovements,
      PartnerFile,
      RankingIndividual,
      RankingPartnersLead,
      RankingPartnersIndiv,
      ReferredEntity,
      PartnerChanged,
      Roles,
      User,
      Ranking,
    ]),
  ],
  controllers: [MovementsController],
  providers: [MovementsService, PartnersService, UsersService],
  exports: [MovementsService],
})
export class MovementsModule {}
