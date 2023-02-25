import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LanguageModule } from './config/languages/config/language.module';
import { EnvironmentVariablesModule } from './config/environment/environmentVariables.module';
import { UsersModule } from './api/users/users.module';
import { enviroments } from './enviroments';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './api/partners/partners.module';
import { LoadsModule } from './loads/loads.module';
import { TrainingModule } from './api/courses/courses.module';
import { StatementsModule } from './api/statements/statement.module';
import { ReferredModule } from './api/referred/referred.module';
import { GralReportsModule } from './api/cms_reports/gralReports.module';

import { TypeOrmConfigService } from './config/database/typeorm.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from './config';
import { MovementsModule } from './api/movements/movements.module';
import { RankingIndividualModule } from './api/rankings/individual/rankingsIndividual.module';
import { RankingLeadershipModule } from './api/rankings/leadership/rankingLeadership.module';
import { CommissionsModule } from './api/commissions/commissions.module';
import { Commission } from './common/database_entities/commission.entity';
import { Concept } from './common/database_entities/concept.entity';
import { Level } from './common/database_entities/level.entity';
import { MeasurementUnit } from './common/database_entities/measurment_unit.entity';
import { MovementTypes } from './common/database_entities/movement_types.entity';
import { PaymentChronology } from './common/database_entities/payment_chronology.entity';
import { RankingIndividual } from './common/database_entities/rankingIndividual.entity';
import { RankingLeadership } from './common/database_entities/rankingLeadership.entity';
import { Roles } from './common/database_entities/roles.entity';
import { SequentialEntity } from './common/database_entities/sequential.entity';
import { Territory } from './common/database_entities/territories.entity';
import { CommissionType } from './common/database_entities/commission_type.entity';
import { User } from './api/users/entities/user.entity';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        API_HOST: Joi.string().required(),
        FILES_HOST: Joi.string().required(),
        LANDING_URL: Joi.string().required(),
      }),
    }),
    HttpModule,
    LanguageModule,
    EnvironmentVariablesModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    PartnersModule,
    LoadsModule,
    TrainingModule,
    MovementsModule,
    StatementsModule,
    ReferredModule,
    RankingIndividualModule,
    RankingLeadershipModule,
    CommissionsModule,
    GralReportsModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      Commission,
      Concept,
      Level,
      MeasurementUnit,
      MovementTypes,
      PaymentChronology,
      RankingIndividual,
      RankingLeadership,
      Roles,
      SequentialEntity,
      Territory,
      CommissionType,
      User,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
