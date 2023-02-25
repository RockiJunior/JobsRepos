import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Survey } from '../Survey/entities/survey.entity';
import { CourseSurvey } from '../CourseSurvey/entities/course-survey.entity';
import { Document } from '../Documents/entities/document.entity';
import { CourseByIdResponseDto } from './dto/course-by-id-response.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(CourseSurvey)
    private readonly courseSurveyRepository: Repository<CourseSurvey>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    if (!createCourseDto.name) {
      throw new BadRequestException(
        'El campo "nombre" del curso es obligatorio.',
      );
    }
    const course = this.courseRepository.create({
      IdCourse: uuid(),
      KeyCourse: createCourseDto.name,
      Active: true,
    });
    await this.courseRepository.save(course);
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async findAll() {
    const result = await this.courseRepository.find();
    return result;
  }

  async findOne(id: string) {
    const courseFinded = await this.courseRepository.findOne({
      where: {
        IdCourse: id,
      },
    });
    return courseFinded;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const { name } = updateCourseDto;
    await this.courseRepository.update(id, {
      KeyCourse: name,
    });
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  async remove(id: string) {
    await this.courseRepository.update(id, {
      Active: false,
      Modified: new Date(),
    });
    return {
      message: 'Operación realizada correctamente.',
    };
  }

  //Get documents and retro (survey) from course
  async getDocumentsByCourse(id_course: string) {
    const course_found = await this.courseRepository.findOne({
      where: { IdCourse: id_course },
      relations: ['survey'],
    });
    console.log({ course_found });

    if (!course_found) {
      throw new NotFoundException();
    }

    const course_survey_found = await this.courseSurveyRepository.find({
      where: {
        course: course_found,
      },
    });

    const documents: Document[] = [];
    for (let elem of course_survey_found) {
      const document = await this.documentRepository.findOne({
        where: {
          IdDocument: elem.SurveyDocumentId,
        },
      });
      documents.push(document);
    }

    const response = new CourseByIdResponseDto(documents, course_found.survey);
    return response;
  }
}
