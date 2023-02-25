import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from './entities/course.entity';
import { Survey } from '../Survey/entities/survey.entity';
import { CourseSurvey } from '../CourseSurvey/entities/course-survey.entity';
import { Document } from '../Documents/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Survey, CourseSurvey, Document])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
