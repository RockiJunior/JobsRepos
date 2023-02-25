import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseSurveyService } from './course-survey.service';
import { CreateCourseSurveyDto } from './dto/create-course-survey.dto';
import { UpdateCourseSurveyDto } from './dto/update-course-survey.dto';

@Controller('course-survey')
export class CourseSurveyController {
  constructor(private readonly courseSurveyService: CourseSurveyService) {}

  @Post()
  create(@Body() createCourseSurveyDto: CreateCourseSurveyDto) {
    return this.courseSurveyService.create(createCourseSurveyDto);
  }

  @Get()
  findAll() {
    return this.courseSurveyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseSurveyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseSurveyDto: UpdateCourseSurveyDto) {
    return this.courseSurveyService.update(+id, updateCourseSurveyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseSurveyService.remove(+id);
  }
}
