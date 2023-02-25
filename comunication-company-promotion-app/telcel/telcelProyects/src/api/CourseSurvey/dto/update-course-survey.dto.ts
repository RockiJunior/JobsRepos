import { PartialType } from '@nestjs/swagger';
import { CreateCourseSurveyDto } from './create-course-survey.dto';

export class UpdateCourseSurveyDto extends PartialType(CreateCourseSurveyDto) {}
