import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatementsService } from './statement.service';
import { StatementsEntity } from '../../common/database_entities/statements.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';
import { Roles } from '../../common/database_entities/roles.entity';
import { Sessions } from '../../common/database_entities/sessions.entity';
import { AuthModule } from '../../auth/auth.module';
import { StatementsController } from './statement.controller';
import { Partner } from '../../common/database_entities/partner.entity';
import { PartnersService } from '../partners/partners.service';
import { PartnerFile } from '../../common/database_entities/partnerFile.entity';
import { CourseToPartner } from '../../common/database_entities/coursePartner.entity';
import { BankAccountEntity } from '../../common/database_entities/bankAccount.entity';
import { PartnerChanged } from '../../common/database_entities/partner_changed.entity';
import { RankingPartnersIndiv } from '../../common/database_entities/rankingPartnersIndiv.entity';
import { Course } from '../../common/database_entities/course.entity';
import { ReferredEntity } from '../../common/database_entities/referred.entity';
import { ReferredService } from '../referred/referred.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      StatementsEntity,
      User,
      Roles,
      Sessions,
      Partner,
      PartnerFile,
      CourseToPartner,
      Course,
      BankAccountEntity,
      PartnerChanged,
      RankingPartnersIndiv,
      ReferredEntity,
    ]),
  ],
  controllers: [StatementsController],
  providers: [StatementsService, UsersService, PartnersService],
})
export class StatementsModule {}
