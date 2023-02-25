import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as i18n from 'i18n';
import { EnvironmentVariablesService } from '../environment/environmentVariables.service';
import { User } from '../../api/users/entities/user.entity';
import { Partner } from '../../common/database_entities/partner.entity';

// Check URL
// https://typeorm.io/#/
// The Section
// Quick Start
// -------------------------------------------
// Check URL
// https://docs.nestjs.com/techniques/database

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private logger: Logger = new Logger('TypeOrmConfigService');

  constructor(private readonly config: EnvironmentVariablesService) {
    this.logger.log(i18n.__('informationDataBase'));

    this.logger.log(`Type: ${config.getDatabaseType()}`);

    if (config.getNodeEnv() !== 'production') {
      this.logger.log(`Host: ${config.getDatabaseHost()}`);
      this.logger.log(`Port: ${config.getDatabasePort()}`);
      this.logger.log(`Name: ${config.getDatabaseName()}`);
    } else {
      this.logger.log(`Host: ${config.getDatabaseHost()}`);
      this.logger.log(`Name: ${config.getDatabaseName()}`);
    }
  }


  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      // type: 'oracle',
      // connectString: 'fincomun',
      // // host: this.config.getDatabaseHost(),
      // //port: this.config.getDatabasePort(),
      // username: this.config.getDatabaseUsername(),
      // password: this.config.getDatabasePassword(),
      // database: this.config.getDatabaseName(),
      // // sid: 'asoccsdv.svr110.vcnprod.oraclevcn.com', // service Name Id
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], // comentar en caso de usar oracle
      // subscribers: [__dirname + '/**/*.suscriber{.ts,.js}'], // comentar en caso de usar oracle
      // synchronize: true,
      // autoLoadEntities: true,
      // logging: true,
      // ----------------------------------------------------------------------------------------------
      type: 'mysql',
      host: this.config.getDatabaseHost(),
      port: this.config.getDatabasePort(),
      username: this.config.getDatabaseUsername(),
      password: this.config.getDatabasePassword(),
      database: this.config.getDatabaseName(),
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // comentar en caso de usar oracle
      subscribers: [__dirname + '/**/*.suscriber{.ts,.js}'], // comentar en caso de usar oracle
      synchronize: false,
      autoLoadEntities: true,
    };
  }
}
