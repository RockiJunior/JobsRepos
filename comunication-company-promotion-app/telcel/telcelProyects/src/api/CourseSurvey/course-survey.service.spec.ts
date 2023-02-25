import { Test, TestingModule } from '@nestjs/testing';
import { CourseSurveyService } from './course-survey.service';

describe('CourseSurveyService', () => {
  let service: CourseSurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseSurveyService],
    }).compile();

    service = module.get<CourseSurveyService>(CourseSurveyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
