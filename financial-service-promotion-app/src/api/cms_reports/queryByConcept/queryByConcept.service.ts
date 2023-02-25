import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { EnumReportTypeAssociates, AsociadoStatusReports, AsociadoStatus } from 'src/common/constants';
import { CourseToPartner } from 'src/common/database_entities/coursePartner.entity';
import { RankingPartnersIndiv } from '../../../common/database_entities/rankingPartnersIndiv.entity';
import { RankingPartnersLead } from '../../../common/database_entities/rankingPartnersLead.entity';
import { Partner } from '../../../common/database_entities/partner.entity';
import { PartnerChanged } from '../../../common/database_entities/partner_changed.entity';
import {
  EnumReportTypeActivity,
  EnumMovementTypesNumbers,
  EnumReportTypeScore,
  EnumMovementTypes,
} from '../../../common/constants';
import { Reports } from '../../../common/database_entities/reports.entity';
import { EnumReportTypeCommissions } from '../../../common/constants';
import { MonthlyBonus } from '../../../common/database_entities/monthly_bonus.entity';
import { MonthlyGoal } from '../../../common/database_entities/monthly_goal.entity';
import { ReferredEntity } from '../../../common/database_entities/referred.entity';
import { IndividualCommissions } from '../../../common/database_entities/individual_commissions.entity';
import { Movements } from '../../../common/database_entities/movements.entity';
import { DateTime } from 'luxon';

@Injectable()
export class QueryByConceptService {
  constructor(
    @InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(CourseToPartner)
    private readonly courseToPartnerRepository: Repository<CourseToPartner>,
    @InjectRepository(RankingPartnersIndiv) private readonly rankingPartnerIndiv: Repository<RankingPartnersIndiv>,
    @InjectRepository(RankingPartnersLead) private readonly rankingPartnerLead: Repository<RankingPartnersLead>,
    @InjectRepository(PartnerChanged) private readonly partnerChanged: Repository<PartnerChanged>,
    @InjectRepository(Reports) private readonly reports: Repository<Reports>,
    @InjectRepository(IndividualCommissions) private individualCommissions: Repository<IndividualCommissions>,
    @InjectRepository(MonthlyBonus) private readonly monthlyBonus: Repository<MonthlyBonus>,
    @InjectRepository(MonthlyGoal) private readonly monthlyGoal: Repository<MonthlyGoal>,
    @InjectRepository(ReferredEntity) private readonly referred: Repository<ReferredEntity>,
    @InjectRepository(Movements) private readonly movements: Repository<Movements>,
  ) {}

  async getRankingIndividualByNumber(id: number) {
    const ranking = await this.rankingPartnerIndiv.findOne({
      relations: ['partner'],
      where: {
        partner: id,
      },
    });
    return ranking ? ranking.rank : 'No tiene nivel';
  }

  async getRankingLeaderShipByNumber(id: number) {
    const ranking = await this.rankingPartnerLead.findOne({
      relations: ['partner'],
      where: {
        partner: id,
      },
    });
    return ranking ? ranking.level : 'No tiene nivel';
  }

  async getPartnerByIdNumber(id: number) {
    const partner = await this.partnerRepository.findOne({
      relations: ['territory'],
      where: {
        id,
      },
    });
    return partner;
  }

  async getTerritoryByIdNumber(id: number) {
    const territory = await this.partnerRepository.findOne({
      relations: ['territory'],
      where: {
        id,
      },
    });
    if (territory.territory !== null) {
      return territory.territory.colony;
    }
    return 'No posee Territorio';
  }

  async getScoreByIdNumber(id: number) {
    const rankingPartner = await this.rankingPartnerIndiv.findOne({
      relations: ['partner'],
      where: {
        partner: id,
      },
    });
    return rankingPartner ? rankingPartner.score : null;
  }

  async getLevelLeadershipByIdNumber(id: number) {
    const {
      leadership_ranking: [ranking],
    } = await this.partnerRepository.findOne({
      relations: ['leadership_ranking'],
      where: {
        id,
      },
    });

    return ranking ? ranking.level : 'No Posee ranking';
  }

  async getAmountReportsByIdNumber(id: number) {
    const getAmountReports = await this.reports.find({
      relations: ['movement_type', 'partner'],
      where: {
        partner: id,
      },
    });
    const arrAmountReports = getAmountReports.reduce((a, el) => a + el.amount, 0);
    return arrAmountReports;
  }

  async getPlaceOfPartnerByIdNumber(id: number) {
    const getPlaceOfPartner = await this.partnerRepository.findOne({
      relations: ['territory'],
      where: { id: id },
    });
    if (getPlaceOfPartner.territory !== null) {
      return { municipality: getPlaceOfPartner.territory.municipality, estado: getPlaceOfPartner.territory.state };
    } else {
      return {
        municipality: 'No tiene municipalidad',
        estado: 'No tiene estado',
      };
    }
  }

  async getReferredByIdNumber(id: number) {
    const getReferred = await this.referred.findOne({
      relations: ['partner'],
      where: {
        partner: id,
      },
    });
    return getReferred ? getReferred.partner.id : 'No tiene referido';
  }

  async getQuantityReferredByPartnerId(id: number) {
    const getQuantityReferred = await this.referred.find({
      relations: ['partner'],
      where: {
        partner: id,
      },
    });
    getQuantityReferred.length;
  }

  async getQuantityReferredWithActivationByPartnerId(id: number) {
    const getReferred = await this.referred.find({
      relations: ['partner', 'referred'],
      where: {
        partner: id,
      },
    });
    const getPartner = await this.reports.findOne({
      relations: ['movement_type', 'partner'],
      where: {
        partner: id,
      },
    });
    const idPartners = [];
    for (let i = 0; i < getReferred.length; i++) {
      if (getReferred[i] !== null) {
        if (getPartner.movement_type !== null) {
          idPartners.push(getReferred[i].referred.id);
        } else {
          idPartners.push(null);
        }
      } else {
        idPartners.push(null);
      }
    }
    const set = new Set(idPartners);
    return Array.from(set).length;
  }

  async checkDateAndReasonOfAssociateByIdNumber(id: number) {
    const getAssociate = await this.partnerRepository.findOne({
      where: {
        id: id,
      },
    });

    if (getAssociate.rejectedDate === null) {
      return 'No tiene fecha o razon de rechazo';
    }
    if (getAssociate.rejectedDate !== null) {
      const dischargeDate = new Date(getAssociate.rejectedDate);
      const takeDischargeDate = `${dischargeDate.getFullYear()}-${
        dischargeDate.getMonth() + 1
      }-${dischargeDate.getDate()}`;
      return takeDischargeDate;
    }
  }

  async getIndividualCommissionsByPartnerIdWeekly(id: number) {
    const individualCommiss = await this.individualCommissions.find({
      relations: ['partner'],
      where: {
        partner: id,
      },
    });
    if (individualCommiss.length > 0) {
      return {
        quantity_desembolsos_first: individualCommiss.reduce((acc, el) => acc + el.quantity_desembolsos_first, 0),
        amount_desembolsos_first: individualCommiss.reduce((acc, el) => acc + el.amount_desembolsos_first, 0),
        quantity_desembolsos_second: individualCommiss.reduce((acc, el) => acc + el.quantity_desembolsos_second, 0),
        amount_desembolsos_second: individualCommiss.reduce((acc, el) => acc + el.amount_desembolsos_second, 0),
      };
    } else {
      return {
        quantity_desembolsos_first: 0,
        amount_desembolsos_first: 0,
        quantity_desembolsos_second: 0,
        amount_desembolsos_second: 0,
      };
    }
  }

  async getMovementsByDate() {
    const date = new Date();
    const prevDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; // fecha con mes pasado
    const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const movements = await this.movements.find({
      relations: ['movement_types'],
      where: {
        date_movement: Between(prevDate, currentDate),
      },
    });
    return movements;
  }

  async getAmountAndQuantityMonthly() {
    const currentDate = new Date();
    const currentWeek = DateTime.local(currentDate).weekNumber;
    let getCommissionsMonthly: any;
    switch (currentWeek) {
      case currentWeek === 1:
        getCommissionsMonthly = await this.individualCommissions.find({
          where: {
            week: Between(50, 1),
          },
        });
      case currentWeek === 2:
        getCommissionsMonthly = await this.individualCommissions.find({
          where: {
            week: Between(51, 2),
          },
        });
      case currentWeek === 3:
        getCommissionsMonthly = await this.individualCommissions.find({
          where: {
            week: Between(52, 3),
          },
        });
      default:
        getCommissionsMonthly = await this.individualCommissions.find({
          where: {
            week: Between(currentWeek - 3, currentWeek),
          },
        });
    }
    if (currentWeek !== null) {
      return {
        amountTramo1: await getCommissionsMonthly.reduce((acc: any, el: any) => acc + el.amount_desembolsos_first, 0),
        quantityTramo1: await getCommissionsMonthly.reduce(
          (acc: any, el: any) => acc + el.quantity_desembolsos_first,
          0,
        ),
        amountTramo2: await getCommissionsMonthly.reduce((acc: any, el: any) => acc + el.amount_desembolsos_second, 0),
        quantityTramo2: await getCommissionsMonthly.reduce(
          (acc: any, el: any) => acc + el.quantity_desembolsos_second,
          0,
        ),
      };
    } else {
      return {
        message: 'No se encontraron comisiones',
      };
    }
  }
  // -----------------------------------------------------------------------------------------------------------------------------

  async getAssociatesReportByTypeFromDateToDate({
    type,
    from,
    to,
    exportCsv,
    page,
    limit,
  }: {
    type: EnumReportTypeAssociates;
    from: string;
    to: string;
    exportCsv?: boolean;
    page?: number;
    limit?: number;
  }): Promise<any> {
    switch (type) {
      case EnumReportTypeAssociates.STATUS_ASSOCCIATE:
        const multiplicationAssoc = limit * page;
        const associates = await this.partnerRepository.find({
          skip: multiplicationAssoc,
          take: limit,
          relations: ['territory'],
          where: [
            {
              createdAt: Between(from, to),
              status: Between(AsociadoStatusReports.USER_VALIDATED, AsociadoStatusReports.REJECTED),
            },
          ],
        });
        const arr = await Promise.all(
          associates.map(async (el: any) => {
            let affiliationDateNotExists: any;
            let affiliationDate: any;
            let takeAffiliationDate: any;
            if (el.name === null && el.lastName === null) {
              el.name = '';
              el.lastName = '';
            }
            if (el.dischargeDate !== null) {
              affiliationDate = new Date(el.dischargeDate);
              takeAffiliationDate = `${affiliationDate.getFullYear()}-${
                affiliationDate.getMonth() + 1
              }-${affiliationDate.getDate()}`;
            } else {
              affiliationDateNotExists = 'No tiene fecha de afiliacion';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  semanaDeAfiliacion: el.week ? el.week : '',
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  status: el.status ? el.status : '',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.id),
                  nivelDeLiderazgo: await this.getLevelLeadershipByIdNumber(el.id),
                  referred: await this.getReferredByIdNumber(el.id),
                  folioAsociado: el.folio ? el.folio : '',
                  nombreCompleto: el.name + ' ' + el.lastName,
                  genero: el.gender ? el.gender : '',
                  fechaDeNacimiento: el.birthDate ? el.birthDate : '',
                  codigoPostal: el.zipcode ? el.zipcode : '',
                  calle: el.street ? el.street : '',
                  numeroInterior: el.internalNumber ? el.internalNumber : '',
                  numeroExterior: el.externalNumber ? el.externalNumber : '',
                  municipio: (await this.getPlaceOfPartnerByIdNumber(el.id)).municipality
                    ? (await this.getPlaceOfPartnerByIdNumber(el.id)).municipality
                    : '',
                  estado: (await this.getPlaceOfPartnerByIdNumber(el.id)).estado
                    ? (await this.getPlaceOfPartnerByIdNumber(el.id)).estado
                    : '',
                  nacionalidad: el.nationality ? el.nationality : '',
                  edad: el.age ? el.age : '',
                  estadoCivil: el.civilStatus ? el.civilStatus : '',
                  telefonoCelular: el.mobileNumber ? el.mobileNumber : '',
                  correo: el.email ? el.email : '',
                  curp: el.curp ? el.curp : '',
                  rfc: el.rfc ? el.rfc : '',
                  territorio: el.territory ? el.territory.colony : '',
                  banco: el.bank ? el.bank : '',
                  numeroDeCuentaBancario: el.accountNumber ? el.accountNumber : '',
                  clabe: el.clabe ? el.clabe : '',
                }
              : {
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  statusDelAsociado: el.status ? el.status : '',
                  nivelDeAsociado: (await this.getRankingIndividualByNumber(el.id))
                    ? await this.getRankingIndividualByNumber(el.id)
                    : '',
                  folioAsociado: el.folio ? el.folio : '',
                  nombreCompleto: el.name + ' ' + el.lastName ? el.lastName : '',
                  rfc: el.rfc ? el.rfc : '',
                  territorio: el.territory ? el.territory.colony : '',
                };
          }),
        );
        return {
          quantity: arr.length,
          data: arr,
        };
      case EnumReportTypeAssociates.CHANGE_DATA:
        const multiplicationChangeData = limit * page;
        const partnerChanged = await this.partnerChanged.find({
          relations: ['partner'],
          skip: multiplicationChangeData,
          take: limit,
          where: {
            createdAt: Between(from, to),
          },
        });
        const arrChanged = await Promise.all(
          partnerChanged.map(async (el: any) => {
            let affiliationDateNotExists: any;
            let affiliationDate: any;
            let takeAffiliationDate: any;
            if (el.partner.dischargeDate !== null) {
              affiliationDate = new Date(el.partner.dischargeDate);
              takeAffiliationDate = `${affiliationDate.getFullYear()}-${
                affiliationDate.getMonth() + 1
              }-${affiliationDate.getDate()}`;
            } else {
              affiliationDateNotExists = 'No tiene fecha de afiliacion';
            }
            let changeDate = new Date(el.createdAt);
            let takeChangeDate: any;
            if (changeDate !== null) {
              takeChangeDate = `${changeDate.getFullYear()}-${changeDate.getMonth() + 1}-${changeDate.getDate()}`;
            } else {
              takeChangeDate = 'No tiene fecha de cambio';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  fechaDeCambio: takeChangeDate,
                  fechaDeAutorizacionORechazo: await this.checkDateAndReasonOfAssociateByIdNumber(el.partner.id),
                  motivoRechazo: el.partner.rejectedReason ? el.partner.rejectedReason : 'Sin motivo de rechazo',
                  folioAsociado: el.partner.folio,
                  nombreCompleto: el.nombreCompleto,
                  bancoAnterior: el.bank,
                  numeroCuentaAnterior: el.accountNumber,
                  clabeAnterior: el.clabe,
                  bancoNuevo: el.partner.bank,
                  numeroCuentaNueva: el.partner.accountNumber,
                  clabeNueva: el.partner.clabe,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  status: `${el.status}`,
                  territorio: (await this.getPartnerByIdNumber(el.id)).territory.colony
                    ? (await this.getPartnerByIdNumber(el.id)).territory.colony
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.id),
                  rfc: el.rfc,
                }
              : {
                  folioAsociado: el.partner.folio,
                  nombreCompleto: el.nombreCompleto,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  status: el.status,
                  territorio: (await this.getPartnerByIdNumber(el.id)).territory.colony
                    ? (await this.getPartnerByIdNumber(el.id)).territory.colony
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.id),
                  rfc: el.rfc,
                };
          }),
        );
        return {
          quantity: arrChanged.length,
          data: arrChanged,
        };
      case EnumReportTypeAssociates.UNFINISHED_AFFILIATIONS:
        const multiplicationUnfinished = limit * page;
        const unfinished = await this.partnerRepository.find({
          relations: ['territory'],
          skip: multiplicationUnfinished,
          take: limit,
          where: {
            createdAt: Between(from, to),
          },
        });
        const filterUnfinished = unfinished.filter(
          el =>
            el.status === AsociadoStatus.ONBOARDING ||
            el.status === AsociadoStatus.ONBOARDING_FILES ||
            el.status === AsociadoStatus.TRAINING_PENDING ||
            el.status === AsociadoStatus.TRAINING_COMPLETED,
        );
        const arrUnfinished = await Promise.all(
          filterUnfinished.map(async (el: any) => {
            let affiliationDateNotExists: any;
            let affiliationDate: any;
            let takeAffiliationDate: any;
            if (el.dischargeDate !== null) {
              affiliationDate = new Date(el.dischargeDate);
              takeAffiliationDate = `${affiliationDate.getFullYear()}-${
                affiliationDate.getMonth() + 1
              }-${affiliationDate.getDate()}`;
            } else {
              affiliationDateNotExists = 'No tiene fecha de afiliacion';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  semanaDeAfiliacion: el.week,
                  motivoStatus: el.rejectedReason ? el.rejectedReason : 'Sin motivo de rechazo',
                  referred: await this.getReferredByIdNumber(el.id),
                  genero: el.gender,
                  fechaDeNacimiento: el.birthDate,
                  codigoPostal: el.zipcode,
                  calle: el.street,
                  numeroInterior: el.internalNumber,
                  numeroExterior: el.externalNumber,
                  municipio: (await this.getPlaceOfPartnerByIdNumber(el.id)).municipality,
                  estado: (await this.getPlaceOfPartnerByIdNumber(el.id)).estado,
                  nacionalidad: el.nationality,
                  edad: el.age,
                  estadoCivil: el.civilStatus,
                  telefonoCelular: el.mobileNumber,
                  correo: el.email,
                  curp: el.curp,
                  banco: el.bank,
                  numeroDeCuentaBancario: el.accountNumber,
                  clabe: el.clabe,
                  folioAsociado: el.folio,
                  nombreCompleto: el.name + ' ' + el.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  status: el.status,
                  territorio: el.territory.colony ? el.territory.colony : 'No tiene territorio',
                  rfc: el.rfc,
                }
              : {
                  folioAsociado: el.folio,
                  nombreCompleto: el.name + ' ' + el.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  status: el.status,
                  territorio: el.territory.colony ? el.territory.colony : 'No tiene territorio',
                  rfc: el.rfc,
                };
          }),
        );
        return {
          quantity: arrUnfinished.length,
          data: arrUnfinished,
        };
      case EnumReportTypeAssociates.STATUS_COURSE:
        const multiplicationStatus = limit * page;
        const courseToPartner = await this.courseToPartnerRepository.find({
          relations: ['course', 'partner'],
          skip: multiplicationStatus,
          take: limit,
          where: {
            createdAt: Between(from, to),
          },
        });
        const coursesStatus = await Promise.all(
          courseToPartner.map(async (el: any) => {
            let evaluationDateNotExists: any;
            let evaluationDate: any;
            let takeEvaluationDate: any;
            if (el.evaluationDate !== null) {
              evaluationDate = new Date(el.evaluationDate);
              takeEvaluationDate = `${evaluationDate.getFullYear()}-${
                evaluationDate.getMonth() + 1
              }-${evaluationDate.getDate()}`;
            } else {
              evaluationDateNotExists = 'No tiene fecha de evaluacion';
            }
            switch (el.status) {
              case 0:
                el.status = 'Pendiente';
                break;
              case 1:
                el.status = 'Aprobado';
                break;
              case 2:
                el.status = 'Desaprobado';
                break;
              default:
                el.status = 'No tiene status';
            }
            return exportCsv
              ? {
                  fechaDeEvaluacion: takeEvaluationDate ? takeEvaluationDate : evaluationDateNotExists,
                  folioAsociado: (await this.getPartnerByIdNumber(el.partner.id)).folio,
                  nombreCompleto:
                    (await this.getPartnerByIdNumber(el.partner.id)).name +
                    ' ' +
                    (await this.getPartnerByIdNumber(el.partner.id)).lastName,
                  nombreDelCurso: el.course.name,
                  statusDelCurso: el.status,
                  notaDelCurso: el.score,
                }
              : {
                  fechaDeEvaluacion: takeEvaluationDate ? takeEvaluationDate : evaluationDateNotExists,
                  folioAsociado: (await this.getPartnerByIdNumber(el.partner.id)).folio,
                  nombreCompleto:
                    (await this.getPartnerByIdNumber(el.partner.id)).name +
                    ' ' +
                    (await this.getPartnerByIdNumber(el.partner.id)).lastName,
                  nombreDelCurso: el.course.name,
                  statusDelCurso: el.status,
                  notaDelCurso: el.score,
                };
          }),
        );
        return {
          quantity: coursesStatus.length,
          data: coursesStatus,
        };
      default:
        return {
          message: 'No se encontró el tipo de reporte',
        };
    }
  }

  async getActivityReportByTypeFromDateToDate({
    type,
    from,
    to,
    exportCsv,
    page,
    limit,
  }: {
    type: EnumReportTypeActivity;
    from: string;
    to: string;
    exportCsv?: boolean;
    page?: number;
    limit?: number;
  }): Promise<any> {
    switch (type) {
      case EnumReportTypeActivity.DISBURSEMENTS:
        const multiplicationDisbursements = limit * page;
        const getDisbursements = await this.reports.find({
          relations: ['movement_type', 'partner'],
          skip: multiplicationDisbursements,
          take: limit,
          where: {
            createdAt: Between(from, to),
            movement_type: EnumMovementTypesNumbers.DESEMBOLSO,
          },
        });

        const arrDisbursements = await Promise.all(
          getDisbursements.map(async (el: any) => {
            const dateDisbursements = new Date(el.createdAt);
            let disbursementsDateNotExists: any;
            let disbursementsDate: any;
            let takeDisbursementsDate: any;

            if (el.createdAt !== null) {
              disbursementsDate = new Date(el.createdAt);
              takeDisbursementsDate = `${disbursementsDate.getFullYear()}-${
                disbursementsDate.getMonth() + 1
              }-${disbursementsDate.getDate()}`;
            } else {
              disbursementsDateNotExists = 'No posee fecha de desembolso';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  fechaDeDesembolso: `${dateDisbursements.getFullYear()}-${dateDisbursements.getMonth()}-${dateDisbursements.getDate()}`,
                  folio: el.partner.folio,
                  nombreCompleto: `${el.partner.name} ${el.partner.lastName}`,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? await this.getTerritoryByIdNumber(el.partner.id)
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  nivelDeLiderazgo: await this.getLevelLeadershipByIdNumber(el.partner.id),
                  cantidadDeDesembolsos: el.quantity,
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: `${el.partner.name} ${el.partner.lastName}`,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? await this.getTerritoryByIdNumber(el.partner.id)
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  cantidadDeDesembolsos: el.quantity,
                };
          }),
        );

        return {
          quantity: arrDisbursements.length,
          data: arrDisbursements,
        };
      case EnumReportTypeActivity.BUYBACKS:
        const multiplicationBuybacks = limit * page;
        const getBuybacks = await this.reports.find({
          relations: ['movement_type', 'partner'],
          skip: multiplicationBuybacks,
          take: limit,
          where: {
            createdAt: Between(from, to),
            movement_type: EnumMovementTypesNumbers.RECOMPRA,
          },
        });

        const arrBuybacks = await Promise.all(
          getBuybacks.map(async (el: any) => {
            const dateBuybacks = new Date(el.createdAt);
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  fechaDeRecompra: `${dateBuybacks.getFullYear()}-${dateBuybacks.getMonth()}-${dateBuybacks.getDate()}`,
                  folio: el.partner.folio,
                  nombreCompleto: `${el.partner.name} ${el.partner.lastName}`,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? await this.getTerritoryByIdNumber(el.partner.id)
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  nivelDeLiderazgo: await this.getLevelLeadershipByIdNumber(el.partner.id),
                  cantidadDeRecompra: el.quantity,
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? await this.getTerritoryByIdNumber(el.partner.id)
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  cantidadDeRecompra: el.quantity,
                };
          }),
        );

        return {
          quantity: arrBuybacks.length,
          data: arrBuybacks,
        };
      case EnumReportTypeActivity.QUERIES:
        const multiplicationQueries = limit * page;
        const getQueries = await this.reports.find({
          relations: ['movement_type', 'partner'],
          skip: multiplicationQueries,
          take: limit,
          where: {
            createdAt: Between(from, to),
            movement_type: EnumMovementTypesNumbers.CONSULTAS,
          },
        });

        const arrQueries = await Promise.all(
          getQueries.map(async (el: any) => {
            const dateQueries = new Date(el.createdAt);
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  fechaDeConsulta: `${dateQueries.getFullYear()}-${dateQueries.getMonth()}-${dateQueries.getDate()}`,
                  folio: el.partner.folio,
                  nombreCompleto: `${el.partner.name} ${el.partner.lastName}`,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? await this.getTerritoryByIdNumber(el.partner.id)
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  nidelDeLiderazgo: await this.getLevelLeadershipByIdNumber(el.partner.id),
                  cantidadDeConsultas: el.quantity,
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  territorio: await this.getTerritoryByIdNumber(el.partner.id),
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  cantidadDeConsultas: el.quantity,
                };
          }),
        );

        return {
          quantity: arrQueries.length,
          data: arrQueries,
        };
      case EnumReportTypeActivity.CURRENT_CASES:
        const multiplicationCurrentCases = limit * page;
        const getCurrentCases = await this.reports.find({
          relations: ['movement_type', 'partner'],
          skip: multiplicationCurrentCases,
          take: limit,
          where: {
            createdAt: Between(from, to),
            movement_type: EnumMovementTypesNumbers.CASO_AL_CORRIENTE,
          },
        });

        const currentCase = await Promise.all(
          getCurrentCases.map(async (el: any) => {
            const dateCurrentCase = new Date(el.createdAt);
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  fechaDeCasoAlCorriente: `${dateCurrentCase.getFullYear()}-${dateCurrentCase.getMonth()}-${dateCurrentCase.getDate()}`,
                  folio: el.partner.folio,
                  nombreCompleto: `${el.partner.name} ${el.partner.lastName}`,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? await this.getTerritoryByIdNumber(el.partner.id)
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  nidelDeLiderazgo: await this.getLevelLeadershipByIdNumber(el.partner.id),
                  cantidadDeCasosAlCorriente: el.quantity,
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? await this.getTerritoryByIdNumber(el.partner.id)
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  cantidadDeCasosAlCorriente: el.quantity,
                };
          }),
        );

        return {
          quantity: currentCase.length,
          data: currentCase,
        };
      default:
        return {
          message: 'No se encontró el tipo de reporte',
        };
    }
  }

  async getScoreReportsByTypeFromDateToDate({
    type,
    from,
    to,
    exportCsv,
    page,
    limit,
  }: {
    type: EnumReportTypeScore;
    from: string;
    to: string;
    exportCsv?: boolean;
    page?: number;
    limit?: number;
  }): Promise<any> {
    switch (type) {
      case EnumReportTypeScore.ASSOCIATE_LEVEL:
        const multiplicationAssociateLevel = limit * page;
        const getAssociateLevel = await this.rankingPartnerIndiv.find({
          relations: ['partner'],
          skip: multiplicationAssociateLevel,
          take: limit,
          where: {
            createdAt: Between(from, to),
          },
        });
        // social network graph
        await this.getQuantityReferredWithActivationByPartnerId(24);
        const notNullPartners = getAssociateLevel.filter((el: any) => el.partner !== null);
        const arrAssociateLevel = notNullPartners.filter(el => el.partner.status === AsociadoStatus.ACTIVE);
        const arrAssociateLevels = await Promise.all(
          arrAssociateLevel.map(async (el: any) => {
            let dateDischargeDate: any;
            let takedateDischargeDate: any;
            let dischargeDateNotExists: any;
            if (el.partner.dischargeDate !== null) {
              dateDischargeDate = new Date(el.partner.dischargeDate);
              takedateDischargeDate = `${dateDischargeDate.getFullYear()}-${dateDischargeDate.getMonth()}-${dateDischargeDate.getDate()}`;
            } else {
              dischargeDateNotExists = 'No tiene fecha de afiliación';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  folio: el.partner.folio,
                  nombreCompleto: `${el.partner.name} ${el.partner.lastName}`,
                  fechaDeAfiliacion: takedateDischargeDate ? takedateDischargeDate : dischargeDateNotExists,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? `${await this.getTerritoryByIdNumber(el.partner.id)}`
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  puntaje: await this.getScoreByIdNumber(el.partner.id),
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: `${el.partner.name} ${el.partner.lastName}`,
                  fechaDeAfiliacion: takedateDischargeDate ? takedateDischargeDate : dischargeDateNotExists,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? `${await this.getTerritoryByIdNumber(el.partner.id)}`
                    : 'No tiene territorio',
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  puntaje: await this.getScoreByIdNumber(el.partner.id),
                };
          }),
        );
        return {
          quantity: arrAssociateLevels.length,
          data: arrAssociateLevels,
        };
      case EnumReportTypeScore.LEADERSHIP_LEVEL:
        const multiplicationLeadershipLevel = limit * page;
        const getLeaderShipLevel = await this.rankingPartnerLead.find({
          relations: ['partner'],
          skip: multiplicationLeadershipLevel,
          take: limit,
          where: {
            createdAt: Between(from, to),
          },
        });

        const arrPartnerShipLevel = getLeaderShipLevel.filter(el => el.partner.status === AsociadoStatus.ACTIVE);

        const arrpartnerShipLevels = await Promise.all(
          arrPartnerShipLevel.map(async (el: any) => {
            let dischargeDate: any;
            let takeDischargeDate: any;
            let dischargeDateNotExists: any;
            if (el.partner.dischargeDate !== null) {
              dischargeDate = new Date(el.partner.dischargeDate);
              takeDischargeDate = `${dischargeDate.getFullYear()}-${dischargeDate.getMonth()}-${dischargeDate.getDate()}`;
            } else {
              dischargeDateNotExists = 'No tiene fecha de afiliación';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  folio: el.partner.folio,
                  nombreCompleto: `${el.partner.name} ${el.partner.lastName}`,
                  fechaDeAfiliacion: el.partner.dischargeDate ? takeDischargeDate : dischargeDateNotExists,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? `${await this.getTerritoryByIdNumber(el.partner.id)}`
                    : 'No tiene territorio',
                  nidelDeLiderazgo: await this.getLevelLeadershipByIdNumber(el.partner.id),
                  puntaje: await this.getScoreByIdNumber(el.partner.id),
                  red: await this.getQuantityReferredByPartnerId(el.partner.id),
                  activacion: await this.getQuantityReferredWithActivationByPartnerId(el.partner.id),
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: `${el.partner.name} ${el.partner.lastName}`,
                  fechaDeAfiliacion: el.partner.dischargeDate ? takeDischargeDate : dischargeDateNotExists,
                  territorio: (await this.getTerritoryByIdNumber(el.partner.id))
                    ? `${await this.getTerritoryByIdNumber(el.partner.id)}`
                    : 'No tiene territorio',
                  nidelDeLiderazgo: await this.getLevelLeadershipByIdNumber(el.partner.id),
                  puntaje: await this.getScoreByIdNumber(el.partner.id),
                  red: await this.getQuantityReferredByPartnerId(el.partner.id),
                  activacion: await this.getQuantityReferredWithActivationByPartnerId(el.partner.id),
                };
          }),
        );

        return {
          quantity: arrpartnerShipLevels.length,
          data: arrpartnerShipLevels,
        };
      default:
        return {
          message: 'No se encontró el tipo de reporte',
        };
    }
  }

  async getCommissReportsByTypeFromDateToDate({
    type,
    from,
    to,
    exportCsv,
    page,
    limit,
  }: {
    type: EnumReportTypeCommissions;
    from: string;
    to: string;
    exportCsv?: boolean;
    page?: number;
    limit?: number;
  }): Promise<any> {
    switch (type) {
      case EnumReportTypeCommissions.WEEKLY_INDIVIDUAL:
        const multiplicationWeeklyIndividual = limit * page;
        const getWeeklyIndividual = await this.reports.find({
          relations: ['movement_type', 'partner'],
          skip: multiplicationWeeklyIndividual,
          take: limit,
          where: {
            createdAt: Between(from, to),
          },
        });
        const arrWeeklyIndividualFilteredByActivity = getWeeklyIndividual;
        const getQueries = () => {
          return {
            amount: arrWeeklyIndividualFilteredByActivity
              .filter(el => el.movement_type.name === EnumMovementTypes.CONSULTAS)
              .reduce((acc, el) => acc + el.amount, 0),
            quantity: arrWeeklyIndividualFilteredByActivity.filter(
              el => el.movement_type.name === EnumMovementTypes.CONSULTAS,
            ).length,
          };
        };
        const getDisbursements = () => {
          return {
            amount: arrWeeklyIndividualFilteredByActivity
              .filter(el => el.movement_type.name === EnumMovementTypes.DESEMBOLSO)
              .reduce((acc, el) => acc + el.amount, 0),
            quantity: arrWeeklyIndividualFilteredByActivity.filter(
              el => el.movement_type.name === EnumMovementTypes.DESEMBOLSO,
            ).length,
          };
        };
        const getCurrentCases = () => {
          return {
            amount: arrWeeklyIndividualFilteredByActivity
              .filter(el => el.movement_type.name === EnumMovementTypes.CASO_AL_CORRIENTE)
              .reduce((acc, el) => acc + el.amount, 0),
            quantity: arrWeeklyIndividualFilteredByActivity.filter(
              el => el.movement_type.name === EnumMovementTypes.CASO_AL_CORRIENTE,
            ).length,
          };
        };
        const getBuyBacks = () => {
          return {
            amount: arrWeeklyIndividualFilteredByActivity
              .filter(el => el.movement_type.name === EnumMovementTypes.RECOMPRA)
              .reduce((acc, el) => acc + el.amount, 0),
            quantity: arrWeeklyIndividualFilteredByActivity.filter(
              el => el.movement_type.name === EnumMovementTypes.RECOMPRA,
            ).length,
          };
        };

        const arrWeeklyIndividual = Promise.all(
          arrWeeklyIndividualFilteredByActivity.map(async (el: any) => {
            let affiliationDateNotExists: any;
            let affiliationDate: any;
            let takeAffiliationDate: any;
            if (el.partner.dischargeDate !== null) {
              affiliationDate = new Date(el.partner.dischargeDate);
              takeAffiliationDate = `${affiliationDate.getFullYear()}-${
                affiliationDate.getMonth() + 1
              }-${affiliationDate.getDate()}`;
            } else {
              affiliationDateNotExists = 'No tiene fecha de afiliacion';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  territorio: await this.getTerritoryByIdNumber(el.partner.id),
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  montoTotalComisiones: await this.getAmountReportsByIdNumber(el.partner.id),
                  cantidadDesembolsos: getDisbursements().quantity,
                  comisionesDesembolsos: getDisbursements().amount,
                  cantidadConsultas: getQueries().quantity,
                  comisionesConsultas: getQueries().amount,
                  cantidadRecompras: getBuyBacks().quantity,
                  comisionesRecompras: getBuyBacks().amount,
                  cantidadCasosAlCorriente: getCurrentCases().quantity,
                  comisionesCasosAlCorriente: getCurrentCases().amount,
                  cantidadDesembolsosTramo1: (await this.getIndividualCommissionsByPartnerIdWeekly(el.partner.id))
                    .quantity_desembolsos_first,
                  montoDesembolsosTramo1: (await this.getIndividualCommissionsByPartnerIdWeekly(el.partner.id))
                    .amount_desembolsos_first,
                  cantidadDesembolsosTramo2: (await this.getIndividualCommissionsByPartnerIdWeekly(el.partner.id))
                    .quantity_desembolsos_second,
                  montoDesembolsosTramo2: (await this.getIndividualCommissionsByPartnerIdWeekly(el.partner.id))
                    .amount_desembolsos_second,
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  territorio: await this.getTerritoryByIdNumber(el.partner.id),
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  montoTotalComisiones: await this.getAmountReportsByIdNumber(el.partner.id),
                };
          }),
        );
        return {
          quantity: (await arrWeeklyIndividual).length,
          data: await arrWeeklyIndividual,
        };
      case EnumReportTypeCommissions.MONTHLY_INDIVIDUAL:
        const multiplicationMonthlyIndividual = limit * page;
        const getMonthlyIndividual = await this.monthlyBonus.find({
          relations: ['partner'],
          skip: multiplicationMonthlyIndividual,
          take: limit,
          where: {
            createdAt: Between(from, to),
          },
        });

        const getQueriesCommissions = async () => {
          return {
            amount: (await this.getMovementsByDate())
              .filter(el => el.movement_types.name === EnumMovementTypes.CONSULTAS)
              .reduce((acc, el) => acc + parseInt(el.amount), 0),
            quantity: (await this.getMovementsByDate()).length,
          };
        };

        const getDisbursementsCommissions = async () => {
          return {
            amount: (await this.getMovementsByDate())
              .filter(el => el.movement_types.name === EnumMovementTypes.DESEMBOLSO)
              .reduce((acc, el) => acc + parseInt(el.amount), 0),
            quantity: (await this.getMovementsByDate()).length,
          };
        };

        const getBuyBacksCommissions = async () => {
          return {
            amount: (await this.getMovementsByDate())
              .filter(el => el.movement_types.name === EnumMovementTypes.RECOMPRA)
              .reduce((acc, el) => acc + parseInt(el.amount), 0),
            quantity: (await this.getMovementsByDate()).length,
          };
        };

        const getCurrentCasesCommissions = async () => {
          return {
            amount: (await this.getMovementsByDate())
              .filter(el => el.movement_types.name === EnumMovementTypes.CASO_AL_CORRIENTE)
              .reduce((acc, el) => acc + parseInt(el.amount), 0),
            quantity: (await this.getMovementsByDate()).length,
          };
        };

        const arrMonthlyFilteredByActivity = getMonthlyIndividual;

        const arrMonthlyIndividual = Promise.all(
          arrMonthlyFilteredByActivity.map(async (el: any) => {
            let affiliationDateNotExists: any;
            let affiliationDate: any;
            let takeAffiliationDate: any;
            if (el.partner.dischargeDate !== null) {
              affiliationDate = new Date(el.partner.dischargeDate);
              takeAffiliationDate = `${affiliationDate.getFullYear()}-${
                affiliationDate.getMonth() + 1
              }-${affiliationDate.getDate()}`;
            } else {
              affiliationDateNotExists = 'No tiene fecha de afiliacion';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  territorio: await this.getTerritoryByIdNumber(el.partner.id),
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  totalComisiones: el.total_amount,
                  comisionesConsultas: (await getQueriesCommissions()).amount,
                  cantidadConsultas: (await getQueriesCommissions()).quantity,
                  comisionesDesembolsos: (await getDisbursementsCommissions()).amount,
                  comisionesRecompras: (await getBuyBacksCommissions()).amount,
                  cantidadRecompras: (await getBuyBacksCommissions()).quantity,
                  comisionesCasosAlCorriente: (await getCurrentCasesCommissions()).amount,
                  cantidadCasosAlCorriente: (await getCurrentCasesCommissions()).quantity,
                  cantidadDesembolsosTramo1: (await this.getAmountAndQuantityMonthly()).quantityTramo1,
                  montoDesembolsosTramo1: (await this.getAmountAndQuantityMonthly()).amountTramo1,
                  cantidadDesembolsosTramo2: (await this.getAmountAndQuantityMonthly()).quantityTramo2,
                  montoDesembolsosTramo2: (await this.getAmountAndQuantityMonthly()).amountTramo2,
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  territorio: await this.getTerritoryByIdNumber(el.partner.id),
                  nivelDeAsociado: await this.getRankingIndividualByNumber(el.partner.id),
                  totalComisiones: el.total_amount,
                };
          }),
        );
        return {
          quantity: (await arrMonthlyIndividual).length,
          data: await arrMonthlyIndividual,
        };
      case EnumReportTypeCommissions.WEEKLY_LEADERSHIP:
        const multiplicationWeeklyLeadership = limit * page;
        const getWeeklyLeaderShip = await this.reports.find({
          relations: ['movement_type', 'partner'],
          skip: multiplicationWeeklyLeadership,
          take: limit,
          where: {
            createdAt: Between(from, to),
          },
        });
        const arrWeeklyLeaderShipFilteredByActivity = getWeeklyLeaderShip;
        const getTotalAmountAndQuantity = async (id: number) => {
          const referred = await this.getReferredByIdNumber(id);
          if (referred !== 'No tiene referido') {
            const movements = await this.movements.find({
              relations: ['movement_types'],
              where: {
                partnerId: referred,
              },
            });
            const filteredQueriesMovements = movements.filter(
              el => el.movement_types.name === EnumMovementTypes.CONSULTAS,
            );
            const filteredDisbursementsMovements = movements.filter(
              el => el.movement_types.name === EnumMovementTypes.DESEMBOLSO,
            );
            const filteredBuyBackMovements = movements.filter(
              el => el.movement_types.name === EnumMovementTypes.RECOMPRA,
            );

            const amountfilteredQueriesMovements = filteredQueriesMovements.reduce(
              (acc, el) => acc + parseInt(el.amount),
              0,
            );
            const amountFilteredDisbursementsMovements = filteredDisbursementsMovements.reduce(
              (acc, el) => acc + parseInt(el.amount),
              0,
            );
            const amountFilteredBuyBackMovements = filteredBuyBackMovements.reduce(
              (acc, el) => acc + parseInt(el.amount),
              0,
            );
            return {
              queriesAmount: amountfilteredQueriesMovements,
              queriesQuantity: filteredQueriesMovements.length,
              networkCreditsAmount: amountFilteredDisbursementsMovements + amountFilteredBuyBackMovements,
              networkDisbursementsQuantity: filteredDisbursementsMovements.length,
              networkBuyBacksQuantity: filteredBuyBackMovements.length,
            };
          } else {
            return {
              amount: 0,
              quantity: 0,
            };
          }
        };

        const arrWeeklyLeaderShip = Promise.all(
          arrWeeklyLeaderShipFilteredByActivity.map(async (el: any) => {
            let affiliationDateNotExists: any;
            let affiliationDate: any;
            let takeAffiliationDate: any;
            if (el.partner.dischargeDate !== null) {
              affiliationDate = new Date(el.partner.dischargeDate);
              takeAffiliationDate = `${affiliationDate.getFullYear()}-${
                affiliationDate.getMonth() + 1
              }-${affiliationDate.getDate()}`;
            } else {
              affiliationDateNotExists = 'No tiene fecha de afiliacion';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  territorio: await this.getTerritoryByIdNumber(el.partner.id),
                  nivelDeLiderazgo: await this.getRankingLeaderShipByNumber(el.partner.id),
                  montoTotalComisiones: await this.getAmountReportsByIdNumber(el.partner.id),
                  comisionesConsultasRed: (await getTotalAmountAndQuantity(el.partner.id)).queriesAmount,
                  consultasRed: (await getTotalAmountAndQuantity(el.partner.id)).queriesQuantity,
                  comisionesCreditosRed: (await getTotalAmountAndQuantity(el.partner.id)).networkCreditsAmount,
                  cantidadDesembolsosRed: (await getTotalAmountAndQuantity(el.partner.id)).networkDisbursementsQuantity,
                  cantidadRecomprasRed: (await getTotalAmountAndQuantity(el.partner.id)).networkBuyBacksQuantity,
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  territorio: await this.getTerritoryByIdNumber(el.partner.id),
                  nivelDeAsociado: await this.getRankingLeaderShipByNumber(el.partner.id),
                  montoTotalComisiones: await this.getAmountReportsByIdNumber(el.partner.id),
                };
          }),
        );
        return {
          quantity: (await arrWeeklyLeaderShip).length,
          data: await arrWeeklyLeaderShip,
        };
      case EnumReportTypeCommissions.MONTHLY_LEADERSHIP:
        const multiplicationMonthlyLeadership = limit * page;
        const getMonthlyLeaderShip = await this.monthlyGoal.find({
          relations: ['partner'],
          skip: multiplicationMonthlyLeadership,
          take: limit,
          where: {
            createdAt: Between(from, to),
          },
        });

        const arrFilteredByActivity = getMonthlyLeaderShip;

        const getTotalAmountAndQuantitys = async (id: number) => {
          const referred = await this.getReferredByIdNumber(id);
          if (referred !== 'No tiene referido') {
            const movements = await this.movements.find({
              relations: ['movement_types'],
              where: {
                partnerId: referred,
              },
            });
            const filteredQueriesMovements = movements.filter(
              el => el.movement_types.name === EnumMovementTypes.CONSULTAS,
            );
            const filteredDisbursementsMovements = movements.filter(
              el => el.movement_types.name === EnumMovementTypes.DESEMBOLSO,
            );
            const filteredBuyBackMovements = movements.filter(
              el => el.movement_types.name === EnumMovementTypes.RECOMPRA,
            );

            const amountfilteredQueriesMovements = filteredQueriesMovements.reduce(
              (acc, el) => acc + parseInt(el.amount),
              0,
            );
            const amountFilteredDisbursementsMovements = filteredDisbursementsMovements.reduce(
              (acc, el) => acc + parseInt(el.amount),
              0,
            );
            const amountFilteredBuyBackMovements = filteredBuyBackMovements.reduce(
              (acc, el) => acc + parseInt(el.amount),
              0,
            );
            return {
              queriesAmount: amountfilteredQueriesMovements,
              queriesQuantity: filteredQueriesMovements.length,
              networkCreditsAmount: amountFilteredDisbursementsMovements + amountFilteredBuyBackMovements,
              networkDisbursementsQuantity: filteredDisbursementsMovements.length,
              networkBuyBacksQuantity: filteredBuyBackMovements.length,
            };
          } else {
            return {
              amount: 0,
              quantity: 0,
            };
          }
        };

        const arrMonthlyLeaderShip = Promise.all(
          arrFilteredByActivity.map(async (el: any) => {
            let affiliationDateNotExists: any;
            let affiliationDate: any;
            let takeAffiliationDate: any;
            if (el.partner.dischargeDate !== null) {
              affiliationDate = new Date(el.partner.dischargeDate);
              takeAffiliationDate = `${affiliationDate.getFullYear()}-${
                affiliationDate.getMonth() + 1
              }-${affiliationDate.getDate()}`;
            } else {
              affiliationDateNotExists = 'No tiene fecha de afiliacion';
            }
            switch (el.status) {
              case 0:
                el.status = 'Creado';
                break;
              case 1:
                el.status = 'Validado';
                break;
              case 2:
                el.status = 'Carga de datos';
                break;
              case 3:
                el.status = 'Carga de archivos';
                break;
              case 4:
                el.status = 'Entrenamiento Pendiente';
                break;
              case 5:
                el.status = 'Entrenamiento Completado';
                break;
              case 6:
                el.status = 'Activo';
                break;
              case 7:
                el.status = 'Inactivo o Rechazado';
                break;
              default:
                el.status = 'No tiene estado';
            }
            return exportCsv
              ? {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  territorio: await this.getTerritoryByIdNumber(el.partner.id),
                  nivelDeLiderazgo: await this.getRankingLeaderShipByNumber(el.partner.id),
                  montoTotalComisiones: el.partner.total_amount,
                  comisionesConsultasRed: (await getTotalAmountAndQuantitys(el.partner.id)).queriesAmount,
                  comisionesCreditosRed: (await getTotalAmountAndQuantitys(el.partner.id)).networkCreditsAmount,
                  metaParaBonificar: el.goal,
                  consultasRed: (await getTotalAmountAndQuantitys(el.partner.id)).queriesQuantity,
                  cantidadDesembolsosRed: (await getTotalAmountAndQuantitys(el.partner.id))
                    .networkDisbursementsQuantity,
                  cantidadRecomprasRed: (await getTotalAmountAndQuantitys(el.partner.id)).networkBuyBacksQuantity,
                }
              : {
                  folio: el.partner.folio,
                  nombreCompleto: el.partner.name + ' ' + el.partner.lastName,
                  fechaDeAfiliacion: takeAffiliationDate ? takeAffiliationDate : affiliationDateNotExists,
                  territorio: await this.getTerritoryByIdNumber(el.partner.id),
                  nivelDeAsociado: await this.getRankingLeaderShipByNumber(el.partner.id),
                  montoTotalComisiones: el.partner.total_amount,
                  comisionesConsultasRed: (await getTotalAmountAndQuantitys(el.partner.id)).queriesAmount,
                  comisionesCreditosRed: (await getTotalAmountAndQuantitys(el.partner.id)).networkCreditsAmount,
                  metaParaBonificar: el.goal,
                  consultasRed: (await getTotalAmountAndQuantitys(el.partner.id)).queriesQuantity,
                  cantidadDesembolsosRed: (await getTotalAmountAndQuantitys(el.partner.id))
                    .networkDisbursementsQuantity,
                  cantidadRecomprasRed: (await getTotalAmountAndQuantitys(el.partner.id)).networkBuyBacksQuantity,
                };
          }),
        );
        return {
          quantity: (await arrMonthlyLeaderShip).length,
          data: await arrMonthlyLeaderShip,
        };
      default:
        return {
          message: 'No se encontró el tipo de reporte',
        };
    }
  }
}
