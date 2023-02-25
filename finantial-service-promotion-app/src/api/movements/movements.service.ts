import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movements } from 'src/common/database_entities/movements.entity';
import { Between, Repository } from 'typeorm';
import { Partner } from 'src/common/database_entities/partner.entity';
import { ReportHasMovements } from 'src/common/database_entities/report_has_movement.entity';
import {
  AsociadoStatus,
  EnumApplicationsType,
  EnumCuatrimRanking,
  EnumLeaderRank,
  EnumMovementsStatus,
  EnumMovementTypes,
  EnumPeriodRanking,
  EnumRankPartnerIndividual,
  EnumRankType,
} from 'src/common/constants';
import { Reports } from 'src/common/database_entities/reports.entity';
import { MovementTypes } from 'src/common/database_entities/movement_types.entity';
import { RankingIndividual } from 'src/common/database_entities/rankingIndividual.entity';
import { RankingPartnersLead } from 'src/common/database_entities/rankingPartnersLead.entity';
import { ReferredEntity } from 'src/common/database_entities/referred.entity';
import { RankingPartnersIndiv } from 'src/common/database_entities/rankingPartnersIndiv.entity';
import { of } from 'rxjs';
import { NotFoundException } from '../../config/exceptions/not.found.exception';
import { DateTime } from 'luxon';
import { Ranking } from 'src/common/database_entities/ranking_partners.entity';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movements) private movementsRepository: Repository<Movements>,
    @InjectRepository(MovementTypes) private movementTypes: Repository<MovementTypes>,
    @InjectRepository(Reports) private reportsRepository: Repository<Reports>,
    @InjectRepository(ReportHasMovements) private reportHasMovementsRepo: Repository<ReportHasMovements>,
    @InjectRepository(RankingIndividual) private rankingIndividualRepo: Repository<RankingIndividual>,
    @InjectRepository(RankingPartnersLead) private rankingPartnersLead: Repository<RankingPartnersLead>,
    @InjectRepository(RankingPartnersIndiv) private rankingPartnersIndiv: Repository<RankingPartnersIndiv>,
    @InjectRepository(ReferredEntity) private referredRepository: Repository<ReferredEntity>,
    @InjectRepository(Partner) private partnerRepository: Repository<Partner>,
    @InjectRepository(Ranking) private rankingRepository: Repository<Ranking>,
  ) {}

  //Buscar todos los movimientos de un partner, o buscar por tipo.
  async findAll({ type, partner }) {
    const result = await this.movementsRepository.find({
      where: { partner: partner },
      relations: ['movement_types'],
    });
    if (type) {
      return result.filter(index => index.movement_types.name === type);
    } else return result;
  }

  async createReport(id: number) {
    //Traemos los movimientos del partner que esten en pendiente
    const movements = await this.movementsRepository.find({
      where: { partnerId: id, status: EnumMovementsStatus.PENDING },
      relations: ['movement_types'],
    });
    if (movements.length) {
      // Traemos los tipos de movimientos
      const typeConsulta = await this.movementTypes.findOne({ where: { name: EnumMovementTypes.CONSULTAS } });
      const typeCasoAlCorriente = await this.movementTypes.findOne({
        where: { name: EnumMovementTypes.CASO_AL_CORRIENTE },
      });
      const typeDesembolso = await this.movementTypes.findOne({ where: { name: EnumMovementTypes.DESEMBOLSO } });
      const typeRecompra = await this.movementTypes.findOne({ where: { name: EnumMovementTypes.RECOMPRA } });

      // //Filtramos los movimientos por tipo
      const consultas = movements.filter(index => index.movement_types.name === EnumMovementTypes.CONSULTAS);
      const casoAlCorriente = movements.filter(
        index => index.movement_types.name === EnumMovementTypes.CASO_AL_CORRIENTE,
      );
      const recompra = movements.filter(index => index.movement_types.name === EnumMovementTypes.RECOMPRA);
      const desembolso = movements.filter(index => index.movement_types.name === EnumMovementTypes.DESEMBOLSO);

      // //Obtenemos el numero de semana actual
      const numberOfWeek = this.getNumberOfWeek();

      // //Verificamos si el arreglo de cada tipo tiene algo y hacemos el proceso de conteo, por cada tipo de movimiento
      if (consultas.length > 0) {
        let acc = 0;
        const quantity = consultas.reduce((acc, el) => acc + parseInt(el.quantity), 0);
        const partner = await this.partnerRepository.findOne({ where: { id } });
        const createCons = this.reportsRepository.create({
          amount: acc,
          week: numberOfWeek,
          quantity: quantity,
          movement_type: typeConsulta,
          partner: partner,
        });
        await this.reportsRepository.save(createCons);

        for (const [index, value] of consultas.entries()) {
          const reportHasMovCreated = this.reportHasMovementsRepo.create({
            movement: value,
            status: EnumMovementsStatus.APPLIED,
            report: createCons,
          });
          await this.reportHasMovementsRepo.save(reportHasMovCreated);
          acc = acc + parseInt(value.amount);
          if (index === consultas.length - 1) {
            await this.reportsRepository.update(createCons.id, { amount: acc });
          }
        }
      }

      if (casoAlCorriente.length > 0) {
        let acc = 0;
        const quantity = casoAlCorriente.reduce((acc, el) => acc + parseInt(el.quantity), 0);
        const partner = await this.partnerRepository.findOne({ where: { id } });
        const createCAC = this.reportsRepository.create({
          amount: acc,
          week: numberOfWeek,
          quantity: quantity,
          movement_type: typeCasoAlCorriente,
          partner: partner,
        });
        await this.reportsRepository.save(createCAC);

        for (const [index, value] of casoAlCorriente.entries()) {
          const reportHasMovCreated = this.reportHasMovementsRepo.create({
            movement: value,
            status: EnumMovementsStatus.APPLIED,
            report: createCAC,
          });
          await this.reportHasMovementsRepo.save(reportHasMovCreated);
          acc = acc + parseInt(value.amount);
          if (index === casoAlCorriente.length - 1) {
            await this.reportsRepository.update(createCAC.id, { amount: acc });
          }
        }
      }

      if (desembolso.length > 0) {
        let acc = 0;
        const quantity = desembolso.reduce((acc, el) => acc + parseInt(el.quantity), 0);
        const partner = await this.partnerRepository.findOne({ where: { id } });
        const createDesem = this.reportsRepository.create({
          amount: acc,
          week: numberOfWeek,
          quantity: quantity,
          movement_type: typeDesembolso,
          partner: partner,
        });
        await this.reportsRepository.save(createDesem);

        for (const [index, value] of desembolso.entries()) {
          const reportHasMovCreated = this.reportHasMovementsRepo.create({
            movement: value,
            status: EnumMovementsStatus.APPLIED,
            report: createDesem,
          });
          await this.reportHasMovementsRepo.save(reportHasMovCreated);
          acc = acc + parseInt(value.amount);
          if (index === desembolso.length - 1) {
            await this.reportsRepository.update(createDesem.id, { amount: acc });
          }
        }
      }

      if (recompra.length > 0) {
        let acc = 0;
        const quantity = recompra.reduce((acc, el) => acc + parseInt(el.quantity), 0);
        const partner = await this.partnerRepository.findOne({ where: { id } });
        const createRecom = this.reportsRepository.create({
          amount: acc,
          week: numberOfWeek,
          quantity: quantity,
          movement_type: typeRecompra,
          partner: partner,
        });
        await this.reportsRepository.save(createRecom);

        for (const [index, value] of recompra.entries()) {
          const reportHasMovCreated = this.reportHasMovementsRepo.create({
            movement: value,
            status: EnumMovementsStatus.APPLIED,
            report: createRecom,
          });
          await this.reportHasMovementsRepo.save(reportHasMovCreated);
          acc = acc + parseInt(value.amount);
          if (index === recompra.length - 1) {
            await this.reportsRepository.update(createRecom.id, { amount: acc });
          }
        }
      }
      movements.forEach(async index => {
        await this.movementsRepository.update(index.id, { status: EnumMovementsStatus.APPLIED });
      });
    } else {
      return {
        message: 'No se pueden realizar los reportes debido a que no existen movimientos.',
      };
    }
  }

  async generateIndividualRanking(id: number) {
    //Este EP debería ejecutarse cuatrimestralmente, primero obtenemos la fecha y mes actual.
    const currentdate = new Date();
    //Se restan cuatro meses para que siempre busque el período anterior, probado con años atrás, correcto.
    const currentMonth = currentdate.getMonth();

    //Obtenemos todos los REPORTES del partner, que son los movimientos pero resumidos.
    const reports = await this.reportsRepository.find({
      where: { partner: id },
      relations: ['movement_type'],
    });

    //Filtramos los reportes por tipo de movimiento
    const consultas = reports.filter(el => el.movement_type.name === EnumMovementTypes.CONSULTAS);
    const casosAlCorriente = reports.filter(el => el.movement_type.name === EnumMovementTypes.CASO_AL_CORRIENTE);
    const recompras = reports.filter(el => el.movement_type.name === EnumMovementTypes.RECOMPRA);
    const desembolsos = reports.filter(el => el.movement_type.name === EnumMovementTypes.DESEMBOLSO);

    //Creamos un objeto cuatrimestre con arrays para cada tipo de reporte
    const cuatrimestre = {
      consultas: [],
      casosAlCorriente: [],
      recompras: [],
      desembolsos: [],
    };

    let currentCuatri: any;
    let prevYear: any;
    let currentYear: any;
    if (currentMonth === 12 || currentMonth === 0 || currentMonth === 1 || currentMonth === 2 || currentMonth === 3) {
      currentCuatri = 1;
    }
    if (currentMonth === 4 || currentMonth === 5 || currentMonth === 6 || currentMonth === 7) {
      currentCuatri = 2;
    }
    if (currentMonth === 8 || currentMonth === 9 || currentMonth === 10 || currentMonth === 11) {
      currentCuatri = 3;
    }
    //Si es enero, filtro el cuatrimestre anterior (septiembre-octubre-noviembre-diciembre del año pasado!!!)
    if (currentMonth === 0) {
      currentCuatri = EnumCuatrimRanking.SEP_OCT_NOV_DIC;
      prevYear = currentdate.getFullYear() - 1;
      // querys
      cuatrimestre.consultas = consultas.filter(
        el => el.createdAt.getMonth() >= 8 && el.createdAt.getMonth() <= 11 && el.createdAt.getFullYear() === prevYear,
      );
      // currentCases
      cuatrimestre.casosAlCorriente = casosAlCorriente.filter(
        el => el.createdAt.getMonth() >= 8 && el.createdAt.getMonth() <= 11 && el.createdAt.getFullYear() === prevYear,
      );
      // buybacks
      cuatrimestre.recompras = recompras.filter(
        el => el.createdAt.getMonth() >= 8 && el.createdAt.getMonth() <= 11 && el.createdAt.getFullYear() === prevYear,
      );
      // disbursements
      cuatrimestre.desembolsos = desembolsos.filter(
        el => el.createdAt.getMonth() >= 8 && el.createdAt.getMonth() <= 11 && el.createdAt.getFullYear() === prevYear,
      );
    }

    //Si el mes es mayo, filtro los reportes del cuatrimestre anterior (enero-febrero-marzo-abril)
    if (currentMonth === 4) {
      currentYear = currentdate.getFullYear();
      currentCuatri = EnumCuatrimRanking.ENE_FEB_MAR_ABR;
      // querys
      cuatrimestre.consultas = consultas.filter(
        el => el.createdAt.getMonth() >= 0 && el.createdAt.getMonth() < 4 && el.createdAt.getFullYear() === currentYear,
      );
      // currentCases
      cuatrimestre.casosAlCorriente = casosAlCorriente.filter(
        el => el.createdAt.getMonth() >= 0 && el.createdAt.getMonth() < 4 && el.createdAt.getFullYear() === currentYear,
      );
      // buybacks
      cuatrimestre.recompras = recompras.filter(
        el => el.createdAt.getMonth() >= 0 && el.createdAt.getMonth() < 4 && el.createdAt.getFullYear() === currentYear,
      );
      // disbursements
      cuatrimestre.desembolsos = desembolsos.filter(
        el => el.createdAt.getMonth() >= 0 && el.createdAt.getMonth() < 4 && el.createdAt.getFullYear() === currentYear,
      );
    }

    //Si es septiembre, filtro el cuatrimestre anterior (mayo-junio-julio-agosto)
    if (currentMonth === 8) {
      currentYear = currentdate.getFullYear();
      currentCuatri = EnumCuatrimRanking.MAY_JUN_JUL_AGO;

      // querys
      cuatrimestre.consultas = consultas.filter(
        el => el.createdAt.getMonth() >= 4 && el.createdAt.getMonth() < 8 && el.createdAt.getFullYear() === currentYear,
      );
      // currentCases
      cuatrimestre.casosAlCorriente = casosAlCorriente.filter(
        el => el.createdAt.getMonth() >= 4 && el.createdAt.getMonth() < 8 && el.createdAt.getFullYear() === currentYear,
      );
      // buybacks
      cuatrimestre.recompras = recompras.filter(
        el => el.createdAt.getMonth() >= 4 && el.createdAt.getMonth() < 8 && el.createdAt.getFullYear() === currentYear,
      );
      // disbursements
      cuatrimestre.desembolsos = desembolsos.filter(
        el => el.createdAt.getMonth() >= 4 && el.createdAt.getMonth() < 8 && el.createdAt.getFullYear() === currentYear,
      );
    }

    //Traigo constantes de configuración del CMS, trae niveles (0-2) y tipos de reportes o movimientos (3-6), divido de 0 a 2 y de 3 a 6.
    const constants = await this.rankingIndividualRepo.find();

    const rankings = constants.slice(0, 3);

    const scoresConfig = constants.slice(3);

    //Le asigno un score por cada tipo de reporte, multiplico su constante por la cantidad:
    // queryScores
    const scoreConsultas = cuatrimestre.consultas.reduce((acc, el) => acc + scoresConfig[0].score * el.quantity, 0);

    //currentCaseScore
    const scoreCasoAlCorriente = cuatrimestre.casosAlCorriente.reduce(
      (acc, el) => acc + scoresConfig[1].score * el.quantity,
      0,
    );

    // disbursementScores
    const scoreDesembolsos = cuatrimestre.desembolsos.reduce((acc, el) => acc + scoresConfig[2].score * el.quantity, 0);

    // buybackScore
    const scoreRecompras = cuatrimestre.recompras.reduce((acc, el) => acc + scoresConfig[3].score * el.quantity, 0);

    // totalScore
    const totalScore = scoreConsultas + scoreCasoAlCorriente + scoreRecompras + scoreDesembolsos;

    //Creo myRank en base a la cantidad de puntaje que tenga y la producción mínima del nivel
    const minProd =
      cuatrimestre.desembolsos.reduce((acc, el) => acc + el.quantity, 0) +
      cuatrimestre.recompras.reduce((acc, el) => acc + el.quantity, 0);

    //Creo un ranking por defecto en asociado y luego mediante condicionales, verifico condiciones para ser plata u oro
    let myRank = rankings[0].level;
    if (totalScore >= rankings[1].min && totalScore < rankings[1].max) {
      if (minProd >= 6) {
        myRank = rankings[1].level;
      }
    }
    if (totalScore >= rankings[2].min && minProd >= 8) {
      myRank = rankings[2].level;
    }

    //Finalmente creo en la db el ranking cuatrimestral
    const partner = await this.partnerRepository.findOne({
      where: {
        id: id,
      },
    });

    const individual_ranking = this.rankingPartnersIndiv.create({
      rank: myRank,
      score: totalScore,
      partner: partner,
      cuatrim: currentCuatri,
    });

    await this.rankingPartnersIndiv.save(individual_ranking);
  }

  async montlhyResume(partner: Partner) {
    //Me traigo todos los reportes de un partner, con sus tipos de movimientos. Si no tiene, devuelvo un array vacío.
    const reports = await this.reportsRepository.find({
      where: {
        partner: partner.id,
      },
      relations: ['movement_type'],
      order: {
        createdAt: 'ASC',
      },
    });
    //Si tengo ranking y reportes, entonces genero el cálculo.
    if (reports.length >= 1) {
      //Me creo una fecha actual, y veo que numero de mes tengo. Filtro por mes anterior al actual.
      const currentdate = new Date();
      const month = currentdate.getMonth();
      const prev_month = month - 1 === -1 ? 11 : month - 1;
      const current_year = currentdate.getFullYear();
      const prev_year = prev_month === 11 ? current_year - 1 : current_year;
      const prevMonthReports = reports.filter(
        el => el.createdAt.getMonth() === prev_month && el.createdAt.getFullYear() === prev_year,
      );
      // Si no tengo reportes del mes anterior, devuelvo el resultado vacio
      if (prevMonthReports.length > 0) {
        //De los reportes del mes previo al actual, filtro por los 4 tipos de movimientos.

        const prevConsultas = prevMonthReports
          .filter(el => el.movement_type.name === EnumMovementTypes.CONSULTAS)
          .reduce((acc, el) => acc + el.amount, 0);

        const prevCAC = prevMonthReports
          .filter(el => el.movement_type.name === EnumMovementTypes.CASO_AL_CORRIENTE)
          .reduce((acc, el) => acc + el.amount, 0);

        const prevRec = prevMonthReports
          .filter(el => el.movement_type.name === EnumMovementTypes.RECOMPRA)
          .reduce((acc, el) => acc + el.amount, 0);

        const prevDesem = prevMonthReports
          .filter(el => el.movement_type.name === EnumMovementTypes.DESEMBOLSO)
          .reduce((acc, el) => acc + el.amount, 0);

        const prevDesemQuantity = prevMonthReports.filter(
          el => el.movement_type.name === EnumMovementTypes.DESEMBOLSO,
        ).length;

        //Creo una fecha con el día actual y luego, si tengo reportes del mes previo, me traigo la fecha del último reporte.
        let aux = new Date();
        let actualWeek = this.getNumberOfWeek();
        const prevDate = prevMonthReports.filter(el => el.week >= actualWeek - 3);
        const lastReportDate = prevDate[0].createdAt;
        const bonus_ = prevDesemQuantity >= 6 ? prevDesem * 0.01 : 0;
        //Genero la respuesta con los datos del último mes. Y los coloco en la respuesta total.
        const lastMonthResume = {
          date: lastReportDate ? lastReportDate : aux,
          consultas: prevConsultas,
          casosAlCorriente: prevCAC,
          recompras: prevRec,
          desembolsos: prevDesem,
          bonus: bonus_ ? bonus_.toFixed(2) : 0,
          monthlyTotal: prevConsultas + prevDesem + prevRec + prevCAC,
          reports: reports,
        };
        return lastMonthResume;
      } else {
        return {
          date: currentdate,
          consultas: 0,
          casosAlCorriente: 0,
          recompras: 0,
          desembolsos: 0,
          bonus: 0,
          monthlyTotal: 0,
          reports: reports,
        };
      }
    } else {
      const scores = {
        myRank: EnumRankPartnerIndividual.ASOCIADO,
        pointsLeft: 2000,
        weeklyResume: {
          dateStart: '',
          dateEnd: '',
          amountConsultas: 0,
          amountCasoAlCorriente: 0,
          amountDesembolsos: 0,
          amountRecompras: 0,
          totalWeekly: 0,
        },
        lastMonthResume: {
          date: '',
          consultas: 0,
          desembolsos: 0,
          recompras: 0,
          casosAlCorriente: 0,
          bonus: 0,
          monthlyTotal: 0,
        },
        winnings: [
          {
            dateRange: 0,
            monthly: 0,
            weekly: 0,
            bimonthly: 0,
          },
        ],
        message: 'No posee reportes para generar ranking individual.',
      };
      return scores;
    }
  }

  async totalResume(partner: Partner, lastMonthResume) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const { reports } = lastMonthResume;

    let cuatrim: any;
    if (currentMonth === 12 || currentMonth === 0 || currentMonth === 1 || currentMonth === 2 || currentMonth === 3) {
      cuatrim = EnumCuatrimRanking.ENE_FEB_MAR_ABR;
    }
    if (currentMonth === 4 || currentMonth === 5 || currentMonth === 6 || currentMonth === 7) {
      cuatrim = EnumCuatrimRanking.MAY_JUN_JUL_AGO;
    }
    if (currentMonth === 8 || currentMonth === 9 || currentMonth === 10 || currentMonth === 11) {
      cuatrim = EnumCuatrimRanking.SEP_OCT_NOV_DIC;
    }
    //Genero también la fecha y mes actual.
    //Primero verifico que reciba un mensaje, si es así, entonces NO se encontraron movimientos o reportes, por ende devuelvo la anterior estructura.
    if (lastMonthResume.message) {
      return lastMonthResume;
    }
    //Aquí genero el numero de semana en el que estoy actualmente.
    const numberOfWeek = this.getNumberOfWeek();
    let prevNumberOfWeek: number;
    let prevNumberOfYear: number;
    let currentYear = currentDate.getFullYear();
    if (numberOfWeek === 0) {
      prevNumberOfWeek = 52;
      prevNumberOfYear = currentYear - 1;
    } else {
      prevNumberOfWeek = numberOfWeek - 1;
      prevNumberOfYear = currentYear;
    }
    //Filtro reportes por semana anterior a la actual.
    //TODO: validar el año también
    const reportsByWeek = reports.filter(el => el.week === prevNumberOfWeek && el.createdAt === prevNumberOfYear);

    // A los reportes semanales (deberían ser 4, uno de cada tipo), saco sus montos y los sumo.
    // Coloco todos los datos necesarios en la respuesta.
    const total = reportsByWeek.reduce((acc, el) => acc + el.amount, 0);
    const weeklyResume = {
      reports: reportsByWeek.map(el => ({
        name: el.movement_type.name,
        amount: el.amount,
        quantity: el.quantity,
        week: el.week,
        dateStart: new Date(el.createdAt.getTime() - 520545000) ? new Date(el.createdAt.getTime() - 520545000) : '',
        dateEnd: el.createdAt ? el.createdAt : '',
      })),
      total: total,
    };

    //Filtro los reportes por tipo para ver si traen algo, y sino, asigno 0 mas abajo
    let amountConsultas = weeklyResume.reports.filter(el => el.name === EnumMovementTypes.CONSULTAS);
    let amountCasoAlCorriente = weeklyResume.reports.filter(el => el.name === EnumMovementTypes.CASO_AL_CORRIENTE);
    let amountDesembolsos = weeklyResume.reports.filter(el => el.name === EnumMovementTypes.DESEMBOLSO);
    let amountRecompras = weeklyResume.reports.filter(el => el.name === EnumMovementTypes.RECOMPRA);

    if (amountConsultas.length === 0) {
      amountConsultas[0] = { amount: 0 };
    }
    if (amountCasoAlCorriente.length === 0) {
      amountCasoAlCorriente[0] = { amount: 0 };
    }
    if (amountDesembolsos.length === 0) {
      amountDesembolsos[0] = { amount: 0 };
    }
    if (amountRecompras.length === 0) {
      amountRecompras[0] = { amount: 0 };
    }
    if (!weeklyResume.reports[0]) {
      weeklyResume.reports[0] = { dateStart: new Date(), dateEnd: '' };
    }

    //Traigo datos del ultimo cuatrimestre y genero el puntaje restante para el próximo nivel
    const lastFourMonths = await this.rankingPartnersIndiv.findOne({
      where: {
        partner: partner,
        cuatrim: cuatrim,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    //Determino los puntos restantes
    const constants = await this.rankingIndividualRepo.find();
    const rankings = constants.slice(0, 3);
    const pointsLeft = !lastFourMonths
      ? EnumRankPartnerIndividual.ASOCIADO
      : lastFourMonths.rank === rankings[0].level
      ? rankings[0].max - lastFourMonths.score + 1
      : lastFourMonths.rank === rankings[1].level
      ? rankings[1].max - lastFourMonths.score + 1
      : 'Se ha alcanzado el máximo nivel.';
    //Obtenemos los rankings de los usuarios
    const bim_ranking = await this.rankingRepository.find({
      where: {
        partner: partner,
      },
    });
    const winnings = bim_ranking.filter(el => el.createdAt >= new Date(currentDate.getMonth() - 8));
    const aux_date = new Date();
    const actualPeriod1 = this.createPeriod(new Date(aux_date.setMonth(aux_date.getMonth() - 2)));
    const actualPeriod2 = this.createPeriod(new Date(aux_date.setMonth(aux_date.getMonth() - 4)));
    const actualPeriod3 = this.createPeriod(new Date(aux_date.setMonth(aux_date.getMonth() - 6)));
    const actualPeriod4 = this.createPeriod(new Date(aux_date.setMonth(aux_date.getMonth() - 8)));
    const winningPrev1 = winnings.filter(el => el.period >= actualPeriod1);
    const winningPrev2 = winnings.filter(el => el.period >= actualPeriod2);
    const winningPrev3 = winnings.filter(el => el.period >= actualPeriod3);
    const winningPrev4 = winnings.filter(el => el.period >= actualPeriod4);

    let winnings_1: {};
    let winnings_2: {};
    let winnings_3: {};
    let winnings_4: {};
    const allWinnings = [];
    if (winningPrev1.length) {
      winnings_1 = {
        dateRange: winningPrev1[0].period ? winningPrev1[0].period : '',
        monthly:
          winningPrev1[0].type === 'monthly'
            ? winningPrev1[0].position
            : winningPrev1[1].type === 'monthly'
            ? winningPrev1[1].position
            : winningPrev1[2].type === 'monthly'
            ? winningPrev1[2].position
            : 0,
        weekly:
          winningPrev1[0].type === 'weekly'
            ? winningPrev1[0].position
            : winningPrev1[1].type === 'weekly'
            ? winningPrev1[1].position
            : winningPrev1[2].type === 'weekly'
            ? winningPrev1[2].position
            : 0,
        bimonthly:
          winningPrev1[0].type === 'bimonthly'
            ? winningPrev1[0].position
            : winningPrev1[1].type === 'bimonthly'
            ? winningPrev1[1].position
            : winningPrev1[2].type === 'bimonthly'
            ? winningPrev1[2].position
            : 0,
      };
    }
    if (winningPrev2.length) {
      winnings_2 = {
        dateRange: winningPrev2[0].period ? winningPrev2[0].period : '',
        monthly:
          winningPrev2[0].type === 'monthly'
            ? winningPrev2[0].position
            : winningPrev2[1].type === 'monthly'
            ? winningPrev2[1].position
            : winningPrev2[2].type === 'monthly'
            ? winningPrev2[2].position
            : 0,
        weekly:
          winningPrev2[0].type === 'weekly'
            ? winningPrev2[0].position
            : winningPrev2[1].type === 'weekly'
            ? winningPrev2[1].position
            : winningPrev2[2].type === 'weekly'
            ? winningPrev2[2].position
            : 0,
        bimonthly:
          winningPrev2[0].type === 'bimonthly'
            ? winningPrev2[0].position
            : winningPrev2[1].type === 'bimonthly'
            ? winningPrev2[1].position
            : winningPrev2[2].type === 'bimonthly'
            ? winningPrev2[2].position
            : 0,
      };
    }
    if (winningPrev3.length) {
      winnings_3 = {
        dateRange: winningPrev3[0].period ? winningPrev3[0].period : '',
        monthly:
          winningPrev3[0].type === 'monthly'
            ? winningPrev3[0].position
            : winningPrev3[1].type === 'monthly'
            ? winningPrev3[1].position
            : winningPrev3[2].type === 'monthly'
            ? winningPrev3[2].position
            : 0,
        weekly:
          winningPrev3[0].type === 'weekly'
            ? winningPrev3[0].position
            : winningPrev3[1].type === 'weekly'
            ? winningPrev3[1].position
            : winningPrev3[2].type === 'weekly'
            ? winningPrev3[2].position
            : 0,
        bimonthly:
          winningPrev3[0].type === 'bimonthly'
            ? winningPrev3[0].position
            : winningPrev3[1].type === 'bimonthly'
            ? winningPrev3[1].position
            : winningPrev3[2].type === 'bimonthly'
            ? winningPrev3[2].position
            : 0,
      };
    }
    if (winningPrev4.length) {
      winnings_4 = {
        dateRange: winningPrev4[0].period ? winningPrev4[0].period : '',
        monthly:
          winningPrev4[0].type === 'monthly'
            ? winningPrev4[0].position
            : winningPrev4[1].type === 'monthly'
            ? winningPrev4[1].position
            : winningPrev4[2].type === 'monthly'
            ? winningPrev4[2].position
            : 0,
        weekly:
          winningPrev4[0].type === 'weekly'
            ? winningPrev4[0].position
            : winningPrev4[1].type === 'weekly'
            ? winningPrev4[1].position
            : winningPrev4[2].type === 'weekly'
            ? winningPrev4[2].position
            : 0,
        bimonthly:
          winningPrev4[0].type === 'bimonthly'
            ? winningPrev4[0].position
            : winningPrev4[1].type === 'bimonthly'
            ? winningPrev4[1].position
            : winningPrev4[2].type === 'bimonthly'
            ? winningPrev4[2].position
            : 0,
      };
    }
    allWinnings.push(winnings_1, winnings_2, winnings_3, winnings_4);
    const allWinningsFiltered = allWinnings.filter(el => el !== undefined);

    delete lastMonthResume.reports;
    const response = {
      pointsLeft: pointsLeft,
      myRank: lastFourMonths ? lastFourMonths.rank : EnumRankPartnerIndividual.ASOCIADO,
      weeklyResume: {
        dateStart: weeklyResume.reports[0].dateStart ? weeklyResume.reports[0].dateStart : '',
        dateEnd: weeklyResume.reports[0].dateEnd ? weeklyResume.reports[0].dateEnd : '',
        amountConsultas: amountConsultas[0].amount,
        amountCasoAlCorriente: amountCasoAlCorriente[0].amount,
        amountDesembolsos: amountDesembolsos[0].amount,
        amountRecompras: amountRecompras[0].amount,
        totalWeekly: weeklyResume.total,
      },
      lastMonthResume: lastMonthResume,
      winnings: allWinningsFiltered,
    };
    return response;
  }

  createPeriod(date: Date) {
    const month = date.getMonth();

    switch (month) {
      case month === 0 || 1:
        return EnumPeriodRanking.ENE_FEB;
      case month === 2 || 3:
        return EnumPeriodRanking.MAR_ABR;
      case month === 4 || 5:
        return EnumPeriodRanking.MAY_JUN;
      case month === 6 || 7:
        return EnumPeriodRanking.JUL_AGO;
      case month === 8 || 9:
        return EnumPeriodRanking.SEP_OCT;
      case month === 10 || 11:
        return EnumPeriodRanking.NOV_DIC;
      default:
        null;
    }
  }

  async generateLeadership(id: number) {
    //Primero generamos una fecha (de la consulta actual), quitamos el mes y luego generamos un período de 1 a 6. Liderazgo ranking bimestral.
    const currentdate = new Date();
    const last_bimester = new Date();
    last_bimester.setMonth(currentdate.getMonth() - 2);
    const period = this.createPeriod(last_bimester);
    const currentMonth = currentdate.getMonth();

    //Nos traemos la red de asociados y filtramos por los activos.
    const associatedNet = await this.referredRepository.find({
      where: { partner: id },
      relations: ['referred'],
    });
    const associatedNetActives = associatedNet.filter(el => el.referred.status === AsociadoStatus.ACTIVE);

    //Traemos cursos, movimientos y reportes de la red de contactos.
    let partnerReports = [];
    let partnerCourses = [];
    let partnerMovements = [];

    for (let associated of associatedNetActives) {
      const partners = await this.partnerRepository.findOne({
        where: { id: associated.referred.id },
        relations: ['courseToPartner'],
      });

      const movements = await this.movementsRepository.find({
        where: { partner: associated.referred },
        relations: ['movement_types'],
      });

      const reports = await this.reportsRepository.find({
        where: { partner: associated.referred },
        relations: ['movement_type'],
      });

      partners.courseToPartner.forEach(el => partnerCourses.push(el.status));
      movements.forEach(el => partnerMovements.push(el));
      reports.forEach(el => partnerReports.push(el));
    }

    let previouslyMonth: any;
    let previousPreviouslyMonth: any;
    switch (currentMonth) {
      case 0: // Enero
        previouslyMonth = 11;
        previousPreviouslyMonth = 10;
      case 1: // Febrero
        previouslyMonth = 0;
        previousPreviouslyMonth = 11;
      case 2: // Marzo
        previouslyMonth = 1;
        previousPreviouslyMonth = 0;
    }
    if (currentMonth > 2) {
      previouslyMonth = currentMonth - 1;
      previousPreviouslyMonth = currentMonth - 2;
    }

    //Filtramos los reportes de la red por mes y luego por tipo, desembolso o recompra.
    const reportsByMonth = partnerReports.filter(
      el =>
        el.createdAt.getMonth() === currentMonth ||
        el.createdAt.getMonth() === previouslyMonth ||
        el.createdAt.getMonth() === previousPreviouslyMonth,
    );
    const reportsFiltered = reportsByMonth.filter(
      el =>
        el.movement_type.name === EnumMovementTypes.DESEMBOLSO || el.movement_type.name === EnumMovementTypes.RECOMPRA,
    );

    //Contabilizamos los desembolsos de la red.
    const desembRealizados = reportsFiltered.reduce((acc, el) => acc + el.quantity, 0);

    //Contabilizamos en % la actividad comercial de la red.
    const comercialActivity = (partnerMovements.length * 100) / associatedNetActives.length;

    //Asignamos el ranking en base a la red de asociados, los desembolsos realizados, la actividad comercial y los cursos.
    let rankAssigned = this.plataLider(associatedNetActives, desembRealizados, comercialActivity, partnerCourses);

    //Le asignamos según el ranking un bonus por objetivo
    const bonusGoal =
      rankAssigned === EnumLeaderRank.FUTURO_LIDER
        ? 10
        : rankAssigned === EnumLeaderRank.LIDER_BRONCE
        ? 15
        : rankAssigned === EnumLeaderRank.LIDER_PLATA
        ? 20
        : 0;

    //Filtramos la producción de su red por desembolsos y recompras.
    const networkProd = partnerMovements.filter(
      el =>
        el.movement_types.name === EnumMovementTypes.DESEMBOLSO ||
        el.movement_types.name === EnumMovementTypes.RECOMPRA,
    );
    const networkProdTotal = networkProd.reduce((acc, el) => acc + parseInt(el.quantity), 0);

    //Creamos el multiplicador en base al nivel de liderazgo.
    const monthlyMultiplier =
      rankAssigned === EnumLeaderRank.FUTURO_LIDER
        ? 0
        : rankAssigned === EnumLeaderRank.LIDER_BRONCE || rankAssigned === EnumLeaderRank.LIDER_PLATA
        ? 100
        : null;
    const monthlyBonus = monthlyMultiplier * networkProdTotal;

    const partner = await this.partnerRepository.findOne({
      where: { id },
    });

    const network = this.rankingPartnersLead.create({
      partner: partner,
      period: period,
      level: rankAssigned,
      bonusGoal: bonusGoal,
      networkProd: networkProdTotal,
      monthlyBonus: monthlyBonus,
    });
    await this.rankingPartnersLead.save(network);
  }

  getNumberOfWeek() {
    // Retorna el numero de semana actual
    const currentDate = new Date();
    return DateTime.local(currentDate).weekNumber;
  }

  futuroLider(associatedNetActives) {
    if (associatedNetActives.length >= 1 && associatedNetActives.length < 10) {
      return EnumLeaderRank.FUTURO_LIDER;
    } else return EnumLeaderRank.NO_RANK;
  }

  bronceLider(associatedNetActives, desembRealizados, comercialActivity, partnerCourses) {
    if (associatedNetActives.length >= 10) {
      if (desembRealizados >= 30) {
        if (comercialActivity >= 35) {
          if (partnerCourses.length) {
            return EnumLeaderRank.LIDER_BRONCE;
          } else {
            return this.futuroLider(associatedNetActives);
          }
        } else {
          return this.futuroLider(associatedNetActives);
        }
      } else {
        return this.futuroLider(associatedNetActives);
      }
    } else {
      return this.futuroLider(associatedNetActives);
    }
  }

  plataLider(associatedNetActives, desembRealizados, comercialActivity, partnerCourses) {
    if (associatedNetActives.length >= 20) {
      if (desembRealizados >= 40) {
        if (comercialActivity >= 30) {
          if (partnerCourses.length) {
            return EnumLeaderRank.LIDER_PLATA;
          }
          return this.bronceLider(associatedNetActives, desembRealizados, comercialActivity, partnerCourses);
        } else {
          return this.futuroLider(associatedNetActives);
        }
      } else {
        return this.bronceLider(associatedNetActives, desembRealizados, comercialActivity, partnerCourses);
      }
    } else {
      return this.bronceLider(associatedNetActives, desembRealizados, comercialActivity, partnerCourses);
    }
  }

  async getLeadership(partner: Partner) {
    //Generamos fecha de consulta y mes actual
    const currentDate = new Date();
    const lastDate = new Date();
    lastDate.setMonth(lastDate.getMonth() - 2);
    const lastMonth = lastDate.getMonth();

    const month = currentDate.getMonth();
    const period = this.createPeriod(lastDate);
    let prevMonth: number;
    let prevPreviousMonth: number;
    if (month === 0) {
      prevMonth = 11;
      prevPreviousMonth = 10;
    }
    if (prevMonth === 1) {
      prevMonth = 0;
      prevPreviousMonth = 11;
    }

    //Buscamos ranking actual o del mes anterior, o el anterior al anterior a la consulta
    const result = await this.rankingPartnersLead.find({
      relations: ['partner', 'partner.movements'],
      where: {
        partner: partner,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    const resultB = result.filter(el => el.createdAt.getMonth() === prevMonth);
    const resultC = result.filter(el => el.createdAt.getMonth() === prevPreviousMonth);
    const currentResult = resultB.length ? resultB : resultC.length ? resultC : null;

    if (!currentResult) {
      const response = {
        currentLevel: {
          name: EnumLeaderRank.NO_RANK,
          period: period,
        },
        lastLevel: {
          name: EnumLeaderRank.NO_RANK,
          period: period === 1 ? 12 : period - 1,
        },
        weeklyResume: {
          dateStart: new Date(currentDate.getTime() - 520545000),
          dateEnd: currentDate,
          consultas: 0,
          creditosRed: 0,
          totalWeek: 0,
        },
        monthlyResume: {
          date: currentDate,
          goalBonus: 0,
          networkProd: 0,
          monthlyBonus: 0,
          totalMonth: 0,
        },
      };
      return response;
    } else {
      //TODO: esto no entiendo que hace, se trae el último reporte y luego va y busca el ranking que tenga el mes de ese reporte ¿?
      //No tiene sentido ya que con monthResult estamos obteniendo el último reporte.
      const monthResult = currentResult[currentResult.length - 1].createdAt.getMonth() - 1; // revisar
      const lastResult = result.filter(el => el.createdAt.getMonth() === monthResult); // revisar

      //Generamos el numero de semana actual
      let numberOfWeek = this.getNumberOfWeek();
      //Traemos la red de asociados activos
      const associatedNet = await this.referredRepository.find({
        where: { partner: partner },
        relations: ['referred'],
      });
      const associatedNetActives = associatedNet.filter(el => el.referred.status === AsociadoStatus.ACTIVE);
      //Guardamos los reportes de los partners de la red de asociados
      let partnerReports = [];
      for (let associated of associatedNetActives) {
        const reports = await this.reportsRepository.find({
          where: { partner: associated.referred },
          relations: ['movement_type'],
        });
        reports.forEach(el => partnerReports.push(el));
      }
      //Filtramos por tipo de movimiento y luego por semana actual o anterior
      const reportsRecompras = partnerReports.filter(el => el.movement_type.name === EnumMovementTypes.RECOMPRA);
      const reportsDesembolsos = partnerReports.filter(el => el.movement_type.name === EnumMovementTypes.DESEMBOLSO);

      //TODO: Acá hay que traer resultados de dos semanas? Como se hizo mas arriba, si estamos en una semana, traemos los de la anterior
      //La semana actual ni siquiera terminó.
      let prevNumberOfWeek: number;
      if (numberOfWeek === 1) {
        prevNumberOfWeek = 52;
      } else {
        numberOfWeek - 1;
      }
      let recompra = reportsRecompras.filter(el => el.week === numberOfWeek);
      if (!recompra.length) {
        recompra = reportsRecompras.filter(el => el.week === prevNumberOfWeek);
      }
      let creditosRed = reportsDesembolsos.filter(el => el.week === numberOfWeek);
      if (!creditosRed.length) {
        creditosRed = reportsDesembolsos.filter(el => el.week === prevNumberOfWeek);
      }
      //Se realiza el calculo entre la cantidad y el monto según el tipo de recompra
      const recomAcc = recompra.reduce((acc, el) => acc + el.quantity * el.amount, 0);
      const credAcc = creditosRed.reduce((acc, el) => acc + el.quantity * el.amount, 0);
      const response = {
        currentLevel: {
          name: currentResult[currentResult.length - 1].level,
          period: currentResult[currentResult.length - 1].period,
        },
        lastLevel: {
          name: lastResult.length ? lastResult[0].level : EnumLeaderRank.NO_RANK,
          period: lastResult.length
            ? lastResult[0].period
            : currentResult[currentResult.length - 1].period === 1
            ? 6
            : currentResult[currentResult.length - 1].period - 1,
        },
        weeklyResume: {
          dateStart: new Date(currentResult[currentResult.length - 1].createdAt.getTime() - 520545000)
            ? new Date(currentResult[currentResult.length - 1].createdAt.getTime() - 520545000)
            : '',
          dateEnd: currentResult[currentResult.length - 1].createdAt
            ? currentResult[currentResult.length - 1].createdAt
            : '',
          recompra: recomAcc,
          creditosRed: credAcc,
          totalWeek: recomAcc + credAcc,
        },
        monthlyResume: {
          date: currentResult[currentResult.length - 1].createdAt,
          goalBonus: currentResult[currentResult.length - 1].bonusGoal, // cantidad de desembolsos que tienen todos sus referidos
          networkProd: currentResult[currentResult.length - 1].networkProd, // monto de lo que generó la red
          monthlyBonus: currentResult[currentResult.length - 1].monthlyBonus, // bonificacion mensual => relacion con meta de bonificacion
          totalMonth: currentResult[currentResult.length - 1].monthlyBonus, // total de ganancias
        },
      };
      return response;
    }
  }

  async scoreSystem(partner: Partner) {
    const constants = await this.rankingIndividualRepo.find();
    const rankings = constants.slice(0, 3);
    const scoresConfig = constants.slice(3);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const cuatrim =
      currentMonth === 4 || 5 || 6 || 7
        ? EnumCuatrimRanking.ENE_FEB_MAR_ABR
        : currentMonth === 8 || 9 || 10 || 11
        ? EnumCuatrimRanking.MAY_JUN_JUL_AGO
        : currentMonth === 0 || 1 || 2 || 3
        ? EnumCuatrimRanking.SEP_OCT_NOV_DIC
        : null;

    const lastFourMonths = await this.rankingPartnersIndiv.findOne({
      where: {
        partner: partner,
        cuatrim: cuatrim,
      },
    });

    if (!lastFourMonths) {
      const scoreSystem = {
        level: EnumRankPartnerIndividual.ASOCIADO,
        period: cuatrim,
        pointsLeft: rankings[1].min,
        score: {
          consultas: scoresConfig[0].score,
          casoAlCorriente: scoresConfig[1].score,
          recompra: scoresConfig[2].score,
          desembolso: scoresConfig[3].score,
        },
      };
      return scoreSystem;
    }

    const pointsLeft =
      lastFourMonths.rank === rankings[0].level
        ? rankings[0].max - lastFourMonths.score + 1
        : lastFourMonths.rank === rankings[1].level
        ? rankings[1].max - lastFourMonths.score + 1
        : 'Se ha alcanzado el máximo nivel.';

    const scoreSystem = {
      level: lastFourMonths.rank,
      period: lastFourMonths.cuatrim,
      pointsLeft: pointsLeft,
      score: {
        consultas: scoresConfig[0].score,
        casoAlCorriente: scoresConfig[1].score,
        recompra: scoresConfig[2].score,
        desembolso: scoresConfig[3].score,
      },
    };
    return scoreSystem;
  }

  //Generador de ranking semanal, mensual, bimestral, en base al parámetro recibido
  async generateRanking(timeRange: EnumRankType) {
    //Cálculo de fecha actual, y fecha inicial semana/mes/bimestre
    const current_date = new Date();
    const first_date = new Date(current_date);
    const days_before = timeRange === EnumRankType.WEEKLY ? 7 : timeRange === EnumRankType.MONTHLY ? 30 : 60;

    first_date.setDate(first_date.getDate() - days_before);

    //Cálculo de período
    const aux_date = new Date(current_date);
    aux_date.setMonth(aux_date.getMonth() - 2);
    const period = this.createPeriod(aux_date);

    const partners: any = await this.partnerRepository.find({
      relations: ['individual_ranking'],
    });

    const date_ = new Date();
    for (let partner of partners) {
      partner.individual_ranking = partner.individual_ranking.find(
        el => el.createdAt >= new Date(date_.setMonth(date_.getMonth() - 1)),
      );
    }

    const ranking_array = [];
    const ranks = [EnumRankPartnerIndividual.ASOCIADO, EnumRankPartnerIndividual.PLATA, EnumRankPartnerIndividual.ORO];

    for (let rank of ranks) {
      const partners_filtered = partners.filter(el => el.individual_ranking.rank === rank);

      for (let partner of partners_filtered) {
        const reports_by_partner = await this.reportsRepository.find({
          where: {
            partner: partner,
            createdAt: Between(first_date, current_date),
          },
        });

        const earning = reports_by_partner.reduce((acc, el) => acc + el.amount, 0);
        ranking_array.push({
          partner,
          earning,
        });
      }

      ranking_array.sort((a, b) => {
        if (a.earning < b.earning) return 1;
        if (a.earning > b.earning) return -1;
        return 0;
      });
    }

    for (let [index, rank] of ranking_array.entries()) {
      const ranking = this.rankingRepository.create({
        partner: rank.partner,
        position: index + 1,
        period: period,
        type: timeRange,
      });
      await this.rankingRepository.save(ranking);
    }
  }

  async individualRankingCron() {
    const partners = await this.partnerRepository.find();
    for (const partner of partners) {
      await this.generateIndividualRanking(partner.id);
    }
    return {
      message: 'Individual ranking crons Triggered',
    };
  }

  async leadershipRankingCron() {
    const partners = await this.partnerRepository.find();
    for (const partner of partners) {
      await this.generateLeadership(partner.id);
    }
    return {
      message: 'Leadership ranking crons Triggered',
    };
  }

  async generateReportsCron() {
    const partners = await this.partnerRepository.find();
    for (const partner of partners) {
      await this.createReport(partner.id);
    }
    return {
      message: 'Generate reports crons Triggered',
    };
  }
}
