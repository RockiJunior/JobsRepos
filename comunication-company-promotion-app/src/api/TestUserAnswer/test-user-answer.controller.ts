import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestUserAnswerService } from './test-user-answer.service';
import { CreateTestUserAnswerDto } from './dto/create-test-user-answer.dto';
import { UpdateTestUserAnswerDto } from './dto/update-test-user-answer.dto';

@Controller('test-user-answer')
export class TestUserAnswerController {
  constructor(private readonly testUserAnswerService: TestUserAnswerService) {}

  @Post()
  create(@Body() createTestUserAnswerDto: CreateTestUserAnswerDto) {
    return this.testUserAnswerService.create(createTestUserAnswerDto);
  }

  @Get()
  findAll() {
    return this.testUserAnswerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testUserAnswerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestUserAnswerDto: UpdateTestUserAnswerDto) {
    return this.testUserAnswerService.update(+id, updateTestUserAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testUserAnswerService.remove(+id);
  }
}
