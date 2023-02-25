import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OldUserPasswordService } from './old-user-password.service';
import { CreateOldUserPasswordDto } from './dto/create-old-user-password.dto';
import { UpdateOldUserPasswordDto } from './dto/update-old-user-password.dto';

@Controller('old-user-password')
export class OldUserPasswordController {
  constructor(private readonly oldUserPasswordService: OldUserPasswordService) {}

  @Post()
  create(@Body() createOldUserPasswordDto: CreateOldUserPasswordDto) {
    return this.oldUserPasswordService.create(createOldUserPasswordDto);
  }

  @Get()
  findAll() {
    return this.oldUserPasswordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oldUserPasswordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOldUserPasswordDto: UpdateOldUserPasswordDto) {
    return this.oldUserPasswordService.update(+id, updateOldUserPasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oldUserPasswordService.remove(+id);
  }
}
