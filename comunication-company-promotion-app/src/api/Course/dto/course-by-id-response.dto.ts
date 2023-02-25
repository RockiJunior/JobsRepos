import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'src/api/Documents/entities/document.entity';
import { Survey } from 'src/api/Survey/entities/survey.entity';

export class CourseByIdResponseDto {
  @ApiProperty()
  private readonly documents: Document[];
  private readonly survey: Survey;

  constructor(documents: Document[], survey: Survey) {
    this.documents = documents;
    this.survey = survey;
  }
}
