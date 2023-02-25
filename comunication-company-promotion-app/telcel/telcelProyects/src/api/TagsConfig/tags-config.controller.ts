import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagsConfigService } from './tags-config.service';
import { CreateTagsConfigDto } from './dto/create-tags-config.dto';
import { UpdateTagsConfigDto } from './dto/update-tags-config.dto';

@Controller('tags-config')
export class TagsConfigController {
  constructor(private readonly tagsConfigService: TagsConfigService) {}

  @Post()
  create(@Body() createTagsConfigDto: CreateTagsConfigDto) {
    return this.tagsConfigService.create(createTagsConfigDto);
  }

  @Get()
  findAll() {
    return this.tagsConfigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsConfigService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagsConfigDto: UpdateTagsConfigDto) {
    return this.tagsConfigService.update(+id, updateTagsConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsConfigService.remove(+id);
  }
}
