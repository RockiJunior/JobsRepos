import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ControlaccessService } from './controlaccess.service';
import { CreateControlaccessDto } from './dto/create-controlaccess.dto';
import { UpdateControlaccessDto } from './dto/update-controlaccess.dto';

@Controller('controlaccess')
export class ControlaccessController {
  constructor(private readonly controlaccessService: ControlaccessService) {}

  @Post()
  create(@Body() createControlaccessDto: CreateControlaccessDto) {
    return this.controlaccessService.create(createControlaccessDto);
  }

  @Get()
  findAll() {
    return this.controlaccessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.controlaccessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateControlaccessDto: UpdateControlaccessDto) {
    return this.controlaccessService.update(+id, updateControlaccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.controlaccessService.remove(+id);
  }
}
