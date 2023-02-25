import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ControlaccessTagService } from './controlaccess-tag.service';
import { CreateControlaccessTagDto } from './dto/create-controlaccess-tag.dto';
import { UpdateControlaccessTagDto } from './dto/update-controlaccess-tag.dto';

@Controller('controlaccess-tag')
export class ControlaccessTagController {
  constructor(private readonly controlaccessTagService: ControlaccessTagService) {}

  @Post()
  create(@Body() createControlaccessTagDto: CreateControlaccessTagDto) {
    return this.controlaccessTagService.create(createControlaccessTagDto);
  }

  @Get()
  findAll() {
    return this.controlaccessTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.controlaccessTagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateControlaccessTagDto: UpdateControlaccessTagDto) {
    return this.controlaccessTagService.update(+id, updateControlaccessTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.controlaccessTagService.remove(+id);
  }
}
