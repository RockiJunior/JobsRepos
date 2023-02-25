import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { OldUserPassword } from '../OldUserPassword/entities/old-user-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, OldUserPassword])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
