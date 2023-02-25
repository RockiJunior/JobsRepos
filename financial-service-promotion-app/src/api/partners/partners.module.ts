import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

import { PartnersController } from './partners.controller';
import { OnboardingController } from '../onboarding/onboarding.controller';
import { OnboardingService } from '../onboarding/onboarding.service';
import { Partner } from '../../common/database_entities/partner.entity';

import { AuthModule } from '../../auth/auth.module';
import { PartnersService } from './partners.service';
import { PartnerFile } from '../../common/database_entities/partnerFile.entity';
import { CourseToPartner } from 'src/common/database_entities/coursePartner.entity';
import { BankAccountEntity } from 'src/common/database_entities/bankAccount.entity';
import { Course } from 'src/common/database_entities/course.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { Roles } from 'src/common/database_entities/roles.entity';
import { SequentialEntity } from '../../common/database_entities/sequential.entity';
import { RankingPartnersLead } from 'src/common/database_entities/rankingPartnersLead.entity';
import { Territory } from 'src/common/database_entities/territories.entity';
import { PartnerChanged } from '../../common/database_entities/partner_changed.entity';
import { RankingPartnersIndiv } from 'src/common/database_entities/rankingPartnersIndiv.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';
import { ReferredEntity } from 'src/common/database_entities/referred.entity';

const { MAIL_FROM, MAIL_USER, MAIL_PASS, MAIL_HOST } = process.env;

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      User,
      Partner,
      PartnerFile,
      CourseToPartner,
      Course,
      BankAccountEntity,
      Course,
      Sessions,
      Roles,
      SequentialEntity,
      RankingPartnersLead,
      Territory,
      PartnerChanged,
      RankingPartnersIndiv,
      ReferredEntity,
    ]),
    MailerModule.forRoot({
      // smtps://iram.gutierrez@gigigo.com:Gigigo2021$$@smtp.gmail.com
      transport: `smtps://${MAIL_USER}:${MAIL_PASS}@${MAIL_HOST}`,
      defaults: {
        from: '"Fincomun" <no-reply@fincomun.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [PartnersController, OnboardingController],
  providers: [OnboardingService, PartnersService, UsersService],
  exports: [PartnersService],
})
export class PartnersModule {}
