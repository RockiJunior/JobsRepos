import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SurveyDocumentService } from './survey-document.service';
import { CreateSurveyDocumentDto } from './dto/create-survey-document.dto';
import { UpdateSurveyDocumentDto } from './dto/update-survey-document.dto';

@Controller('survey-document')
export class SurveyDocumentController {
  constructor(private readonly surveyDocumentService: SurveyDocumentService) {}

  @Post()
  create(@Body() createSurveyDocumentDto: CreateSurveyDocumentDto) {
    return this.surveyDocumentService.create(createSurveyDocumentDto);
  }

  @Get()
  findAll() {
    return this.surveyDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyDocumentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDocumentDto: UpdateSurveyDocumentDto) {
    return this.surveyDocumentService.update(+id, updateSurveyDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveyDocumentService.remove(+id);
  }
}
