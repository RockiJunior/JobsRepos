import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompletedUserPodcastService } from './completed-user-podcast.service';
import { CreateCompletedUserPodcastDto } from './dto/create-completed-user-podcast.dto';
import { UpdateCompletedUserPodcastDto } from './dto/update-completed-user-podcast.dto';
import { errorsCatalog } from '../../common/errors-catalog';

@Controller('completed-user-podcast')
export class CompletedUserPodcastController {
  constructor(
    private readonly completedUserPodcastService: CompletedUserPodcastService,
  ) {}

  @Post()
  create(@Body() createCompletedUserPodcastDto: CreateCompletedUserPodcastDto) {
    try {
      return this.completedUserPodcastService.create(
        createCompletedUserPodcastDto,
      );
    } catch (err) {
      return {
        message: errorsCatalog.cantCreate,
        err,
      };
    }
  }

  @Get()
  findAll() {
    try {
      return this.completedUserPodcastService.findAll();
    } catch (err) {
      return {
        message: errorsCatalog.cantFindAll,
        err,
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.completedUserPodcastService.findOne(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantFindOne,
        err,
      };
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompletedUserPodcastDto: UpdateCompletedUserPodcastDto,
  ) {
    try {
      return this.completedUserPodcastService.update(
        id,
        updateCompletedUserPodcastDto,
      );
    } catch (err) {
      return {
        message: errorsCatalog.cantUpdate,
        err,
      };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.completedUserPodcastService.remove(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantFindOne,
        err,
      };
    }
  }
}
