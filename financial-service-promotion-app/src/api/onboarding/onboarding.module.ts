import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

import { PartnersController } from '../partners/partners.controller';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { AuthModule } from '../../auth/auth.module';
import { PartnersService } from '../partners/partners.service';

import { Partner } from '../../common/database_entities/partner.entity';
import { PartnerFile } from '../../common/database_entities/partnerFile.entity';
import { SequentialEntity } from '../../common/database_entities/sequential.entity';

import { EnvironmentVariablesModule } from '../../config/environment/environmentVariables.module';
import { EnvironmentVariablesService } from '../../config/environment/environmentVariables.service';
import { Territory } from 'src/common/database_entities/territories.entity';
import { ReferredEntity } from 'src/common/database_entities/referred.entity';
@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Partner, PartnerFile, SequentialEntity, Territory, ReferredEntity]),
    MailerModule.forRootAsync({
      imports: [EnvironmentVariablesModule],
      useFactory: async (configService: EnvironmentVariablesService) => {
        return {
          transport: {
            host: configService.getMailHost(),
            secure: true,
            auth: {
              user: configService.getMailUser(),
              pass: configService.getMailPass(),
            },
          },
          defaults: {
            from: `"No Reply" <${configService.getMailFrom()}>`,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [PartnersController, OnboardingController],
  providers: [OnboardingService, PartnersService],
  exports: [PartnersService],
})
export class OnboardingModule {}
