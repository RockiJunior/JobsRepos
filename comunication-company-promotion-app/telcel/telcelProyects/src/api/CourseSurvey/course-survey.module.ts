import { Module } from '@nestjs/common';
import { CourseSurveyService } from './course-survey.service';
import { CourseSurveyController } from './course-survey.controller';

@Module({
  controllers: [CourseSurveyController],
  providers: [CourseSurveyService]
})
export class CourseSurveyModule {}
