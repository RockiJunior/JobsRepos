import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { errorsCatalog } from '../../common/errors-catalog';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMINISTRADOR } from '../../common/constants';
import { RolesGuard } from '../../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    try {
      return this.eventService.findAll();
    } catch (err) {
      return {
        message: errorsCatalog.cantFindAll,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
