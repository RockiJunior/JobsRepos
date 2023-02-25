import { Module } from '@nestjs/common';
import { SurveyDocumentService } from './survey-document.service';
import { SurveyDocumentController } from './survey-document.controller';

@Module({
  controllers: [SurveyDocumentController],
  providers: [SurveyDocumentService]
})
export class SurveyDocumentModule {}
