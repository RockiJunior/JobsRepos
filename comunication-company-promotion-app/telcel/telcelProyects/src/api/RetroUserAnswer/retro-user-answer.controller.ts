import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RetroUserAnswerService } from './retro-user-answer.service';
import { CreateRetroUserAnswerDto } from './dto/create-retro-user-answer.dto';
import { UpdateRetroUserAnswerDto } from './dto/update-retro-user-answer.dto';

@Controller('retro-user-answer')
export class RetroUserAnswerController {
  constructor(private readonly retroUserAnswerService: RetroUserAnswerService) {}

  @Post()
  create(@Body() createRetroUserAnswerDto: CreateRetroUserAnswerDto) {
    return this.retroUserAnswerService.create(createRetroUserAnswerDto);
  }

  @Get()
  findAll() {
    return this.retroUserAnswerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.retroUserAnswerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRetroUserAnswerDto: UpdateRetroUserAnswerDto) {
    return this.retroUserAnswerService.update(+id, updateRetroUserAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.retroUserAnswerService.remove(+id);
  }
}
