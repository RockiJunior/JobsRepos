import { Injectable } from '@nestjs/common';
import { CreateSurveyDocumentDto } from './dto/create-survey-document.dto';
import { UpdateSurveyDocumentDto } from './dto/update-survey-document.dto';

@Injectable()
export class SurveyDocumentService {
  create(createSurveyDocumentDto: CreateSurveyDocumentDto) {
    return 'This action adds a new surveyDocument';
  }

  findAll() {
    return `This action returns all surveyDocument`;
  }

  findOne(id: number) {
    return `This action returns a #${id} surveyDocument`;
  }

  update(id: number, updateSurveyDocumentDto: UpdateSurveyDocumentDto) {
    return `This action updates a #${id} surveyDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} surveyDocument`;
  }
}
