import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './courses.service';
import { CourseController } from './courses.controller';
import { Course } from '../../common/database_entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseToPartner } from '../../common/database_entities/coursePartner.entity';
import { Partner } from 'src/common/database_entities/partner.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { Roles } from 'src/common/database_entities/roles.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, Course, CourseToPartner, Partner, Sessions, Roles]),
  ],
  providers: [CourseService, UsersService],
  controllers: [CourseController],
  exports: [CourseService],
})
export class TrainingModule {}
