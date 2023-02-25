import { Test, TestingModule } from '@nestjs/testing';
import { SurveyDocumentService } from './survey-document.service';

describe('SurveyDocumentService', () => {
  let service: SurveyDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyDocumentService],
    }).compile();

    service = module.get<SurveyDocumentService>(SurveyDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
