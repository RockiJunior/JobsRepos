import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MigrationhistoryService } from './__migrationhistory.service';
import { CreateMigrationhistoryDto } from './dto/create-__migrationhistory.dto';
import { UpdateMigrationhistoryDto } from './dto/update-__migrationhistory.dto';

@Controller('--migrationhistory')
export class MigrationhistoryController {
  constructor(private readonly migrationhistoryService: MigrationhistoryService) {}

  @Post()
  create(@Body() createMigrationhistoryDto: CreateMigrationhistoryDto) {
    return this.migrationhistoryService.create(createMigrationhistoryDto);
  }

  @Get()
  findAll() {
    return this.migrationhistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.migrationhistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMigrationhistoryDto: UpdateMigrationhistoryDto) {
    return this.migrationhistoryService.update(+id, updateMigrationhistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.migrationhistoryService.remove(+id);
  }
}
