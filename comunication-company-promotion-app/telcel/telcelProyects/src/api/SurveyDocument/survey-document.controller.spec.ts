import { Test, TestingModule } from '@nestjs/testing';
import { SurveyDocumentController } from './survey-document.controller';
import { SurveyDocumentService } from './survey-document.service';

describe('SurveyDocumentController', () => {
  let controller: SurveyDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyDocumentController],
      providers: [SurveyDocumentService],
    }).compile();

    controller = module.get<SurveyDocumentController>(SurveyDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
