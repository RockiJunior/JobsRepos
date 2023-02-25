import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferredController } from './referred.controller';
import { ReferredService } from './referred.service';
import { BankAccountEntity } from 'src/common/database_entities/bankAccount.entity';
import { ReferredEntity } from '../../common/database_entities/referred.entity';
import { PartnersService } from '../partners/partners.service';
import { PartnerFile } from '../../common/database_entities/partnerFile.entity';
import { Partner } from '../../common/database_entities/partner.entity';
import { CourseToPartner } from 'src/common/database_entities/coursePartner.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { PartnerChanged } from '../../common/database_entities/partner_changed.entity';
import { RankingPartnersIndiv } from 'src/common/database_entities/rankingPartnersIndiv.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Roles } from 'src/common/database_entities/roles.entity';
import { Course } from '../../common/database_entities/course.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      Sessions,
      Partner,
      BankAccountEntity,
      CourseToPartner,
      Course,
      ReferredEntity,
      PartnerFile,
      PartnerChanged,
      RankingPartnersIndiv,
      Roles,
    ]),
  ],
  controllers: [ReferredController],
  providers: [ReferredService, PartnersService],
  exports: [PartnersService],
})
export class ReferredModule {}
