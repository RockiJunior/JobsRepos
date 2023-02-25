import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsociadoStatus, EnumCoursesStatus } from 'src/common/constants';
import { CourseToPartner } from 'src/common/database_entities/coursePartner.entity';
import { Partner } from 'src/common/database_entities/partner.entity';
import { Repository, Between } from 'typeorm';
import { Course } from '../../common/database_entities/course.entity';
import { CreateCourseDto, UpdateCourseDto } from './dtos/courses.dto';
import { DateTime } from 'luxon';
import { BadRequestException } from '../../config/exceptions/bad.request.exception';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Partner) private partnerRepository: Repository<Partner>,
    @InjectRepository(CourseToPartner) private courseToPartnerRepo: Repository<CourseToPartner>,
    private readonly mailerService: MailerService,
  ) {}

  async findAll() {
    const courses = await this.courseRepository.find();
    const current_date = Date.now();
    for (let course of courses) {
      if (course.validityDate.getTime() <= current_date) {
        (course.status = 'No vigente'),
          await this.courseRepository.update(course.id, {
            status: 'No vigente',
          });
      }
    }
    return courses;
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new NotFoundException(`El curso con id ${id} no existe`);
    }
    return course;
  }

  async create(payload: any) {
    const validityDateCourse = DateTime.fromJSDate(payload.validityDate).toFormat('yyyy-MM-dd');
    if (validityDateCourse <= DateTime.local().toFormat('yyyy-MM-dd')) {
      throw new BadRequestException('400', 'La fecha de vigencia no puede ser igual o menor a la actual');
    }
    const newCourse = this.courseRepository.create(payload);
    // await this.courseRepository.save(newCourse);
    const notInitialPartners = await this.partnerRepository.find({
      // status 1 al 6 incluido; sin los rechazados
      relations: ['courseToPartner'],
      where: {
        status: Between(AsociadoStatus.CREATED, AsociadoStatus.REJECTED),
      },
    });

    const initialPartners = await this.partnerRepository.find({
      // status del 1 al 4
      relations: ['courseToPartner'],
      where: {
        status: Between(AsociadoStatus.CREATED, AsociadoStatus.REJECTED),
      },
    });

    if (payload.initial === true) {
      for (let partner of initialPartners) {
        if (partner.status < AsociadoStatus.ACTIVE) {
          const course_created = this.courseToPartnerRepo.create({
            partner: partner,
            course: newCourse,
            status: EnumCoursesStatus.PENDING,
            evaluationDate: payload.validityDate,
          });
          // await this.courseToPartnerRepo.save(course_created).then(async () => {
          //   try {
          //     await this.mailerService.sendMail({
          //       to: partner.email,
          //       subject: 'Cursos a realizar.',
          //       text: `Ingresa al siguiente enlace para realizar el curso requerido para completar la afiliación al programa Asociados:`,
          //       html: `<b>Ingresa al siguiente enlace para realizar el curso requerido para completar la afiliación al programa Asociados: <a href="${newCourse.url}">${newCourse.name}</a></b>`,
          //     });
          //   } catch (err) {
          //     return err;
          //   }
          // });
        }
      }
      return {
        message: 'curso creado con éxito',
      };
    } else {
      // for (let partner of initialPartners) {
      //   if (partner.status === AsociadoStatus.ACTIVE) {
      //     const course_created = this.courseToPartnerRepo.create({
      //       partner: partner,
      //       course: newCourse,
      //       status: EnumCoursesStatus.PENDING,
      //       evaluationDate: payload.validityDate,
      //     });
      //     await this.courseToPartnerRepo.save(course_created).then(async () => {
      //       try {
      //         await this.mailerService.sendMail({
      //           to: partner.email,
      //           subject: 'Cursos a realizar.',
      //           text: `Ingresa al siguiente enlace para realizar el curso requerido para completar la afiliación al programa Asociados:`,
      //           html: `<b>Ingresa al siguiente enlace para realizar el curso requerido para completar la afiliación al programa Asociados: <a href="${newCourse.url}">${newCourse.name}</a></b>`,
      //         });
      //       } catch (err) {
      //         return err;
      //       }
      //     });
      //   }
      // }
      // return {
      //   message: 'curso creado con éxito',
      // };
    }

    // if (payload.initial === false) {
    //   for (let partner of notInitialPartners) {
    //     const course_created = this.courseToPartnerRepo.create({
    //       partner: partner,
    //       course: newCourse,
    //       status: EnumCoursesStatus.PENDING,
    //       evaluationDate: payload.validityDate,
    //     });
    //     await this.courseToPartnerRepo.save(course_created);
    //   }
    //   return {
    //     message: 'curso creado con éxito',
    //   };
    // }
  }

  async update(id: number, changes: any) {
    const course = await this.findOne(id);
    this.courseRepository.merge(course, changes);
    const all_partner = await this.partnerRepository.find({ relations: ['courseToPartner'] });
    const all_partner_filtered = all_partner.filter(
      el => el.status >= AsociadoStatus.ONBOARDING && el.status < AsociadoStatus.REJECTED,
    );
    for (let partner of all_partner_filtered) {
      const course_exists = partner.courseToPartner.find(el => el.courseId === id);

      if (!course_exists) {
        const course_created = this.courseToPartnerRepo.create({
          partner: partner,
          course: course,
          status: EnumCoursesStatus.PENDING,
          evaluationDate: changes.validityDate,
        });
        await this.courseToPartnerRepo.save(course_created);
      }
    }
    return this.courseRepository.update(id, course);
  }

  remove(id: number) {
    return this.courseRepository.delete(id);
  }

  async updateValidity() {
    const courses = await this.courseRepository.find();
    const current_date = Date.now();
    for (let course of courses) {
      if (course.validityDate.getTime() <= current_date) {
        await this.courseRepository.update(course.id, {
          status: 'No vigente',
        });
      }
    }
  }
}
