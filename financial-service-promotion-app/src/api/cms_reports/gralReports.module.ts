// Imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Controllers
import { GralReportsAssocController } from './gralReports.controller';
// Services
import { GralReportsAssocService } from './gralReportsAssoc/gralReportAssoc.service';
import { GralReportsActivityService } from './gralReportsActivity/gralReportsActivity.service';
import { GralReportsScoreService } from './gralReportsScore/gralReportsScore.service';
import { GralReportsCommissService } from './gralReportsCommissions/gralReportsCommiss.service';
// Entities
import { Partner } from '../../common/database_entities/partner.entity';
import { GralReportsAssoc } from 'src/common/database_entities/gralReportsAssoc.entity';
import { GralReportsActivity } from 'src/common/database_entities/gralReportsActivity.entity';
import { GralReportsScore } from 'src/common/database_entities/gralReportsScore.entity';
import { GralReportsCommiss } from 'src/common/database_entities/gralReportsCommiss.entity';
import { Reports } from '../../common/database_entities/reports.entity';
import { RankingPartnersIndiv } from '../../common/database_entities/rankingPartnersIndiv.entity';
import { IndividualCommissions } from '../../common/database_entities/individual_commissions.entity';
import { MovementTypes } from '../../common/database_entities/movement_types.entity';
import { RankingIndividual } from '../../common/database_entities/rankingIndividual.entity';
import { QueryByConceptService } from './queryByConcept/queryByConcept.service';
import { Course } from '../../common/database_entities/course.entity';
import { CourseToPartner } from '../../common/database_entities/coursePartner.entity';
import { BankAccountEntity } from '../../common/database_entities/bankAccount.entity';
import { Sessions } from '../../common/database_entities/sessions.entity';
import { ReportHasMovements } from '../../common/database_entities/report_has_movement.entity';
import { Movements } from '../../common/database_entities/movements.entity';
import { RankingPartnersLead } from '../../common/database_entities/rankingPartnersLead.entity';
import { PartnerChanged } from '../../common/database_entities/partner_changed.entity';
import { Territory } from '../../common/database_entities/territories.entity';
import { MonthlyBonus } from '../../common/database_entities/monthly_bonus.entity';
import { MonthlyGoal } from '../../common/database_entities/monthly_goal.entity';
import { ReferredEntity } from '../../common/database_entities/referred.entity';
import { LeadershipCommissions } from '../../common/database_entities/leadership_commissions.entity';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';
import { Roles } from 'src/common/database_entities/roles.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sessions,
      Partner,
      Reports,
      GralReportsAssoc,
      GralReportsActivity,
      GralReportsScore,
      GralReportsCommiss,
      RankingPartnersIndiv,
      IndividualCommissions,
      MovementTypes,
      RankingIndividual,
      Course,
      CourseToPartner,
      BankAccountEntity,
      ReportHasMovements,
      Movements,
      RankingPartnersIndiv,
      RankingPartnersLead,
      PartnerChanged,
      Territory,
      MonthlyBonus,
      MonthlyGoal,
      ReferredEntity,
      IndividualCommissions,
      LeadershipCommissions,
      Movements,
      User,
      Roles,
    ]),
  ],
  controllers: [GralReportsAssocController],
  providers: [
    GralReportsAssocService,
    GralReportsActivityService,
    GralReportsScoreService,
    GralReportsCommissService,
    QueryByConceptService,
    UsersService,
  ],
  exports: [
    GralReportsAssocService,
    GralReportsActivityService,
    GralReportsScoreService,
    GralReportsCommissService,
    QueryByConceptService,
  ],
})
export class GralReportsModule {}
