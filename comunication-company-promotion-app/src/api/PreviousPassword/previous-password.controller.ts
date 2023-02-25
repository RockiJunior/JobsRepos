import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreviousPasswordService } from './previous-password.service';
import { CreatePreviousPasswordDto } from './dto/create-previous-password.dto';
import { UpdatePreviousPasswordDto } from './dto/update-previous-password.dto';

@Controller('previous-password')
export class PreviousPasswordController {
  constructor(private readonly previousPasswordService: PreviousPasswordService) {}

  @Post()
  create(@Body() createPreviousPasswordDto: CreatePreviousPasswordDto) {
    return this.previousPasswordService.create(createPreviousPasswordDto);
  }

  @Get()
  findAll() {
    return this.previousPasswordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.previousPasswordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreviousPasswordDto: UpdatePreviousPasswordDto) {
    return this.previousPasswordService.update(+id, updatePreviousPasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.previousPasswordService.remove(+id);
  }
}
