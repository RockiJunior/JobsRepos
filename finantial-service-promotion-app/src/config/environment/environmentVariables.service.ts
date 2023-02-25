import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class EnvironmentVariablesService {
  private readonly envConfig: EnvConfig;

  /**
   * Creates an instance of EnvironmentVariablesService.
   * @param {string} filePath
   * @memberof EnvironmentVariablesService
   */
  constructor(filePath: string) {
    let config;

    if (fs.existsSync(filePath)) {
      config = dotenv.parse(fs.readFileSync(filePath));
    }
    this.envConfig = this.validateInput(config);
    dotenv.config({ path: filePath });
  }

  /**
   * validate the variables declared within the environment variables file.
   * @private
   * @param {EnvConfig} [envConfig={}]
   * @return {*}  {EnvConfig}
   * @memberof EnvironmentVariablesService
   */
  private validateInput(envConfig: EnvConfig = {}): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
      PORT: Joi.number().default(3001),
      LOCALES: Joi.array().items(Joi.string()).default(['es']),
      DEFAULTLOCALE: Joi.string().valid('es').default('es'),
      DATABASE_HOST: Joi.string().required(),
      DATABASE_TYPE: Joi.string()
        .valid(
          'mysql',
          'mariadb',
          'postgres',
          'cockroachdb',
          'sqlite',
          'mssql',
          'sap',
          'oracle',
          'cordova',
          'nativescript',
          'react-native',
          'sqljs',
          'mongodb',
          'aurora-data-api',
          'aurora-data-api-pg',
          'expo',
          'better-sqlite3',
          'capacitor',
        )
        .default('oracle'),
      DATABASE_PORT: Joi.number().default(3306),
      DATABASE_USER: Joi.string(),
      DATABASE_PASSWORD: Joi.string(),
      DATABASE_NAME: Joi.string().required(),
      API_KEY: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      API_HOST: Joi.string().required(),
      FILES_HOST: Joi.string().required(),
      LANDING_URL: Joi.string().required(),
      MODE: Joi.string().required(),
      RUN_MIGRATIONS: Joi.string().required(),
      FILES_PATH: Joi.string().required(),
      MAIL_USER: Joi.string().required(),
      MAIL_PASS: Joi.string().required(),
      MAIL_FROM: Joi.string().required(),
      MAIL_HOST: Joi.string().required(),
      AUTH_TOKEN: Joi.string().required(),
      HOST: Joi.string().required(),
      FINCOMUN_API: Joi.string().required(),
      NODE_TLS_REJECT_UNAUTHORIZED: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }

  /**
   * Get value stored in the environment variables file.
   * @param {string} key
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  get(key: string): string {
    return this.envConfig[key];
  }

  /**
   * Get NODE_ENV value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  getNodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  /**
   * Get DATABASE_HOST value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  getDatabaseHost(): string {
    return this.envConfig.DATABASE_HOST;
  }

  /**
   * Get DATABASE_USER value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  getDatabaseUsername(): string {
    return this.envConfig.DATABASE_USER;
  }

  /**
   * Get DATABASE_NAME value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  getDatabaseName(): string {
    return this.envConfig.DATABASE_NAME;
  }

  /**
   * Get DATABASE_PASSWORD value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  getDatabasePassword(): string {
    return this.envConfig.DATABASE_PASSWORD;
  }

  /**
   * Get DATABASE_PORT value stored in the environment variables file.
   * @return {*}  {number}
   * @memberof EnvironmentVariablesService
   */
  getDatabasePort(): number {
    return Number(this.envConfig.DATABASE_PORT);
  }

  /**
   * Get DATABASE_TYPE value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  getDatabaseType(): string {
    return this.envConfig.DATABASE_TYPE;
  }

  /**
   * Get PORT value stored in the environment variables file.
   * @return {*}  {number}
   * @memberof EnvironmentVariablesService
   */
  getPort(): number {
    return Number(this.envConfig.PORT);
  }

  /**
   * Get LOCALES value stored in the environment variables file.
   * @return {*}  {string[]}
   * @memberof EnvironmentVariablesService
   */
  getLocales(): string[] {
    return Array.from(this.envConfig.LOCALES);
  }

  /**
   * Get DEFAULTLOCALE value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  getDefaultLocale(): string {
    return this.envConfig.DEFAULTLOCALE;
  }

  /**
   * Get API_KEY value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  getApiKey(): string {
    return this.envConfig.API_KEY;
  }

  getMailHost(): string {
    return this.envConfig.MAIL_HOST;
  }

  getMailUser(): string {
    return this.envConfig.MAIL_USER;
  }

  getMailPass(): string {
    return this.envConfig.MAIL_PASS;
  }

  getMailFrom(): string {
    return this.envConfig.MAIL_FROM;
  }

  getAuthPartnerFrom(): string {
    return this.envConfig.AUTH_TOKEN;
  }

  getHost() {
    return this.envConfig.HOST;
  }

  getFincomunAPI() {
    return this.envConfig.FINCOMUN_API;
  }

  getNodeTLSRejectUnauthorized() {
    return this.envConfig.NODE_TLS_REJECT_UNAUTHORIZED;
  }

  /**
   * Get SECRET_PRIVATE_JWT value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  /*   getSecretPrivateJWT(): string {
    return this.envConfig.SECRET_PRIVATE_JWT;
  } */

  /**
   * Get SECRET_PUBLIC_JWT value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  /*   getSecretPublicJWT(): string {
    return this.envConfig.SECRET_PUBLIC_JWT;
  } */

  /**
   * Get EXPIRES_IN_JWT_APPLICATION value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  /*   getExpiresInJWTApplication(): string {
    return this.envConfig.EXPIRES_IN_JWT_APPLICATION;
  } */

  /**
   * Get EXPIRES_IN_JWT value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  /*   getExpiresInJWT(): string {
    return this.envConfig.EXPIRES_IN_JWT;
  } */

  /**
   * Get EXPIRES_IN_REFRESH_TOKEN_JWT value stored in the environment variables file.
   * @return {*}  {string}
   * @memberof EnvironmentVariablesService
   */
  /*   getExpiresInRefreshTokenJWT(): string {
    return this.envConfig.EXPIRES_IN_REFRESH_TOKEN_JWT;
  } */
}
