import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EvaluationsService } from './evaluation.service';
import { CreateEvaluationQuestionDto } from './dto/create-evaluation-question.dto';
import { UpdateEvaluationQuestionDto } from './dto/update-evaluation-question.dto';

@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  create(@Body() createEvaluationQuestionDto: CreateEvaluationQuestionDto) {
    return this.evaluationsService.create(createEvaluationQuestionDto);
  }

  @Get()
  findAll() {
    return this.evaluationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEvaluationQuestionDto: UpdateEvaluationQuestionDto,
  ) {
    return this.evaluationsService.update(+id, updateEvaluationQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluationsService.remove(+id);
  }
}
