import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { User } from 'src/api/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Load } from '../entities/load.entity';
import { LoadedCoursePartner } from '../entities/loadedCoursePartner.entity';
import { LoadedPartner } from '../entities/loadedPartner.entity';
import { Course } from '../../common/database_entities/course.entity';
import { Partner } from '../../common/database_entities/partner.entity';
import { MovementTypes } from '../../common/database_entities/movement_types.entity';
import { Movements } from 'src/common/database_entities/movements.entity';
import { LoadMovement } from 'src/common/database_entities/loadMovement.entity';
import { EnumMovementsStatus } from 'src/common/constants';
import { LoadCourseToPartner } from 'src/common/database_entities/loadCourseToPartner.entity';

@Injectable()
export class LoadsService {
  constructor(
    @InjectRepository(Load) private readonly loadRepository: Repository<Load>,
    @InjectRepository(LoadedPartner) private readonly loadedPartnerRepository: Repository<LoadedPartner>,
    @InjectRepository(LoadedCoursePartner)
    private readonly loadedCoursePartnerRepository: Repository<LoadedCoursePartner>,
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>,
    @InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(MovementTypes) private readonly movementTypesRepository: Repository<MovementTypes>,
    @InjectRepository(Movements) private readonly movementsRepository: Repository<Movements>,
    @InjectRepository(LoadMovement) private readonly loadMovementRepository: Repository<LoadMovement>,
    @InjectRepository(LoadCourseToPartner)
    private readonly loadCourseToPartnerRepository: Repository<LoadCourseToPartner>,
  ) {}

  async verifyPartnersData(data: LoadedPartner[], user: User, save: boolean) {
    const schema = Joi.object({
      partnerCode: Joi.string().length(6).required(),
      leaderCode: Joi.string().length(6).required(),
      coordinationCode: Joi.number().max(999).required(),
      coordinationName: Joi.string().max(30).required(),
    });

    let validatedData: {
      validRecords: LoadedPartner[];
      invalidRecords: LoadedPartner[];
      totals: {
        accepted: number;
        rejected: number;
      };
    } = {
      validRecords: [],
      invalidRecords: [],
      totals: {
        accepted: 0,
        rejected: 0,
      },
    };

    validatedData = data.reduce((results, row) => {
      const { error } = schema.validate(row);
      if (error) {
        results.invalidRecords.push(row);
        results.totals.rejected++;
      } else {
        results.validRecords.push(row);
        results.totals.accepted++;
      }
      return results;
    }, validatedData);

    const duplicatedRecords = await this.loadedPartnerRepository.find({
      where: {
        partnerCode: In(validatedData.validRecords.map(r => r.partnerCode)),
      },
    });

    duplicatedRecords.forEach(record => {
      const validIndex = validatedData.validRecords.findIndex(
        validRecord => record.partnerCode === validRecord.partnerCode,
      );

      if (validIndex !== -1) {
        const validRecord = validatedData.validRecords[validIndex];
        validatedData.validRecords.splice(validIndex, 1);
        validatedData.invalidRecords.push(validRecord);
      }
    });

    const newLoad = this.loadRepository.create({
      type: 'weekly',
      acceptedRecords: validatedData.validRecords.length,
      rejectedRecords: validatedData.invalidRecords.length,
      loadedPartners: validatedData.validRecords,
      user,
    });

    if (!save) {
      return newLoad;
    }

    return this.loadRepository.save(newLoad);
  }

  async uploadCourseToPartnerData(data, fileName: string) {
    //For every row in the data, check if the FOLIO exists in the partners table, and if it does, check if the CURSO exists in the courses table.
    //If the FOLIO exists in the partners table, and the CURSO exists in the courses table, then create a new LoadedCoursePartner record.
    //If the FOLIO exists in the partners table, and the CURSO does not exist in the courses table, then add the value into the invalidRecords array.
    //If the FOLIO does not exist in the partners table, then add the value into the invalidRecords array.

    const invalidRecords = [];
    const validRecords = [];
    const reasonsOfRejection = [];

    const lastLoadCourseToPartner = await this.loadCourseToPartnerRepository.findOne({
      order: {
        id_load: 'DESC',
      },
    });

    const loadCourse = new LoadCourseToPartner();
    loadCourse.filename = fileName;
    loadCourse.valid_registers = 0;
    loadCourse.invalid_registers = 0;
    loadCourse.id_load = lastLoadCourseToPartner ? lastLoadCourseToPartner.id_load + 1 : 1;

    await this.loadCourseToPartnerRepository.save(loadCourse);

    for (const row of data) {
      const partner = await this.partnerRepository.findOne({ where: { folio: row.FOLIO } });
      const course = await this.courseRepository.findOne({ where: { name: row.CURSO } });

      if (partner) {
        if (course) {
          // Check if the record already exists in the database
          const loadedCoursePartner = await this.loadedCoursePartnerRepository.findOne({
            where: {
              partner: partner,
              course: course,
            },
          });

          if (loadedCoursePartner) {
            //Update the record
            loadedCoursePartner.score = row.SCORE;
            loadedCoursePartner.status = this.getStatusByScore(row.SCORE, loadedCoursePartner.status !== null);
            loadedCoursePartner.partner = partner;
            loadedCoursePartner.course = course;
            loadedCoursePartner.courseId = course.id;
            loadedCoursePartner.partnerId = partner.id;
            loadedCoursePartner.evaluationDate = new Date(row.EVALUATION_DATE);
            loadedCoursePartner.note = row.NOTES;
            loadedCoursePartner.id_load = loadCourse.id_load;
            await this.loadedCoursePartnerRepository.save(loadedCoursePartner);
          } else {
            const newLoadedCoursePartner = new LoadedCoursePartner();
            newLoadedCoursePartner.score = row.SCORE;
            newLoadedCoursePartner.status = this.getStatusByScore(row.SCORE);
            newLoadedCoursePartner.partner = partner;
            newLoadedCoursePartner.course = course;
            newLoadedCoursePartner.courseId = course.id;
            newLoadedCoursePartner.partnerId = partner.id;
            newLoadedCoursePartner.evaluationDate = new Date(row.EVALUATION_DATE);
            newLoadedCoursePartner.note = row.NOTES;
            newLoadedCoursePartner.id_load = loadCourse.id_load;

            await this.loadedCoursePartnerRepository.save(newLoadedCoursePartner);
          }
          validRecords.push(row);
        } else {
          invalidRecords.push(row);
          reasonsOfRejection.push(`Curso | ${row.CURSO} | no encontrado`);
        }
      } else {
        invalidRecords.push(row);
        reasonsOfRejection.push(`Folio | ${row.FOLIO} | no encontrado`);
      }
    }

    loadCourse.valid_registers = validRecords.length;
    loadCourse.invalid_registers = invalidRecords.length;
    await this.loadCourseToPartnerRepository.save(loadCourse);

    return {
      success: validRecords,
      id_load: loadCourse.id_load,
      failed: {
        records: invalidRecords,
        reasons: reasonsOfRejection,
      },
    };
  }

  async getLoadedCoursesToPartnerById(id_load: number) {
    const coursePartners = await this.loadedCoursePartnerRepository.find({
      relations: ['partner'],
      where: {
        id_load: id_load,
      },
    });

    // Get the name of the course from the response.courseId
    const courses = await this.courseRepository.find({
      where: {
        id: In(coursePartners.map(r => r.courseId)),
      },
    });

    // Set the name of the course in the response

    const response = [];
    coursePartners.forEach(r => {
      const objectResponse = {
        ...r,
        courseName: courses.find(c => c.id === r.courseId).name,
        folio: r.partner.folio,
      };
      delete objectResponse.partner;
      response.push(objectResponse);
    });
    return response;
  }

  async markAsDeletedCoursesToPartner(id_load: number) {
    const loadedCourses = await this.loadedCoursePartnerRepository.find({
      where: {
        id_load: id_load,
      },
    });

    const load = await this.loadCourseToPartnerRepository.findOne({
      where: {
        id_load: id_load,
        is_deleted: false,
      },
    });

    if (!load) {
      throw new BadRequestException('No se encontró la carga ' + id_load);
    }

    //Mark loaded courses as deleted
    for (const loadedCourse of loadedCourses) {
      loadedCourse.is_deleted = true;
      await this.loadedCoursePartnerRepository.save(loadedCourse);
    }

    //Mark load as deleted
    load.is_deleted = true;
    await this.loadCourseToPartnerRepository.save(load);

    return {
      success: true,
      message: 'Carga eliminada correctamente',
      amount: loadedCourses.length,
    };
  }

  getStatusByScore(score: number, hasPreviousStatus?: boolean) {
    if (!score && !hasPreviousStatus) {
      return 0;
    } else if (score > 8) {
      return 1;
    } else {
      return 2;
    }
  }

  async uploadMovementsData(data, fileName: string) {
    //For every row in the data, check if partner folio exists in the partners table, and if it does, check if the type_movement exists in the movement_types table.
    //If the partner exists in the partners table, and the type_movement exists in the movement_types table, then create a new Movement record.
    //If the partner exists in the partners table, and the type_movement does not exist in the movement_types table, then add the value into the invalidRecords array.
    //If the partner does not exist in the partners table, then add the value into the invalidRecords array.

    const invalidRecords = [];
    const validRecords = [];
    const reasonsOfRejection = [];

    //Get the last load movement if exists and gets its id
    const lastLoadMovement = await this.loadMovementRepository.findOne({
      order: {
        id_load: 'DESC',
      },
    });
    const loadMovement = new LoadMovement();
    loadMovement.filename = fileName;
    loadMovement.valid_registers = 0;
    loadMovement.invalid_registers = 0;
    loadMovement.id_load = lastLoadMovement ? lastLoadMovement.id_load + 1 : 1;

    await this.loadMovementRepository.save(loadMovement);

    for (const row of data) {
      const partner = await this.partnerRepository.findOne({ where: { folio: row.FOLIO } });
      const movementType = await this.movementTypesRepository.findOne({ where: { name: row.TYPE_MOVEMENT } });
      if (partner) {
        if (movementType) {
          try {
            const newMovement = new Movements();
            newMovement.partner = partner;
            newMovement.movement_types = movementType;
            newMovement.amount = row.AMOUNT;
            newMovement.quantity = row.QUANTITY;
            newMovement.movement_types = movementType;
            newMovement.status = row.STATUS === 'APPLIED' ? EnumMovementsStatus.APPLIED : EnumMovementsStatus.PENDING;
            newMovement.date_movement = new Date(row.DATE);
            newMovement.id_load = loadMovement.id_load;
            newMovement.folio = row.FOLIO;

            await this.movementsRepository.save(newMovement);
            validRecords.push(row);
          } catch (error) {
            invalidRecords.push(row);
            reasonsOfRejection.push(`Error al guardar movimiento | ${error}`);
          }
        } else {
          invalidRecords.push(row);
          reasonsOfRejection.push(`Tipo de movimiento | ${row.TYPE_MOVEMENT} | no encontrado`);
        }
      } else {
        invalidRecords.push(row);
        reasonsOfRejection.push(`Folio | ${row.FOLIO} | no encontrado`);
      }
    }

    loadMovement.valid_registers = validRecords.length;
    loadMovement.invalid_registers = invalidRecords.length;
    await this.loadMovementRepository.save(loadMovement);
    return {
      success: validRecords,
      id_load: loadMovement.id_load,
      failed: {
        records: invalidRecords,
        reasons: reasonsOfRejection,
      },
    };
  }

  async getLoadsCoursesToPartner() {
    return this.loadCourseToPartnerRepository.find({
      where: {
        is_deleted: false,
      },
      order: {
        id_load: 'DESC',
      },
    });
  }

  async getLoadsMovements() {
    const loads = await this.loadMovementRepository.find({
      where: {
        is_deleted: false,
      },
      order: {
        id_load: 'DESC',
      },
    });
    return loads;
  }

  async getLoadMovementsById(id_load) {
    const movements = await this.movementsRepository.find({
      where: {
        id_load: id_load,
      },
    });

    const response = [];

    for (const movement of movements) {
      const partner = await this.partnerRepository.findOne({
        where: {
          id: movement.partnerId,
        },
      });
      response.push({ ...movement, folio: partner.folio });
    }
    return response;
  }

  async markAsDeletedMovements(id_load) {
    const movements = await this.movementsRepository.find({
      where: {
        id_load: id_load,
      },
    });

    const load = await this.loadMovementRepository.findOne({
      where: {
        id_load: id_load,
        is_deleted: false,
      },
    });

    if (!load) {
      throw new BadRequestException('No se encontró la carga ' + id_load);
    }

    //Check if there are movements in the load with status APPLIED
    for (const movement of movements) {
      if (movement.status === EnumMovementsStatus.APPLIED) {
        throw new BadRequestException(
          'Se encuentra algún movimiento aplicado dentro de la carga, no fue posible eliminar',
        );
      }
    }

    //Mark as deleted all movements in the load
    for (const movement of movements) {
      movement.is_deleted = true;
      await this.movementsRepository.save(movement);
    }

    //Mark the load as deleted
    load.is_deleted = true;
    await this.loadMovementRepository.save(load);

    return {
      success: true,
      amount: movements.length,
      message: 'Movimientos marcados como eliminados',
    };
  }
}
