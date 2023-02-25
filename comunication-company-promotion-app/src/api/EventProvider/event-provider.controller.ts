import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventProviderService } from './event-provider.service';
import { CreateEventProviderDto } from './dto/create-event-provider.dto';
import { UpdateEventProviderDto } from './dto/update-event-provider.dto';

@Controller('event-provider')
export class EventProviderController {
  constructor(private readonly eventProviderService: EventProviderService) {}

  @Post()
  create(@Body() createEventProviderDto: CreateEventProviderDto) {
    return this.eventProviderService.create(createEventProviderDto);
  }

  @Get()
  findAll() {
    return this.eventProviderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventProviderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventProviderDto: UpdateEventProviderDto) {
    return this.eventProviderService.update(+id, updateEventProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventProviderService.remove(+id);
  }
}
