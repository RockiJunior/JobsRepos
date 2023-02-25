//Create a module for the commissions nestjs
// Language: typescript

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BankAccountEntity } from 'src/common/database_entities/bankAccount.entity';
import { Commission } from 'src/common/database_entities/commission.entity';
import { CourseToPartner } from 'src/common/database_entities/coursePartner.entity';
import { IndividualCommissions } from 'src/common/database_entities/individual_commissions.entity';
import { LeadershipCommissions } from 'src/common/database_entities/leadership_commissions.entity';
import { MonthlyBonus } from 'src/common/database_entities/monthly_bonus.entity';
import { MonthlyGoal } from 'src/common/database_entities/monthly_goal.entity';
import { Partner } from 'src/common/database_entities/partner.entity';
import { PartnerFile } from 'src/common/database_entities/partnerFile.entity';
import { RankingLeadership } from 'src/common/database_entities/rankingLeadership.entity';
import { RankingPartnersIndiv } from 'src/common/database_entities/rankingPartnersIndiv.entity';
import { RankingPartnersLead } from 'src/common/database_entities/rankingPartnersLead.entity';
import { ReferredEntity } from 'src/common/database_entities/referred.entity';
import { Reports } from 'src/common/database_entities/reports.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { CommissionType } from '../../common/database_entities/commission_type.entity';
import { Concept } from '../../common/database_entities/concept.entity';
import { Level } from '../../common/database_entities/level.entity';
import { MeasurementUnit } from '../../common/database_entities/measurment_unit.entity';
import { PaymentChronology } from '../../common/database_entities/payment_chronology.entity';
import { PartnersService } from '../partners/partners.service';
import { CommissionsController } from './comissions.controller';
import { CommissionsService } from './commissions.service';
import { PartnerChanged } from '../../common/database_entities/partner_changed.entity';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';
import { Roles } from 'src/common/database_entities/roles.entity';
import { Course } from '../../common/database_entities/course.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      Commission,
      Concept,
      CommissionType,
      Level,
      MeasurementUnit,
      PaymentChronology,
      Partner,
      PartnerFile,
      CourseToPartner,
      Course,
      BankAccountEntity,
      Sessions,
      Reports,
      RankingPartnersIndiv,
      RankingPartnersLead,
      IndividualCommissions,
      MonthlyBonus,
      RankingLeadership,
      LeadershipCommissions,
      ReferredEntity,
      MonthlyGoal,
      PartnerChanged,
      User,
      Roles,
    ]),
  ],
  providers: [CommissionsService, PartnersService, UsersService],
  controllers: [CommissionsController],
  exports: [CommissionsService],
})
export class CommissionsModule {}
