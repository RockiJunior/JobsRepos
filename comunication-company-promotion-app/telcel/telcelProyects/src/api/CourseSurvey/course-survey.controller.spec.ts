import { Test, TestingModule } from '@nestjs/testing';
import { CourseSurveyController } from './course-survey.controller';
import { CourseSurveyService } from './course-survey.service';

describe('CourseSurveyController', () => {
  let controller: CourseSurveyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseSurveyController],
      providers: [CourseSurveyService],
    }).compile();

    controller = module.get<CourseSurveyController>(CourseSurveyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
