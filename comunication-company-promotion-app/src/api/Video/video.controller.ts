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
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { errorsCatalog } from '../../common/errors-catalog';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ADMINISTRADOR } from '../../common/constants';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request } from 'express';
import { HttpStatus } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@ApiTags('video')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Upload Video',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateVideoDto,
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
          name: 'video',
          maxCount: 1,
        },
      ],
      {
        dest: `${process.env.FILE_STORAGE}/video`,
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFiles() files: CreateVideoDto,
    @Body() data: CreateVideoDto,
    @Req() req: Request,
  ) {
    try {
      const user = req['user'];
      console.log(req['user']);
      return this.videoService.create(data, files, user);
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
    summary: 'Gets a video by status on true',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Get()
  async findByStatus() {
    try {
      return this.videoService.findByStatus();
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
    summary: 'Gets a specific video',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.videoService.findOne(id);
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
    summary: 'Update Video',
  })
  @ApiResponse({
    status: HttpStatus.OK,
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
          name: 'video',
          maxCount: 1,
        },
      ],
      {
        dest: `${process.env.FILE_STORAGE}/video`,
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  update(
    @UploadedFiles() files: UpdateVideoDto,
    @Body() data: UpdateVideoDto,
    @Param('id') id: string,
  ) {
    try {
      return this.videoService.update(files, data, id);
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
    summary: 'Remove Video',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.videoService.remove(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantRemove,
        err,
      };
    }
  }
}
