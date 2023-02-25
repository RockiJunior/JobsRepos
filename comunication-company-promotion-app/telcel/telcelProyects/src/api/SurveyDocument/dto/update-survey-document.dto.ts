import { PartialType } from '@nestjs/swagger';
import { CreateSurveyDocumentDto } from './create-survey-document.dto';

export class UpdateSurveyDocumentDto extends PartialType(CreateSurveyDocumentDto) {}
