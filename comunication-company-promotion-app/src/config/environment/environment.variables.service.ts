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

  constructor(filePath = '.env') {
    let config;

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      config = process.env || {};
    } else {
      if (fs.existsSync(filePath)) {
        config = dotenv.parse(fs.readFileSync(filePath));
      }
    }

    this.envConfig = EnvironmentVariablesService.validateInput(config);
  }

  public static validateInput(envConfig: EnvConfig = {}): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
      APP_PORT: Joi.number().default(3000),
      LOCALES: Joi.array().items(Joi.string()).default(['es', 'en']),
      DEFAULTLOCALE: Joi.string().valid('es', 'en').default('es'),
      DB_HOST: Joi.string().default('localhost'),
      DB_PORT: Joi.number().default(3306),
      DB_USER: Joi.string(),
      DB_PASSWORD: Joi.string(),
      DB_NAME: Joi.string().required(),
      PORT: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
      EXPIRATION_PASSWORD: Joi.string().required(),
      FILE_STORAGE: Joi.string().required(),
    });

    const { error, value } = envVarsSchema.validate(envConfig, {
      allowUnknown: true,
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  getDatabaseHost(): string {
    return this.envConfig.DB_HOST;
  }

  getDatabasePort(): number {
    return Number(this.envConfig.DB_PORT);
  }

  getDatabaseUsername(): string {
    return this.envConfig.DB_USER;
  }

  getDatabasePassword(): string {
    return this.envConfig.DB_PASSWORD;
  }

  getDatabaseName(): string {
    return this.envConfig.DB_NAME;
  }
  getPort(): string {
    return this.envConfig.PORT;
  }
  getJwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }
  getAccessTokenExpiration(): string {
    return this.envConfig.ACCESS_TOKEN_EXPIRATION;
  }

  getExpirationPassword(): string {
    return this.envConfig.EXPIRATION_PASSWORD;
  }

  getFileStorage(): string {
    return this.envConfig.FILE_STORAGE;
  }
}
