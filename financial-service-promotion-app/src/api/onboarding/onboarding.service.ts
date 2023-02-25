import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, Between, MoreThanOrEqual, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import Axios from 'axios';
const { FINCOMUN_API } = process.env;
import * as Joi from 'joi';
import { MailerService } from '@nestjs-modules/mailer';
// import * as htmlToPdf from 'html-pdf-node';
import * as pdf from 'html-pdf';
// import { join } from 'path';

import { Partner } from '../../common/database_entities/partner.entity';
import { PartnerFile } from '../../common/database_entities/partnerFile.entity';

import {
  CreatePartnerDto,
  UpdatePartnerDto,
  UpdatePartnerFilesDto,
  RecoveryPasswordDto,
} from '../partners/dtos/partner.dto';
import config from '../../config';

import {
  AsociadoStatus,
  EnumApplicationsType,
  EnumcontractsTypes,
  EnumCoursesStatus,
  EnumFilesStatusPatch,
  EnumFilesStatusType,
  EnumSecuentialTypes,
} from '../../common/constants';
import { BankAccountEntity } from 'src/common/database_entities/bankAccount.entity';
import { SequentialEntity } from 'src/common/database_entities/sequential.entity';
import { Course } from 'src/common/database_entities/course.entity';
import { CourseToPartner } from 'src/common/database_entities/coursePartner.entity';
import { Sessions } from 'src/common/database_entities/sessions.entity';
import { Roles } from 'src/common/database_entities/roles.entity';
import { Territory } from 'src/common/database_entities/territories.entity';
import { ReferredEntity } from 'src/common/database_entities/referred.entity';
import { BadRequestException } from 'src/config/exceptions/bad.request.exception';
import { NotFoundException } from 'src/config/exceptions/not.found.exception';
import { ForbiddenException } from 'src/config/exceptions/forbidden.exception';
import { DateTime } from 'luxon';
import { DeleteAccountDto } from './dtos/deleteAccount.dto';
import { AsociadoStatusReports, EnumStatusTypes } from '../../common/constants';
import { PartnerChanged } from '../../common/database_entities/partner_changed.entity';
import { RankingPartnersIndiv } from '../../common/database_entities/rankingPartnersIndiv.entity';

const PARTNER_SCHEMA = Joi.object({
  email: Joi.string().required(),
  verified: Joi.boolean().required().equal(true).required(),
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  motherLastName: Joi.string().required(),
  rfc: Joi.string().required(),
  curp: Joi.string().required(),
  birthDate: Joi.string().required(),
  nationality: Joi.string().required(),
  age: Joi.string().required(),
  civilStatus: Joi.string().required(),
  mobileNumber: Joi.string().required(),
  zipcode: Joi.string().required(),
  street: Joi.string().required(),
  externalNumber: Joi.string().required(),
  state: Joi.string().required(),
  affiliationContract: Joi.boolean().required().equal(true),
  privacyNotice: Joi.boolean().required().equal(true),
  confidentialityNotice: Joi.boolean().required().equal(true),
  files: {
    ineFront: Joi.string().required(),
    ineBack: Joi.string().required(),
    rfc: Joi.string().required(),
    curp: Joi.string().required(),
    proofOfAddress: Joi.string().required(),
    billingStatement: Joi.string().required(),
    signature: Joi.string().required(),
  },
});

@Injectable()
export class OnboardingService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(Partner) private partnerRepository: Repository<Partner>,
    @InjectRepository(PartnerFile) private partnerFileRepository: Repository<PartnerFile>,
    @InjectRepository(BankAccountEntity) private bankAccountRepository: Repository<BankAccountEntity>,
    @InjectRepository(SequentialEntity) private sequentialRepository: Repository<SequentialEntity>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(CourseToPartner) private courseToPartnerRepository: Repository<CourseToPartner>,
    @InjectRepository(Sessions) private sessionsRepository: Repository<Sessions>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    @InjectRepository(Territory) private territoryRepository: Repository<Territory>,
    @InjectRepository(ReferredEntity) private referredRepository: Repository<ReferredEntity>,
    private readonly mailerService: MailerService,
    @InjectRepository(PartnerChanged) private partnerChangedRepository: Repository<PartnerChanged>,
    @InjectRepository(RankingPartnersIndiv) private rankingPartnersIndivRepository: Repository<RankingPartnersIndiv>,
  ) {}

  //Servicio para crear el partner y la sesión.
  async createPartner(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    // -----------------------------------------------------------------------------------Referred
    const referred = await this.partnerRepository.findOne({
      relations: ['territory'],
      where: { alphanumeric: createPartnerDto.referencedCode },
    });

    const rolePartner = await this.rolesRepository.findOne({ where: { name: EnumApplicationsType.PARTNER } });
    
    const newPartner = this.partnerRepository.create(createPartnerDto);
    
    const hashPassword = await bcrypt.hash(newPartner.password, 10);
    newPartner.lasts_passwords = [hashPassword];
    newPartner.password = hashPassword;
    newPartner.validityPassword = Date.now() + 5184000000;
    newPartner.verified = false;
    newPartner.folio = await this.generateFolio();
    newPartner.alphanumeric = this.generateAlphaNumeric(6);
    // -----------------------------------------------------------------------------------Partner
    const partnerCreated = await this.partnerRepository.save(newPartner).catch(err => {
      if (err instanceof QueryFailedError && err.message.includes('Duplicate entry')) {
        throw new BadRequestException('DUPLICATE_ENTRY', 'El correo electrónico es utilizado por un asociado activo');
      }
      throw new InternalServerErrorException('Error interno de servidor. Verifique sus datos.');
    });

    // -----------------------------------------------------------------------------------Referred Again...
    if (referred) {
      const referred_created = this.referredRepository.create({
        partner: referred,
        referred: partnerCreated,
      });
      await this.referredRepository.save(referred_created);
      const partner = await this.partnerRepository.findOne(partnerCreated.id);
      partner.colony = referred.colony;
      partner.municipality = referred.municipality;
      partner.state = referred.state;
      partner.territory = referred.territory;
      await this.partnerRepository.save(partner);
    }
    // -----------------------------------------------------------------------------------Session
    const newSession = this.sessionsRepository.create({
      partner: partnerCreated,
      role: rolePartner,
    });
    newSession.verificationToken = this.generateVerificationToken();
    try {
      await this.sessionsRepository.save(newSession);
    } catch (err) {
      console.log(err);
    }
    // -----------------------------------------------------------------------------------Email
    await this.sendVerificationEmail(newPartner, newSession);
    // -----------------------------------------------------------------------------------PartnerFiles
    const partnerFile = {
      partner: partnerCreated,
      type: 'affiliationContract',
      path: '',
      status: 'true',
    };
    await this.partnerFileRepository.save(this.partnerFileRepository.create(partnerFile));
    partnerFile.type = 'privacyNotice';
    await this.partnerFileRepository.save(this.partnerFileRepository.create(partnerFile));
    partnerFile.type = 'confidentialityNotice';
    await this.partnerFileRepository.save(this.partnerFileRepository.create(partnerFile));
    return partnerCreated;
  }

  //Servicio para validar el partner creado.
  async verifyPartner({ verificationToken, email }) {
    let sessionFound: Sessions;
    let partner: Partner;
    try {
      partner = await this.partnerRepository.findOne({ where: { email: email } });
      sessionFound = await this.sessionsRepository.findOne({
        where: [{ verificationToken: verificationToken, partner: partner }],
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }

    if (!partner) {
      throw new NotFoundException('NOT_FOUND', 'El email ingresado no corresponde a un usuario existente.');
    }
    if (partner.verified) {
      throw new BadRequestException('USER_ALREADY_VERIFIED', 'Usuario ya verificado.');
    }
    if (!sessionFound) {
      throw new NotFoundException('NOT_FOUND', 'El token ingresado es inválido.');
    }

    partner.verified = true;
    partner.status = AsociadoStatus.USER_VALIDATED;
    sessionFound.verificationToken = null;

    await this.sessionsRepository.update(sessionFound.id, {
      verificationToken: null,
    });
    await this.updatePartnerAndVerifyStatus(partner);

    return partner;
  }

  async getRankingIndividualByNumber(id: number) {
    const partner = await this.rankingPartnersIndivRepository.findOne({
      relations: ['partner'],
      where: {
        partner: id,
      },
    });
    if (partner) {
      return partner.rank;
    } else {
      return 'No posee ranking';
    }
  }

  async deleteAccount(data: DeleteAccountDto, partner: Partner) {
    if (!data) {
      throw new BadRequestException('400', 'Datos inválidos');
    }
    const partnerFinded = await this.partnerRepository.findOne({
      relations: ['territory', 'bankAccount'],
      where: { id: partner.id },
    });
    const recoveryToken = this.generateVerificationToken();
    await this.sessionsRepository.update(partner.sessions.id, { recoveryToken: recoveryToken });

    await this.partnerRepository
      .update(partnerFinded.id, {
        status: AsociadoStatus.DISABLED,
        folio: null,
        disableDate: new Date(),
        disableReason: data.reason,
        disabledWrittenReason: data.writtenReason,
      })
      .then(async () => {
        const partnerChanged = this.partnerChangedRepository.create({
          email: partnerFinded.email,
          bank: partnerFinded.bankAccount.name,
          accountNumber: partnerFinded.bankAccount.accountNumber,
          clabe: partnerFinded.bankAccount.clabe,
          nivelDeAsociado: await this.getRankingIndividualByNumber(partnerFinded.id),
          folioAsociado: partnerFinded.folio,
          nombreCompleto: partnerFinded.name + ' ' + partnerFinded.lastName,
          fechaDeAfiliacion: partnerFinded.updatedAt,
          status: partnerFinded.status,
          territorio: partnerFinded.territory.id,
          rfc: partnerFinded.rfc,
          partner: partner,
          isDeleted: true,
        });
        await this.partnerChangedRepository.save(partnerChanged);
      })
      .catch(err => {
        return {
          message: 'No se pudo eliminar el usuario',
          error: err,
        };
      });

    const session_found = await this.sessionsRepository.findOne({ where: { id: partner.sessions.id } });

    this.mailerService
      .sendMail({
        to: partnerFinded.email,
        subject: 'Eliminación de cuenta',
        text: `Se ha iniciado el proceso de baja de su cuenta, tendrá hasta 15 días para reactivarla ingresando en el siguiente enlace: http://fincomun-d-cms.s3-website-us-west-1.amazonaws.com/recover-password?recoveryToken=${session_found.recoveryToken}<br>. Pasado este tiempo su cuenta será eliminada de forma permanente.`,
        html: `Se ha iniciado el proceso de baja de su cuenta, tendrá hasta 15 días para reactivarla ingresando en el siguiente enlace: <a href="http://fincomun-d-cms.s3-website-us-west-1.amazonaws.com/recover-password?recoveryToken=${session_found.recoveryToken}">Recuperar Cuenta</a>.<br> Pasado este tiempo su cuenta será eliminada de forma permanente.`,
      })
      .then(_ => partner)
      .catch(err => {
        console.error(err);
        return partner;
      });

    return {
      message: 'Su cuenta ha sido desactivada, por favor ingrese al link enviado a su email para recuperar su cuenta',
    };
  }

  async deleteAccountCron() {
    const partners = await this.partnerRepository.find({
      where: {
        status: AsociadoStatusReports.DISABLED,
      },
    });

    for (const partner of partners) {
      if (partner.disableDate < new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)) {
        let referred = await this.referredRepository.findOne({
          where: {
            referred: partner.id,
          },
        });
        if (referred) {
          await this.referredRepository.update(referred.id, {
            isDeleted: true,
          });
          await this.partnerRepository.update(partner.id, {
            status: AsociadoStatus.REMOVED,
            removalDate: new Date(),
          });
          return {
            message: 'Proceso de eliminación de cuentas finalizado',
          };
        } else if (!referred) {
          await this.partnerRepository.update(partner.id, {
            status: AsociadoStatus.REMOVED,
            removalDate: new Date(),
          });
          return {
            message: 'Proceso de eliminación de cuentas finalizado',
          };
        } else {
          throw new NotFoundException('NOT_FOUND', 'No se encontró el asociado referido');
        }
      }
    }
  }

  //En caso de haberlo perdido, se envía el verificationToken nuevamente.
  async sendVerificationToken(email: string) {
    const partner = await this.partnerRepository.findOne({ where: { email } });
    const sessionFound = await this.sessionsRepository.findOne({ where: { partner: partner } });
    if (!partner) {
      throw new NotFoundException('NOT_FOUND', 'El correo electrónico no existe.');
    }
    if (partner.verified) {
      throw new BadRequestException('ACCOUNT_ALREADY_VERIFIED', 'La cuenta ya ha sido verificada.');
    }
    const newVerificationToken = this.generateVerificationToken();
    await this.sessionsRepository
      .update(sessionFound.id, { verificationToken: newVerificationToken })
      .then(async () => {
        try {
          const newSessionFound = await this.sessionsRepository.findOne({ where: { partner: partner } });
          await this.sendVerificationEmail(partner, newSessionFound);
        } catch (err) {
          throw new InternalServerErrorException(err.message);
        } finally {
          return { message: 'Nuevo token enviado.' };
        }
      });
  }

  //Aquí generamos el token de recuperación. Buscamos el partner por email. Si no existe o no está verificado, error.
  //Sino, generamos un token de recuperación.
  //Servicio para reestablecer la contraseña.
  async sendRecoveryPasswordToken(email: string) {
    const partner = await this.partnerRepository.findOne({ where: { email }, relations: ['sessions'] });
    if (!partner || !partner.verified) {
      throw new BadRequestException(
        'ACCOUNT_ERROR',
        'Asociado no se encuentra en estado activo o no se encuentra registrado.',
      );
    }
    const recoveryToken = this.generateVerificationToken();
    await this.sessionsRepository.update(partner.sessions.id, { recoveryToken: recoveryToken });
    await this.sendRecoveryPasswordEmail(partner);
    return { message: 'Token reset de contraseña enviado.' };
  }

  //Generador de tokens.
  generateVerificationToken() {
    return Math.round(Math.random() * 1000000).toString();
  }

  //Se genera el folio del partner.
  async generateFolio() {
    let secuentialItem = await this.sequentialRepository.findOne({ type: EnumSecuentialTypes.FOLIO_PROFILE });
    const folio = secuentialItem['seq'] + 1;
    await this.sequentialRepository.update(secuentialItem['id'], { seq: folio });
    return 'A' + folio.toString();
  }

  //Genera un código alfanumérico.
  generateAlphaNumeric(length: number): string {
    let randomString = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
  }

  //Servicio para enviar el email de verificación al partner.
  async sendVerificationEmail(partner: Partner, session: Sessions) {
    return this.mailerService
      .sendMail({
        to: partner.email,
        subject: 'Verifica tu cuenta para continuar.',
        text: `Ingresa tu código de verificación en la App: ${session.verificationToken}`,
        html: `<b>Ingresa tu código de verificación en la App: ${session.verificationToken}</b>`,
      })
      .then(_ => partner)
      .catch(err => {
        console.error(err);
        return partner;
      });
  }

  //Servicio para recuperar la contraseña.
  async sendRecoveryPasswordEmail(partner: Partner) {
    const session_found = await this.sessionsRepository.findOne({ where: { id: partner.sessions.id } });
    return this.mailerService
      .sendMail({
        to: partner.email,
        subject: 'Recuperación de contraseña.',
        text: `Ingresa al siguiente link para recuperar tu contraseña: http://fincomun-d-cms.s3-website-us-west-1.amazonaws.com/recover-password?recoveryToken=${session_found.recoveryToken}`,
        html: `<b>Ingresa al siguiente link para recuperar tu contraseña: <a href="http://fincomun-d-cms.s3-website-us-west-1.amazonaws.com/recover-password?recoveryToken=${session_found.recoveryToken}">Link</a></b>`,
      })
      .then(_ => partner)
      .catch(err => {
        console.error(err);
        return partner;
      });
  }

  //Servicio para el envío de mails de cursos.
  async sendCoursesMail(partner, index) {
    return this.mailerService
      .sendMail({
        to: partner.email,
        subject: 'Cursos a realizar.',
        text: `Ingresa al siguiente enlace para realizar el curso.`,
        html: `<b>Ingresa a los siguientes enlaces para realizar los cursos: <a href="${index.url}">${index.name}</a></b>`,
      })
      .then(_ => partner)
      .catch(err => {
        console.log(err);
        return partner;
      });
  }

  //Servicio de envío de mail de status de files.
  async sendStatusMail(email: string, type: string, reason: string) {
    switch (type) {
      case 'ineFront':
        type = 'INE ANVERSO';
        break;
      case 'ineBack':
        type = 'INE REVERSO';
        break;
      case 'rfc':
        type = 'RFC';
        break;
      case 'curp':
        type = 'CURP';
        break;
      case 'proofOfAddress':
        type = 'DOMICILIO';
        break;
      case 'billingStatement':
        type = 'CUENTA';
        break;
      case 'signature':
        type = 'FIRMA';
        break;
      default:
        null;
    }
    return this.mailerService
      .sendMail({
        to: email,
        subject: 'Archivo rechazado.',
        text: `El archivo subido fue rechazado.`,
        html: `<b>El archivo subido: ${type}, fue rechazado por el siguiente motivo: ${reason}. Por favor, vuelve a subirlo.`,
      })
      .then(_ => email)
      .catch(err => {
        console.log(err);
        return email;
      });
  }

  //Servicio para actualizar datos.
  async updateData(partner: Partner, changes: UpdatePartnerDto) {
    if (changes.state && changes.municipality) {
      const [territory] = await this.territoryRepository.find({
        state: changes.state,
        municipality: changes.municipality,
      });
      partner.territory = territory;
    }

    this.partnerRepository.merge(partner, changes);
    return this.updatePartnerAndVerifyStatus(partner);
  }

  //Método que trae la información de la firma base64, certificado y rutas desde el API de Fincomun
  async getSignatureData(folio: string) {
    const payload = {
      folio: folio,
    };
    Axios.post(FINCOMUN_API + 'sellado/consultaSello', payload).then(async response => {
      if (response.status == 200) {
        if (response.data.codigo == 0) {
          return response.data;
        }
        return { message: 'No se pudo recuperar la información de la firma. Intente nuevamente más tarde.' };
      }
    });
  }

  //Servicio para cargar datos del usuario.
  async updatePersonalInfo(id: number, changes: UpdatePartnerDto, partnerSent) {
    if (partnerSent.bankAccount && changes.name) {
      await this.partnerRepository.update(id, changes);
      return { message: 'User updated.' };
    }
    if (partnerSent.bankAccount) {
      const bankAccountSent = { name: changes.bank, accountNumber: changes.accountNumber, clabe: changes.clabe };
      const location_found = await this.territoryRepository.findOne({
        where: { state: changes.state, municipality: changes.municipality },
      });
      if (!location_found) {
        throw new NotFoundException(
          'NOT_FOUND',
          'La dirección no es correcta, verifica que el Municipio y el Estado estén escritos con su nombre oficial.',
        );
      }
      delete changes.clabe;
      delete changes.accountNumber;
      delete changes.bank;
      const partnerFinded = await this.partnerRepository.findOne({
        relations: ['territory'],
        where: {
          id,
        },
      });
      if (partnerFinded.colony && partnerFinded.municipality && partnerFinded.state && partnerFinded.territory) {
        await this.partnerRepository.update(id, { territory:  partnerFinded.territory});
        await this.bankAccountRepository.update(partnerSent.bankAccount.id, bankAccountSent);
        await this.partnerRepository.update(id, changes);
      } else {
        await this.partnerRepository.update(id, changes);
        await this.partnerRepository.update(id, { territory: location_found });
        await this.bankAccountRepository.update(partnerSent.bankAccount.id, bankAccountSent);
      }
    } else {
      const bankAccountSent = { name: changes.bank, accountNumber: changes.accountNumber, clabe: changes.clabe };
      const partner = await this.partnerRepository.findOne({
        where: { id: id },
        relations: ['files', 'bankAccount', 'courseToPartner'],
      });
      const courses = await this.courseRepository.find();
      const currentDate = new Date();
      const coursesFiltered = courses.filter(
        el => el.validityDate >= currentDate && el.status !== EnumStatusTypes.FINISHED,
      );

      const files = partner.files;
      this.partnerRepository.merge(partner, changes);

      for (let i = 0; i < files.length; i++) {
        this.partnerFileRepository.update(files[i].id, files[i]);
      }

      const newBank = this.bankAccountRepository.create(bankAccountSent);
      const aux = await this.bankAccountRepository.save(newBank);
      partner.bankAccount = aux;
      await this.partnerRepository.update(partner.id, { bankAccount: aux });

      await this.updatePartnerInfo(partner);

      coursesFiltered.forEach(async index => {
        const courseToPartner = this.courseToPartnerRepository.create({
          partner: partner,
          course: index,
          status: EnumCoursesStatus.PENDING,
          evaluationDate: index.validityDate,
        });
        await this.courseToPartnerRepository.save(courseToPartner);
      });
    }

    return { message: 'User updated.' };
  }

  //Servicio de carga de archivos.
  async updateFiles(id: number, files: UpdatePartnerFilesDto, body_data) {
    const partner = await this.partnerRepository.findOne({
      relations: ['files', 'bankAccount'],
      where: {
        id: id,
      },
    });

    if (partner.status !== AsociadoStatus.ONBOARDING && partner.status !== AsociadoStatus.ONBOARDING_FILES) {
      throw new ForbiddenException('FORBIDDEN_RESOURCE', 'El status del usuario no permite hacer esta operación.');
    }

    if (
      !files.ineFront &&
      !files.ineBack &&
      !files.rfc &&
      !files.curp &&
      !files.proofOfAddress &&
      !files.billingStatement &&
      !files.signature &&
      !files.profilePhoto
    ) {
      throw new BadRequestException('BAD_REQUEST', 'Se necesita enviar al menos un archivo.', 'filesError');
    }

    const transformedFiles = await this.transformFiles(partner, files);

    const affcontract = partner.files[0];
    const confContract = partner.files[1];
    const privacyContract = partner.files[2];

    const partnerFiles = partner.files.slice(3);

    transformedFiles.forEach(({ key, name }) => {
      const fileIndex = partnerFiles.findIndex(f => f.type === key);
      if (fileIndex !== -1 && partnerFiles[fileIndex].status === EnumFilesStatusPatch.REJECT) {
        partnerFiles[fileIndex].path = name;
        partnerFiles[fileIndex].status = EnumFilesStatusType.REVIEW;
      } else if (fileIndex === -1) {
        const newPartnerFile = this.partnerFileRepository.create({
          partner: partner,
          type: key,
          path: name,
          status: EnumFilesStatusType.REVIEW,
        });
        partnerFiles.push(newPartnerFile);
      }
    });

    const affiliationContract = await this.serveContract(partner, EnumcontractsTypes.affiliationContract, true);
    const confidentialityNotice = await this.serveContract(partner, EnumcontractsTypes.confidentialityNotice, true);
    const privacyNotice = await this.serveContract(partner, EnumcontractsTypes.privacyNotice, true);

    affcontract.path = affiliationContract;
    confContract.path = confidentialityNotice;
    privacyContract.path = privacyNotice;

    partnerFiles.push(this.partnerFileRepository.create(affcontract));
    partnerFiles.push(this.partnerFileRepository.create(confContract));
    partnerFiles.push(this.partnerFileRepository.create(privacyContract));

    for (const item of partnerFiles) {
      await this.partnerFileRepository
        .save(item)
        // .then(data => console.log(data))
        .catch(e => console.log(e));
      item.path = item.path;
    }

    const result = await this.updateAndVerifyPartner(id);

    if (result) {
      if (partner.mailsSent === false) {
        // sino, enviamos los mails de los cursos
        const courses = await this.courseRepository.find();
        const filteredCourses = courses.filter(el => el.validityDate >= new Date());
        filteredCourses.map(async index => {
          await this.sendCoursesMail(partner, index);
        });
        await this.partnerRepository.update(partner.id, {
          status: AsociadoStatus.ONBOARDING_FILES,
          mailsSent: true,
          rejectedDate: null,
        });
      } else if (partner.mailsSent === true) {
        // si los mails de los cursos, ya se enviaron, entonces solo updateamos el status del asociado
        await this.partnerRepository.update(partner.id, {
          status: AsociadoStatus.ONBOARDING_FILES,
          rejectedDate: null,
        });
      }
    }
    return partner;
  }

  async updateAndVerifyPartner(id: number) {
    const partner = await this.partnerRepository.findOne({ where: { id: id }, relations: ['files', 'territory'] });
    if (
      !partner.name &&
      !partner.lastName &&
      !partner.motherLastName &&
      !partner.rfc &&
      !partner.curp &&
      !partner.birthDate &&
      !partner.birthPlace &&
      !partner.gender &&
      !partner.nationality &&
      !partner.age &&
      !partner.civilStatus &&
      !partner.mobileNumber &&
      !partner.zipcode &&
      !partner.street &&
      !partner.externalNumber &&
      !partner.internalNumber &&
      !partner.territory.colony &&
      !partner.territory.municipality &&
      !partner.territory.state
    ) {
      throw new BadRequestException('BAD_REQUEST', 'Algunos campos están vacíos', 'filesError');
    }
    if (partner.files.length === 11) {
      return true;
    } else {
      return false;
    }
  }

  transformFiles(partner: Partner, files: UpdatePartnerFilesDto) {
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

  async updatePartnerAndVerifyStatus(partner: Partner) {
    partner = await this.partnerRepository.save(partner);

    const partnerProfile = (partner.files || []).reduce((partner, file) => {
      partner.files[file.type] = file.path;
      return partner;
    }, Object.assign({}, partner, { files: {} }));

    const isValid = PARTNER_SCHEMA.validate(partnerProfile, { allowUnknown: true });

    const completeProfile = !isValid.error;

    if (!completeProfile) {
      return partner;
    }

    partner.preAffiliationId = this.generatePreAffiliationId(partner.id);

    return await this.partnerRepository
      .save(partner)
      .then(this.sendTrainingEmail.bind(this))
      .catch(err => {
        throw new InternalServerErrorException(err.message);
      });
  }

  async updatePartnerInfo(partner: Partner) {
    partner.status = AsociadoStatus.ONBOARDING;
    partner.preAffiliationId = this.generatePreAffiliationId(partner.id);
    return (
      this.partnerRepository
        .save(partner)
        // .then(this.sendTrainingEmail.bind(this))
        .catch(err => {
          throw new InternalServerErrorException(err.message);
        })
    );
  }

  generatePreAffiliationId(id: number) {
    const number = 100000 + id;
    return `PRE-${number}`.replace('PRE-1', 'PRE-');
  }

  async sendTrainingEmail(partner: Partner) {
    return this.mailerService
      .sendMail({
        to: partner.email,
        subject: 'Inicia tu capacitación.',
        text: `Url del curso de capacitación`,
        html: `<b>Url del curso de capacitación</b>`,
      })
      .then(_ => partner)
      .catch(err => {
        console.error(err);
        return partner;
      });
  }

  //Creamos un partner vacío, y en él colocamos la búsqueda de un partner por el recovery password token.
  async recoveryPassword(payload: RecoveryPasswordDto) {
    let session: Sessions;
    try {
      session = await this.sessionsRepository.findOne({
        where: { recoveryToken: payload.recoveryToken },
        relations: ['partner'],
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!session) {
      throw new BadRequestException('INVALID_CODE', 'Código inválido.');
    } else {
      const hashPassword = await bcrypt.hash(payload.password, 10);
      for (let elem of session.partner.lasts_passwords) {
        const is_match = await bcrypt.compare(payload.password, elem);
        if (is_match) {
          throw new BadRequestException(
            'PASSWORD_ALREADY_USED',
            'La contraseña ingresada fue usada con anterioridad. Ingrese una diferente a las 12 anteriores.',
          );
        }
      }
      if (session.partner.lasts_passwords.length < 12) {
        session.partner.lasts_passwords.push(hashPassword);
      } else {
        session.partner.lasts_passwords.shift();
        session.partner.lasts_passwords.push(hashPassword);
      }
      session.partner.password = hashPassword;
      session.recoveryToken = null;
      await this.partnerRepository.save(session.partner);
      await this.sessionsRepository.save(session);
      const partner = await this.partnerRepository.findOne({
        where: {
          id: session.partner.id,
        },
      });
      if (partner.rejectedDate) {
        await this.partnerRepository.update(session.partner.id, { status: AsociadoStatus.CREATED });
        return { message: 'Partner validate succesfully.' };
      }
      if (partner.disableDate) {
        await this.partnerRepository.update(session.partner.id, { status: AsociadoStatus.ACTIVE });
        return { message: 'Partner validate succesfully.' };
      }
    }
  }

  async serveContract(partner: Partner, type: string, save: boolean) {
    const template: string = await new Promise((resolve, reject) => {
      fs.readFile(path.join(process.cwd(), `./src/common/contracts/${type}.html`), (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data.toString().replace(/\n/g, '').replace(/\t/g, '').trim());
      });
    });

    const data = this.preparaContractData(partner);
    const contract = this.replaceContractTemplate(template, data);

    if (save) {
      await this.saveContractPDF(partner, contract, type);
    }

    return `${type}_${partner.id}.pdf`;
  }

  async serveHTMLView(partner: Partner, type: string) {
    const template: string = await new Promise((resolve, reject) => {
      fs.readFile(path.join(process.cwd(), `./src/common/contracts/${type}.html`), (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data.toString().replace(/\n/g, '').replace(/\t/g, '').trim());
      });
    });

    const data = this.preparaContractData(partner);
    const contract = this.replaceContractTemplate(template, data);
    return contract;
  }

  preparaContractData(partner: Partner) {
    const signatureFullPath = this.getSignatureFullPath(partner);
    const { birthDay, birthMonth, birthYear } = this.getBirthParts(partner);
    const { activationDate, activationMonth, activationYear } = this.getActivationDate(partner);

    return Object.assign({}, partner, {
      fullname: `${partner.name} ${partner.lastName} ${partner.motherLastName}`,
      signatureFullPath: signatureFullPath
        ? `<img style='max-height: 60px; max-width: 250px;' src='${signatureFullPath}' />`
        : '__________________________',
      birthDay: birthDay || '______',
      birthMonth: birthMonth || '______',
      birthYear: birthYear || '______',
      activationDate: activationDate || '______',
      activationMonth: activationMonth || '______',
      activationYear: activationYear || '______',
    });
  }

  getSignatureFullPath(partner: Partner) {
    const file = (partner.files || []).find(file => file.type === 'signature');
    if (!file) {
      return '';
    }
    return `${process.env.FILES_HOST}/${file.path}`;
  }

  getBirthParts(partner: Partner) {
    const birthDate = partner.birthDate;
    if (!birthDate) {
      return {
        birthMonth: '',
        birthYear: '',
        birthDay: '',
      };
    }
    const [birthDay, birthMonth, birthYear] = birthDate.split('/');
    return {
      birthDay,
      birthMonth,
      birthYear,
    };
  }

  getActivationDate(partner: Partner) {
    let date: any;
    date = DateTime.fromJSDate(new Date()).toFormat('dd/MM/yyyy');
    const [activationDate, activationMonth, activationYear] = date.split('/');
    activationDate ? activationDate : '______';
    activationMonth ? activationMonth : '______';
    activationYear ? activationYear : '______';
    return {
      activationDate,
      activationMonth,
      activationYear,
    };
  }

  replaceContractTemplate(template: string, data) {
    return Object.keys(data).reduce((contract, field) => {
      return contract.replace(new RegExp(`{{${field}}}`, 'g'), data[field] || '______');
    }, template);
  }

  async saveContractPDF(partner: Partner, contract: string, type: string): Promise<string> {
    const options = { format: 'A4' };
    const name = path.join(config().files_path, `${type}_${partner.id}.pdf`);

    return new Promise((resolve, reject) => {
      pdf.create(contract, options).toFile(name, function (err, { filename }) {
        if (err) {
          return reject(err);
        }
        return resolve(filename);
      });
    });
  }

  async updateStatusFile(idUser, updateFileStatusDTO) {
    const { id_file, status, reason } = updateFileStatusDTO;
    const partner = await this.partnerRepository.findOne({
      where: { id: idUser },
      relations: ['files', 'bankAccount'],
    });

    if (!partner) {
      throw new NotFoundException('ACCOUNT_NOT_FOUND', 'User not found.');
    }

    if (partner.status === AsociadoStatus.ONBOARDING_FILES) {
      try {
        const foundFile = partner.files.find(
          index => index.id === parseInt(id_file) && index.status === EnumFilesStatusType.REVIEW,
        );
        await this.partnerFileRepository.update(foundFile.id, { status: status, reason: reason });
        if (status === EnumFilesStatusType.REJECT) {
          this.sendStatusMail(partner.email, foundFile.type, reason);
        }
        const partner_mod = await this.partnerRepository.findOne({ where: { id: idUser }, relations: ['files'] });
        const aux = partner_mod.files.slice(3).filter(index => index.status !== EnumFilesStatusPatch.ACCEPTED);
        if (aux.length === 0)
          await this.partnerRepository.update(partner.id, { status: AsociadoStatus.TRAINING_PENDING });
        return foundFile;
      } catch {
        throw new NotFoundException('FILE_NOT_FOUND', 'File not found or invalid request.');
      }
    } else if (partner.status === AsociadoStatus.ACTIVE) {
      try {
        const bank = partner.files.find(index => index.type === 'temporaryBillingStatement');
        const current_bank = partner.files.find(index => index.type === 'billingStatement');
        if (status === EnumFilesStatusType.ACCEPTED) {
          await this.partnerFileRepository.update(current_bank.id, {
            path: bank.path,
          });
          const bank_data = await this.bankAccountRepository.findOne({
            where: { isUsedFor: partner.id },
          });
          await this.bankAccountRepository.update(partner.bankAccount.id, {
            name: bank_data.name,
            accountNumber: bank_data.accountNumber,
            clabe: bank_data.clabe,
          });
          await this.partnerFileRepository.delete(bank);
          await this.bankAccountRepository.delete(bank_data);
        }
        if (status === EnumFilesStatusType.REJECT) {
          await this.partnerFileRepository.update(bank, {
            status: status,
            reason: reason,
          });
          this.sendStatusMail(partner.email, 'CUENTA CLABE', reason);
        }
      } catch {
        throw new NotFoundException('FILE_NOT_FOUND', 'File not found or invalid request.');
      }
    } else throw new BadRequestException('INVALID_OPERATION', 'Operación inválida');
  }

  // TODO: corregir servicio, este servicio va en el cms
  async updatePartialData(id: number, data: UpdatePartnerDto) {
    const { civilStatus, mobileNumber } = data;
    const result = await this.partnerRepository.findOne({ where: { id: id } });
    if (result) {
      return this.partnerRepository.update(id, { civilStatus, mobileNumber });
    } else {
      throw new NotFoundException('ACCOUNT_NOT_FOUND', 'No existe el usuario con el id enviado.');
    }
  }

  async meProfileOnboarding(partner: Partner) {
    delete partner.verified;
    delete partner.sessions;

    const multiple_bank = await this.bankAccountRepository.findOne({ where: { isUsedFor: partner.id } });

    delete partner.id;
    if (multiple_bank) {
      partner.bankAccount['provisory_accountNumber'] = multiple_bank.accountNumber;
      partner.bankAccount['provisory_clabe'] = multiple_bank.clabe;
      partner.bankAccount['provisory_name'] = multiple_bank.name;
    }
    return partner;
  }
}
