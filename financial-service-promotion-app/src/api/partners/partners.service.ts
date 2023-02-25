import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
const { FINCOMUN_API, FILES_HOST } = process.env;
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import {
  UpdateBankAccountDTO,
  UpdateBankAccountFileDTO,
  UpdateCoursesStatusDto,
  UpdatePartnerFileStatusDto,
} from './dtos/partner.dto';
import { Partner } from '../../common/database_entities/partner.entity';
import { CourseToPartner } from 'src/common/database_entities/coursePartner.entity';
import { Course } from 'src/common/database_entities/course.entity';
import Axios from 'axios';
import * as _ from 'lodash';
import {
  AsociadoStatus,
  EnumApplicationsType,
  EnumCoursesStatus,
  EnumFilesStatusType,
  EnumRankPartnerIndividual,
} from 'src/common/constants';
import * as fs from 'fs';
import config from '../../config';

import { BankAccountEntity } from 'src/common/database_entities/bankAccount.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { PartnerFile } from 'src/common/database_entities/partnerFile.entity';
import { PartnerChanged } from '../../common/database_entities/partner_changed.entity';
import { RankingPartnersIndiv } from '../../common/database_entities/rankingPartnersIndiv.entity';
import { DateTime } from 'luxon';
import { RejectPartnerDto } from './dtos/partner.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { Roles } from 'src/common/database_entities/roles.entity';
import { ReferredEntity } from '../../common/database_entities/referred.entity';

@Injectable()
export class PartnersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(PartnerFile) private readonly partnerFileRepository: Repository<PartnerFile>,
    @InjectRepository(ReferredEntity) private readonly referredRepository: Repository<ReferredEntity>,
    @InjectRepository(CourseToPartner) private readonly courseToPartner: Repository<CourseToPartner>,
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>,
    @InjectRepository(BankAccountEntity) private readonly bankAccountRepository: Repository<BankAccountEntity>,
    @InjectRepository(Sessions) private readonly sessionsRepository: Repository<Sessions>,
    private readonly mailerService: MailerService,
    @InjectRepository(PartnerChanged) private readonly partnerChangedRepository: Repository<PartnerChanged>,
    @InjectRepository(RankingPartnersIndiv) private readonly rankingPartnersIndiv: Repository<RankingPartnersIndiv>,
    @InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>,
  ) {}

  async getNumberOfActualWeek() {
    return DateTime.local().weekNumber;
  }

  generateVerificationToken() {
    return Math.round(Math.random() * 1000000).toString();
  }

  async findAll({ status }) {
    const query = {
      where: {},
    };

    if (status) {
      query.where = Object.assign(query.where, {
        status: status,
      });
    }

    const aux = await this.partnerRepository.find({
      relations: ['territory'],
      where: query.where,
    });
    return aux.length > 0 ? aux : { message: 'No existen usuarios con el status enviado.' };
  }

  async getCourseNameById(values) {
    const courses = await getRepository(Course).createQueryBuilder('courses').getMany();
    const nameCourse = id =>
      courses.filter(obj => {
        return obj.id === id;
      });

    const output = values.map(item => {
      const { name, url, type } = _.first(nameCourse(item.courseId));
      item.courseName = name;
      item.course_url = url;
      item.course_type = type;
      return item;
    });
    return output;
  }

  async findOne(id: number, payload?: any) {
    const result = await this.partnerRepository.findOne(id, {
      relations: [
        'files',
        'courseToPartner',
        'courseToPartner.course',
        'bankAccount',
        'sessions',
        'movements',
        'reports',
      ],
    });
    const multiple_bank = await this.bankAccountRepository.findOne({ where: { isUsedFor: result.id } });

    if (!result) {
      throw new NotFoundException(`El asociado con id ${id} no existe`);
    }

    result.createdAt = DateTime.fromJSDate(result.createdAt).toFormat('yyyy-MM-dd');
    result.updatedAt = DateTime.fromJSDate(result.updatedAt).toFormat('yyyy-MM-dd');
    result.dischargeDate ? DateTime.fromJSDate(result.dischargeDate).toFormat('dd-MM-yyyy') : null;

    // const filteredChangedDateResult = result.courseToPartner.filter(
    //   el => el.course.validityDate > DateTime.local().toJSDate(),
    // );

    const changedDateResult = (): any => {
      const changedDateResult = result.courseToPartner.map(el => {
        let isValid = el.course.validityDate;
        let expired: boolean = false;
        let currentDate = new Date();
        if (currentDate >= isValid) {
          expired = true;
        }
        return {
          id: el.id,
          courseName: el.course.name,
          course_type: el.course.type,
          score: el.score,
          status: el.status,
          note: el.note,
          initial: el.course.initial,
          validityDate: el.course.validityDate,
          expired: expired,
          courseId: el.courseId,
          partnerId: result.id,
          evaluationDate: DateTime.fromJSDate(el.evaluationDate).toFormat('yyyy-MM-dd'),
          createdAt: DateTime.fromJSDate(el.createdAt).toFormat('yyyy-MM-dd'),
          updatedAt: DateTime.fromJSDate(el.createdAt).toFormat('yyyy-MM-dd'),
        };
      });
      return changedDateResult;
    };

    if (!_.isEmpty(result.files)) {
      //Agregamos la Ruta Publica a Files
      for (const item of result.files) {
        item.path = `${process.env.FILES_HOST}/${item.path}`;
      }

      const files = result.files;
      const [a, b, c, ...filesUpdated] = files;
      //Separamos los contratos
      const contracts = {
        affiliationContract: a.path,
        privacyNotice: b.path,
        confidentialityNotice: c.path,
      };
      result.contracts = contracts;
      result.files = filesUpdated;
    }
    if (multiple_bank) {
      result.bankAccount['provisory_accountNumber'] = multiple_bank.accountNumber;
      result.bankAccount['provisory_clabe'] = multiple_bank.clabe;
      result.bankAccount['provisory_name'] = multiple_bank.name;
    }
    result.courseToPartner = [...changedDateResult()];

    switch (payload.role) {
      case 'PAYER':
        result.courseToPartner = [];
        return result;
      case 'COORDINATION':
        result.files = [];
        result.contracts = {};
        return result;
      case 'INFORMATION':
        result.name = '';
        result.birthDate = '';
        result.birthPlace = '';
        result.motherLastName = '';
        result.lastName = '';
        result.nationality = '';
        result.age = '';
        result.civilStatus = '';
        result.gender = '';
        result.mobileNumber = '';
        result.rfc = '';
        result.curp = '';
        result.email = '';
        result.status = 0;
        result.dischargeDate = new Date();
        result.street = '';
        result.externalNumber = '';
        result.internalNumber = '';
        result.colony = '';
        result.municipality = '';
        result.state = '';
        result.zipcode = '';
        result.week = 0;
        result.folio = '0000000';
        result.alphanumeric = '';
        result.rejectedReason = '';
        result.preAffiliationId = '';
        result.courseToPartner = [];
        result.files = [];
        result.contracts = {};
        return result;
      case 'SUPERADMIN':
        return result;
      default:
        return result;
    }
  }

  async findOneGuard(id: number, token: string) {
    const result = await this.partnerRepository.findOne(id, {
      relations: ['files', 'courseToPartner', 'bankAccount', 'sessions', 'sessions.role', 'movements', 'reports'],
    });

    if (result.sessions && result.sessions.accessToken === token.slice(7)) {
      result.courseToPartner = await this.getCourseNameById(result.courseToPartner);
      if (!result) {
        throw new NotFoundException(`El asociado con id ${id} no existe`);
      }
      if (!_.isEmpty(result.files)) {
        //Agregamos la Ruta Publica a Files
        for (const item of result.files) {
          item.path = `${process.env.FILES_HOST}/${item.path}`;
        }

        const files = result.files;
        const [a, b, c, ...filesUpdated] = files;
        //Separamos los contratos
        const contracts = {
          affiliationContract: a.path,
          privacyNotice: b.path,
          confidentialityNotice: c.path,
        };
        result.contracts = contracts;
        result.files = filesUpdated;
      }
      return {
        result,
      };
    } else {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        statusCode: 401,
        message: 'Solo puedes tener una sesión activa, por favor vuelva a iniciar sesión',
      });
    }
  }

  async findByEmail(email: string) {
    try {
      const partnerFound = await this.partnerRepository.findOne({
        where: { email: email },
        relations: ['files', 'sessions', 'sessions.role'],
      });
      return partnerFound;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  updateFilStatus(partner: Partner, fileId: number, payload: UpdatePartnerFileStatusDto) {
    const fileIndex = (partner.files || []).findIndex(file => file.id === fileId);

    if (fileIndex === -1) {
      throw new NotFoundException(
        `El documento con id ${fileId} no existe en los documentos del asociado con id ${partner.id}`,
      );
    }

    const { status, rejectedStatus } = payload;

    partner.files[fileIndex].status = status;

    if (status === '2') {
      partner.files[fileIndex].rejectedStatus = rejectedStatus;
    }

    return this.partnerRepository.save(partner);
  }

  async updateCourseStatus(idCourse: number, idPartner: number, update: UpdateCoursesStatusDto) {
    const courseFound = await this.courseToPartner.findOne({
      relations: ['course'],
      where: { courseId: idCourse, partner: idPartner },
    });
    console.log(courseFound);
    const evaluationDate = update.evaluationDate.split('/').map(el => parseInt(el));
    const date = new Date(evaluationDate[2], evaluationDate[1] - 1, evaluationDate[0]);
    const obj = {
      status: update.status ? update.status : EnumCoursesStatus.PENDING,
      score: update.score ? update.score : null,
      note: update.note ? update.note : '',
      evaluationDate: update.evaluationDate ? date : null,
    };
    const partnerFound = await this.partnerRepository.findOne({
      where: { id: idPartner },
      relations: ['courseToPartner', 'courseToPartner.course'],
    });
    const initialCoursesNotCompleted = partnerFound.courseToPartner.filter(
      el =>
        el.course.initial === true &&
        el.status !== EnumCoursesStatus.APPROVED &&
        el.course.validityDate > DateTime.local().toJSDate(),
    );
    const notInitialCoursesNotCompleted = partnerFound.courseToPartner.filter(
      el =>
        el.course.initial === false &&
        el.status !== EnumCoursesStatus.APPROVED &&
        el.course.validityDate > DateTime.local().toJSDate(),
    );

    const files = await this.partnerFileRepository.find({
      where: { partnerId: partnerFound.id },
    });
    const withOoutContracts = files.slice(3);
    const partnerFilesNotCompleted = withOoutContracts.filter(el => el.status !== EnumFilesStatusType.ACCEPTED);
    // primero nos fijamos si el payload viene como rechazado, si es asi,
    // actualizamos el curso y enviamos el mensaje de curso actualizado
    // si todos los archivos estan aprobados, entonces entro al if... y luego
    // nos fijamos que alla mas de 1 o solo 1, si es así, entonces actualizamos el partner con un status 4,
    // y tambien actualizzamos el courseToPartner
    // sino todos los archivos del partner no estan aprobados, entonces lanza un error 400.
    if (partnerFilesNotCompleted.length === 0) {
      if (initialCoursesNotCompleted.length === 1 && courseFound.course.initial === true) {
        await this.courseToPartner.update(courseFound.id, obj);
        await this.partnerRepository.update(idPartner, { status: AsociadoStatus.TRAINING_COMPLETED });
        return { message: 'Cursos obligatorios finalizados exitosamente.' };
      }
      if (initialCoursesNotCompleted.length > 1 && courseFound.course.initial === true) {
        await this.courseToPartner.update(courseFound.id, obj);
        await this.partnerRepository.update(idPartner, { status: AsociadoStatus.TRAINING_PENDING });
        return { message: 'Curso actualizado' };
      }
      if (notInitialCoursesNotCompleted.length === 1 && courseFound.course.initial === false) {
        await this.courseToPartner.update(courseFound.id, obj);
        await this.partnerRepository.update(idPartner, { status: AsociadoStatus.TRAINING_COMPLETED });
        return { message: 'Cursos opcionales finalizados exitosamente.' };
      }
      if (notInitialCoursesNotCompleted.length > 1 && courseFound.course.initial === false) {
        console.log('entrando al primer if');
        await this.courseToPartner.update(courseFound.id, obj);
        await this.partnerRepository.update(idPartner, { status: AsociadoStatus.TRAINING_PENDING });
        return { message: 'Curso actualizado' };
      }
      if (update.status === EnumCoursesStatus.REJECTED) {
        await this.courseToPartner.update(courseFound.id, obj);
        return { message: 'Curso actualizado' };
      }
    } else {
      throw new BadRequestException('No puedes finalizar el curso si no has aceptado todos los documentos.');
    }
  }

  async activatePartner(id: number) {
    const aux = await this.partnerRepository.findOne({ where: { id: id }, relations: ['sessions'] });
    const role = await this.rolesRepository.findOne({ where: { name: EnumApplicationsType.ASSOCIATED } });
    const signature = await this.partnerFileRepository.findOne({ where: { partnerId: id, type: 'signature' } });
    if (!signature) {
      return { message: 'El partner no tiene una firma cargada en la base de datos.' };
    }

    Axios.get(`${FILES_HOST}/${signature.path}`).then(async response => {
      if (response.status == 200 || response.status == 202) {
        const data = Buffer.from(response.data).toString('base64');
        const payload = {
          folio: aux.folio,
          imageB64: data,
        };
        Axios.post(FINCOMUN_API + 'sellado/generaSello', payload).then(async response => {
          if (response.data.codigo == 0) {
            await this.partnerRepository.update(id, {
              status: AsociadoStatus.ACTIVE,
              dischargeDate: new Date(),
              week: await this.getNumberOfActualWeek(),
              rejectedDate: null,
              rejectedReason: 'Este usuario ya ha sido activado por el sistema',
            });

            await this.sessionsRepository.update(aux.sessions.id, {
              role: role,
            });
            this.mailerService.sendMail({
              to: aux.email,
              subject: '¡Felicidades, tu asociado ya se encuentra activo!',
              html: `Tu asociado ya se encuentra activo.`,
            });

            const currentdate = new Date();
            const currentMonth = currentdate.getMonth();
            let currentCuatri: any;
            if (
              currentMonth === 12 ||
              currentMonth === 0 ||
              currentMonth === 1 ||
              currentMonth === 2 ||
              currentMonth === 3
            ) {
              currentCuatri = 1;
            }
            if (currentMonth === 4 || currentMonth === 5 || currentMonth === 6 || currentMonth === 7) {
              currentCuatri = 2;
            }
            if (currentMonth === 8 || currentMonth === 9 || currentMonth === 10 || currentMonth === 11) {
              currentCuatri = 3;
            }

            const ranking = this.rankingPartnersIndiv.create({
              rank: EnumRankPartnerIndividual.ASOCIADO,
              cuatrim: currentCuatri,
              partner: aux,
              score: 0,
            });
            await this.rankingPartnersIndiv.save(ranking);
            return { message: 'asociado activo' };
          } else {
            return { message: 'No se pudo crear el sello de la firma. Intente nuevamente más tarde.' };
          }
        });
      } else {
        return { message: 'No se pudo crear el sello de la firma. Intente nuevamente más tarde.' };
      }
    });
  }

  async rejectPartner(id: number, payload: RejectPartnerDto) {
    const aux = await this.partnerRepository.findOne({ where: { id: id } });
    await this.partnerRepository.update(id, {
      //updatea el partner
      status: AsociadoStatus.REJECTED,
      dischargeDate: null,
      rejectedDate: new Date(),
      rejectedReason: payload.rejectedReason,
    });
    this.mailerService.sendMail({
      to: aux.email,
      subject: `Lo sentimos, tu asociado ha sido rechazado. El motivo del rechazo es:${aux.rejectedReason}`,
      html: `Tu asociado se encuentra rechazado.`,
    });
    return { message: 'asociado rechazado' };
  }

  async disableUnfinishedPartner(id: number) {
    const partner = await this.partnerRepository.findOne({
      relations: ['sessions'],
      where: {
        id: id,
      },
    });
    if (partner.status < 6 && partner.createdAt < new Date(Date.now() - 7 * 24 * 3600000)) {
      const referred = await this.referredRepository.findOne({
        where: {
          referred: partner.id,
        },
      });
      const recoveryToken = this.generateVerificationToken();
      await this.sessionsRepository.update(partner.sessions.id, { recoveryToken: recoveryToken });
      const session_found = await this.sessionsRepository.findOne({ where: { id: partner.sessions.id } });
      await this.partnerRepository.update(partner.id, {
        verified: false,
        name: null,
        lastName: null,
        motherLastName: null,
        birthDate: null,
        nationality: null,
        birthPlace: null,
        age: null,
        rfc: null,
        curp: null,
        civilStatus: null,
        gender: null,
        mobileNumber: null,
        street: null,
        externalNumber: null,
        internalNumber: null,
        colony: null,
        municipality: null,
        state: null,
        zipcode: null,
        status: AsociadoStatus.REJECTED,
        dischargeDate: null,
        rejectedReason: null,
        rejectedDate: new Date(),
        updatedAt: new Date(),
        bankAccount: null,
        territory: null,
        disableDate: null,
        disableReason: null,
        disabledWrittenReason: null,
        removalDate: null,
      });
      this.mailerService
        .sendMail({
          to: partner.email,
          subject: 'Programa Asociados - Estado de Afiliación',

          text: `Lo sentimos, tu afiliación ha sido rechazada ya que han pasado más de 7 días y no ha sido completada o aprobada por nuestros administradores. Por favor, ingresa en el siguiente enlace para recuperar tu contraseña e iniciar de nuevo el proceso de afiliación: Recuperar contraseña: http://fincomun-d-cms.s3-website-us-west-1.amazonaws.com/recover-password?recoveryToken=${session_found.recoveryToken}<br>`,
          html: `<b>Lo sentimos, tu afiliación ha sido rechazada ya que han pasado más de 7 días y no ha sido completada o aprobada por nuestros administradores. Por favor, ingresa en el siguiente enlace para recuperar tu contraseña e iniciar de nuevo el proceso de afiliación: Recuperar contraseña:<a href="http://fincomun-d-cms.s3-website-us-west-1.amazonaws.com/recover-password?recoveryToken=${session_found.recoveryToken}">Link</a><br></b>`,
        })
        .then(_ => partner)
        .catch(err => {
          console.error(err);
          return partner;
        });
      await this.partnerFileRepository.delete({
        partnerId: id,
      });
      if (referred) {
        await this.referredRepository.update(referred.id, {
          isDeleted: true,
        });
      }
    }
  }

  async disableUnfinishedPartnerCron() {
    const partners = await this.partnerRepository.find();
    for (const partner of partners) {
      await this.disableUnfinishedPartner(partner.id);
    }
  }

  async getPartner(partner: Partner) {
    const partnerProfile = await this.partnerRepository.findOne({
      where: { id: partner.id },
      relations: ['files', 'bankAccount', 'courseToPartner'],
    });

    const multiple_bank = await this.bankAccountRepository.findOne({ where: { isUsedFor: partner.id } });

    delete partnerProfile.id;
    if (multiple_bank) {
      partnerProfile.bankAccount['provisory_accountNumber'] = multiple_bank.accountNumber;
      partnerProfile.bankAccount['provisory_clabe'] = multiple_bank.clabe;
      partnerProfile.bankAccount['provisory_name'] = multiple_bank.name;
    }
    return partnerProfile;
  }
  async getCourses(partner: Partner) {
    const aux = await this.courseToPartner.find({ where: { partner: partner }, relations: ['course'] });

    const courses = aux.map(el => {
      let evaluationDate: any;
      let validityDate: any;
      let takeEvaluationDate: any;
      let takeValidityDate: any;

      evaluationDate = new Date(el.evaluationDate);
      validityDate = new Date(el.course.validityDate);

      if (evaluationDate !== null) {
        takeEvaluationDate = `${evaluationDate.getFullYear()}-${
          evaluationDate.getMonth() + 1
        }-${evaluationDate.getDate()}`;
      } else {
        evaluationDate = null;
      }
      if (validityDate !== null) {
        takeValidityDate = `${validityDate.getFullYear()}-${validityDate.getMonth() + 1}-${validityDate.getDate()}`;
      } else {
        validityDate = null;
      }

      return {
        courseId: el.courseId,
        score: el.score,
        status: el.status,
        note: el.note,
        evaluationDate: takeEvaluationDate,
        validityDate: takeValidityDate,
        courseName: el.course.name,
        course_url: el.course.url,
        course_type: el.course.type,
      };
    });

    return courses;
  }

  async getRankingIndividualByNumber(id: number) {
    const partner = await this.rankingPartnersIndiv.findOne({
      relations: ['partner'],
      where: {
        partner: id,
      },
    });
    return partner.rank;
  }

  async updateBankAccount(partner: Partner, bankAccount: UpdateBankAccountDTO) {
    try {
      const partnerFound = await this.partnerRepository.findOne({
        where: { id: partner.id },
        relations: ['bankAccount', 'territory'],
      });

      const oldPartnerChanged = async () => {
        const register = this.partnerChangedRepository.create({
          email: partnerFound.email,
          folioAsociado: partnerFound.folio,
          nombreCompleto: partnerFound.name + ' ' + partnerFound.lastName,
          fechaDeAfiliacion: partnerFound.updatedAt,
          status: partnerFound.status,
          territorio: partnerFound.territory.id,
          nivelDeAsociado: await this.getRankingIndividualByNumber(partnerFound.id),
          rfc: partnerFound.rfc,
          partner: partner,
        });
        await this.partnerChangedRepository.save(register);
      };
      const temporary_exist = await this.bankAccountRepository.findOne({
        where: { isUsedFor: partner.id },
      });

      if (!temporary_exist) {
        const temporary_bank = this.bankAccountRepository.create({
          name: bankAccount.bank,
          accountNumber: bankAccount.accountNumber,
          clabe: bankAccount.clabe,
          isUsedFor: partner.id,
        });
        await this.bankAccountRepository.save(temporary_bank).then(() => {
          oldPartnerChanged();
        });
      } else {
        await this.bankAccountRepository
          .update(temporary_exist.id, {
            name: bankAccount.bank,
            accountNumber: bankAccount.accountNumber,
            clabe: bankAccount.clabe,
            isUsedFor: partner.id,
          })
          .then(() => {
            oldPartnerChanged();
          });
      }
      return { message: 'Cuenta bancaria actualizada', oldRegisterMessage: 'Dato anterior guardado' };
    } catch {
      return { message: 'No se puede actualizar una cuenta inexistente.' };
    }
  }

  async updateBankAccountFile(partner: Partner, files: UpdateBankAccountFileDTO) {
    if (!files.bankAccount) {
      throw new NotFoundException('Se necesita enviar al menos un archivo.', 'filesError');
    }
    const transformedFiles = await this.transformFiles(partner, files);
    const name = transformedFiles[0].name;
    const file_exist = await this.partnerFileRepository.findOne({
      where: { partner: partner, type: 'temporaryBillingStatement' },
    });
    if (!file_exist) {
      const temporary_bank_file = this.partnerFileRepository.create({
        partner: partner,
        partnerId: partner.id,
        path: name,
        status: EnumFilesStatusType.REVIEW,
        type: 'temporaryBillingStatement',
      });
      await this.partnerFileRepository.save(temporary_bank_file);
      return { message: 'Bank updated.' };
    } else {
      await this.partnerFileRepository.update(file_exist.id, { path: name, status: EnumFilesStatusType.REVIEW });
      return { message: 'Bank updated.' };
    }
  }

  transformFiles(partner: Partner, files: UpdateBankAccountFileDTO) {
    return Promise.all(
      Object.entries(files || []).map(async ([key, value]) => {
        const file = value.shift();
        const ext = file.originalname.split('.').pop();
        const unixTime = new Date().getTime();
        const name = `partner_${partner.id}_${key}_${unixTime}.${ext}`;
        await this.renameFile(file.path, `${config().files_path}/${name}`);

        return { key, name };
      }),
    );
  }

  renameFile(oldName, newName) {
    return new Promise((resolve, reject) => {
      return fs.rename(oldName, newName, err => {
        if (err) {
          return reject(err);
        }
        return resolve(true);
      });
    });
  }

  async createTokens(id: number, accessToken: string, refreshToken: string) {
    this.sessionsRepository.update(id, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
}
