import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ControlaccessdatesService } from './controlaccessdates.service';
import { CreateControlaccessdateDto } from './dto/create-controlaccessdate.dto';
import { UpdateControlaccessdateDto } from './dto/update-controlaccessdate.dto';

@Controller('controlaccessdates')
export class ControlaccessdatesController {
  constructor(
    private readonly controlaccessdatesService: ControlaccessdatesService,
  ) {}

  @Post()
  create(@Body() createControlaccessdateDto: CreateControlaccessdateDto) {
    return this.controlaccessdatesService.create(createControlaccessdateDto);
  }

  @Get()
  findAll() {
    return this.controlaccessdatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.controlaccessdatesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateControlaccessdateDto: UpdateControlaccessdateDto,
  ) {
    return this.controlaccessdatesService.update(
      +id,
      updateControlaccessdateDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.controlaccessdatesService.remove(+id);
  }
}
