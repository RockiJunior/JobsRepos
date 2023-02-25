import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType, ConfigModule } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PartnerLocalStrategy } from './strategies/partnerLocal.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../api/users/users.module';
import { PartnersModule } from '../api/partners/partners.module';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { AuthController } from './controllers/auth.controller';
import config from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from '../common/database_entities/partner.entity';
@Module({
  imports: [
    UsersModule,
    PartnersModule,
    PassportModule,
    TypeOrmModule.forFeature([Sessions, Partner]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '10d',
          },
        };
      },
    }),
  ],
  exports: [AuthService],
  providers: [AuthService, LocalStrategy, PartnerLocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
