import { Injectable } from '@nestjs/common';
import { CreateCourseSurveyDto } from './dto/create-course-survey.dto';
import { UpdateCourseSurveyDto } from './dto/update-course-survey.dto';

@Injectable()
export class CourseSurveyService {
  create(createCourseSurveyDto: CreateCourseSurveyDto) {
    return 'This action adds a new courseSurvey';
  }

  findAll() {
    return `This action returns all courseSurvey`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseSurvey`;
  }

  update(id: number, updateCourseSurveyDto: UpdateCourseSurveyDto) {
    return `This action updates a #${id} courseSurvey`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseSurvey`;
  }
}
