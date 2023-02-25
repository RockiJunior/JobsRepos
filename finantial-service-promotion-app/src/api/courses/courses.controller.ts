import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CourseService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dtos/courses.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EnumApplicationsType } from '../../common/constants';
import { ExceptionResponseError } from 'src/config/exceptions/dto/exceptions.response.errors';
import { UserGuard } from 'src/auth/guards/users.guard';
@UseGuards(JwtAuthGuard)
@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  //Ruta para obtener los cursos desde cms
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Gets all courses',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  //Obtener un curso por id desde cms
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Gets a specific course by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  //Crear un curso desde cms
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Creates a new course',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Post()
  create(@Body() payload: any) {
    return this.courseService.create(payload);
  }

  //Actualizar un curso desde cms
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Updates a specific course',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateCourseDto) {
    return this.courseService.update(id, payload);
  }

  //Eliminar un curso desde cms
  @Roles(EnumApplicationsType.SUPERADMIN)
  @UseGuards(RolesGuard, UserGuard)
  @ApiOperation({
    summary: 'Removes a specific course',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'It only returns a status OK.' })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.remove(+id);
  }

  @Get('update-validity-courses')
  updateValidityCourses() {
    return this.courseService.updateValidity();
  }
}
