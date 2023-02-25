import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SysdiagramsService } from './sysdiagrams.service';
import { CreateSysdiagramDto } from './dto/create-sysdiagram.dto';
import { UpdateSysdiagramDto } from './dto/update-sysdiagram.dto';

@Controller('sysdiagrams')
export class SysdiagramsController {
  constructor(private readonly sysdiagramsService: SysdiagramsService) {}

  @Post()
  create(@Body() createSysdiagramDto: CreateSysdiagramDto) {
    return this.sysdiagramsService.create(createSysdiagramDto);
  }

  @Get()
  findAll() {
    return this.sysdiagramsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysdiagramsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSysdiagramDto: UpdateSysdiagramDto) {
    return this.sysdiagramsService.update(+id, updateSysdiagramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sysdiagramsService.remove(+id);
  }
}
