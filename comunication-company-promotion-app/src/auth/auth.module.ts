import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/api/Users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStategy } from './strategies/jwt.strategy';
import { Role } from 'src/api/Users/entities/role.entity';
import { UserToken } from 'src/api/Users/entities/user-token.entity';

const { JWT_SECRET } = process.env;

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserToken]),
    JwtModule.register({
      secret: `${JWT_SECRET}`,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStategy],
})
export class AuthModule {}
