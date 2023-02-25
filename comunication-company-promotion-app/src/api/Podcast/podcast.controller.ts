import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ADMINISTRADOR } from '../../common/constants';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { errorsCatalog } from '../../common/errors-catalog';
import { Request } from 'express';
import { HttpStatus } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@ApiTags('podcast')
@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Upload Podcast',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreatePodcastDto,
    description: 'Success Response',
  })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'image',
          maxCount: 1,
        },
        {
          name: 'audio',
          maxCount: 1,
        },
      ],
      {
        dest: `${process.env.FILE_STORAGE}/podcast`,
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFiles() files: CreatePodcastDto,
    @Body() data: CreatePodcastDto,
    @Req() req: Request,
  ) {
    try {
      const user = req['user'];
      return this.podcastService.create(data, files, user);
    } catch (err) {
      return {
        message: errorsCatalog.cantCreate,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update Podcast',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdatePodcastDto,
    description: 'Success Response',
  })
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'image',
          maxCount: 1,
        },
        {
          name: 'audio',
          maxCount: 1,
        },
      ],
      {
        dest: `${process.env.FILE_STORAGE}/podcast`,
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  update(
    @UploadedFiles() files: UpdatePodcastDto,
    @Body() data: UpdatePodcastDto,
    @Param('id') id: string,
  ) {
    try {
      return this.podcastService.update(files, data, id);
    } catch (err) {
      return {
        message: errorsCatalog.cantUpdate,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Gets a podcast by status on true',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findByStatus() {
    try {
      return this.podcastService.findByStatus();
    } catch (err) {
      return {
        message: errorsCatalog.cantFindOne,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Gets a podcast',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.podcastService.findOne(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantFindOne,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Removes Podcast',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.podcastService.remove(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantRemove,
        err,
      };
    }
  }
}
