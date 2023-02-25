import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { Roles } from 'src/common/database_entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Sessions, Roles])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
