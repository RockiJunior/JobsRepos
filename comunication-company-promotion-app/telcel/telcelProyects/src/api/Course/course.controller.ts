import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { HttpStatus } from '@nestjs/common';
import { errorsCatalog } from '../../common/errors-catalog';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ADMINISTRADOR } from '../../common/constants';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Creates new course',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateCourseDto,
    description: 'Success Response',
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createCourseDto: CreateCourseDto) {
    try {
      return this.courseService.create(createCourseDto);
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
    summary: 'Gets all courses',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    description: 'Success Response',
  })
  @Get()
  findAll() {
    try {
      return this.courseService.findAll();
    } catch (err) {
      return {
        message: errorsCatalog.cantFindAll,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get a specific course',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.courseService.findOne(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantFindOne,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Updates a specific course',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateCourseDto,
    description: 'Success Response',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    try {
      return this.courseService.update(id, updateCourseDto);
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
    summary: 'Remove a specific course',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.courseService.remove(id);
    } catch (err) {
      return {
        message: errorsCatalog.cantRemove,
        err,
      };
    }
  }

  @Roles(ADMINISTRADOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('documents-by-course/:courseId')
  @ApiResponse({
    description: 'Get all documents that belongs to the document',
    status: HttpStatus.OK,
    // type:
  })
  getDocumentsByCourse(@Param('courseId') course_id: string) {
    return this.courseService.getDocumentsByCourse(course_id);
  }
}
