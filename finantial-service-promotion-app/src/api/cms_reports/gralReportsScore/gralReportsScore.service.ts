import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GralReportsScore } from 'src/common/database_entities/gralReportsScore.entity';
import { Repository, Between } from 'typeorm';
import { RankingPartnersIndiv } from '../../../common/database_entities/rankingPartnersIndiv.entity';
import { EnumRankPartnerIndividual } from '../../../common/constants';
import { NotFoundException } from '../../../config/exceptions/not.found.exception';

@Injectable()
export class GralReportsScoreService {
  constructor(
    @InjectRepository(RankingPartnersIndiv) private readonly rankingPartnerIndividual: Repository<RankingPartnersIndiv>,
    @InjectRepository(GralReportsScore) private readonly gralReportsScoreModel: Repository<GralReportsScore>,
  ) {}

  getNumberOfActualQuarter() {
    const currentDate = new Date();
    const actualMonth = currentDate.getMonth();
    let cuatrimestre = 0;

    if (actualMonth === 12 || actualMonth === 0 || actualMonth === 1 || actualMonth === 2 || actualMonth === 3) {
      // Enero, Febrero // Marzo // Abril
      cuatrimestre = 1;
    }
    if (actualMonth === 4 || actualMonth === 5 || actualMonth === 6 || actualMonth === 7) {
      // Mayo // Junio // Julio // Agosto
      cuatrimestre = 2;
    }
    if (actualMonth === 8 || actualMonth === 9 || actualMonth === 10 || actualMonth === 11) {
      // Septiembre // Octubre // Noviembre // Diciembre
      cuatrimestre = 3;
    }
    return cuatrimestre;
  }

  // Associates
  async getAssocRankingByQuarterNumber(number: number) {
    // Retorna la cantidad de ranking de los asociados por cuatrimestre
    const associates = await this.rankingPartnerIndividual.find({
      where: {
        rank: EnumRankPartnerIndividual.ASOCIADO,
      },
    });
    const arr = associates.filter(el => el.cuatrim === number);
    return arr.length;
  }
  // Silver
  async getSilverRankingByQuarterNumber(number: number) {
    // Retorna la cantidad de ranking de silver por cuatrimestre
    const silver = await this.rankingPartnerIndividual.find({
      where: {
        rank: EnumRankPartnerIndividual.PLATA,
      },
    });
    const arr = silver.filter(el => el.cuatrim === number);
    return arr.length;
  }
  // Gold
  async getGoldRankingsByQuarterNumber(number: number) {
    // Retorna la cantidad de ranking de gold por cuatrimestre
    const gold = await this.rankingPartnerIndividual.find({
      where: {
        rank: EnumRankPartnerIndividual.ORO,
      },
    });
    const arr = gold.filter(el => el.cuatrim === number);
    return arr.length;
  }

  async getReportsScoreMonthlyCron() {
    const numberOfActualQuarter = await this.getNumberOfActualQuarter();
    let numberOfPrevQuarter = numberOfActualQuarter - 1;
    if (numberOfActualQuarter === 0) {
      numberOfPrevQuarter = 3;
    }
    // Associates
    const prevQuanOfAssoc = await this.getAssocRankingByQuarterNumber(numberOfPrevQuarter);
    const actualQuanOfAssoc = await this.getAssocRankingByQuarterNumber(numberOfActualQuarter);
    // Silver
    const prevQuanOfSilver = await this.getSilverRankingByQuarterNumber(numberOfPrevQuarter);
    const actualQuanOfSilver = await this.getSilverRankingByQuarterNumber(numberOfActualQuarter);
    // Gold
    const prevQuanOfGold = await this.getGoldRankingsByQuarterNumber(numberOfPrevQuarter);
    const actualQuanOfGold = await this.getGoldRankingsByQuarterNumber(numberOfActualQuarter);
    // TotalAssociates
    let totalAssociates = await this.rankingPartnerIndividual.find({
      relations: ['partner'],
      where: {
        rank: EnumRankPartnerIndividual.ASOCIADO,
        cuatrim: numberOfActualQuarter,
      },
    });
    // TotalSilver
    let totalSilver = await this.rankingPartnerIndividual.find({
      relations: ['partner'],
      where: {
        rank: EnumRankPartnerIndividual.PLATA,
        cuatrim: numberOfActualQuarter,
      },
    });
    // TotalGold
    let totalGold = await this.rankingPartnerIndividual.find({
      relations: ['partner'],
      where: {
        rank: EnumRankPartnerIndividual.ORO,
        cuatrim: numberOfActualQuarter,
      },
    });
    // NonRepeat--------------------------------------------------------------------------------------------------------------------
    const arrAssociates = [];
    const arrSilver = [];
    const arrGold = [];
    totalAssociates &&
      totalAssociates.map(el => {
        arrAssociates.push(el.partner.id);
      });
    totalSilver &&
      totalSilver.map(el => {
        arrSilver.push(el.partner.id);
      });
    totalGold &&
      totalGold.map(el => {
        arrGold.push(el.partner.id);
      });
    const newTotalAssociates = [...new Set(arrAssociates)].length;
    const newTotalSilver = [...new Set(arrSilver)].length;
    const newTotalGold = [...new Set(arrGold)].length;
    // ------------------------------------------------------------------------------------------------------------------------------------

    const register = this.gralReportsScoreModel.create({
      quarter: await this.getNumberOfActualQuarter(),
      quantityOfAssoc: newTotalAssociates,
      quantityOfSilver: newTotalSilver,
      quantityOfGold: newTotalGold,
      averageOfAssoc: (prevQuanOfAssoc + actualQuanOfAssoc) / 2,
      averageOfSilver: (prevQuanOfSilver + actualQuanOfSilver) / 2,
      averageOfGold: (prevQuanOfGold + actualQuanOfGold) / 2,
    });
    await this.gralReportsScoreModel.save(register);
    return {
      message: 'Reporte de puntaje cuatrimestral creado',
      data: register,
    };
  }

  // Associates average
  async getPrevAverageOfAssoc() {
    let currentDate = new Date();
    let previousDate: Date;
    let prevPreviousDate: Date;
    let yearCurrenDate = currentDate.getFullYear();
    let monthCurrenDate: any;
    let dayCurrenDate = currentDate.getDate();
    let previousReport: any;
    let prevPreviousReport: any;

    let prevPreviousCuarter: any;
    let previousCuarter: any;
    let currentCuarter = this.getNumberOfActualQuarter();

    if (currentCuarter === 1) {
      prevPreviousCuarter = 2;
      previousCuarter = 3;
    }
    if (currentCuarter === 2) {
      prevPreviousCuarter = 3;
      previousCuarter = 1;
    } else {
      prevPreviousCuarter = this.getNumberOfActualQuarter() - 2;
      previousCuarter = this.getNumberOfActualQuarter() - 1;
    }

    monthCurrenDate = currentDate.getMonth();

    switch (monthCurrenDate) {
      case monthCurrenDate === 0:
        previousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${4}-${dayCurrenDate}`);
      case monthCurrenDate === 1:
        previousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${5}-${dayCurrenDate}`);
      case monthCurrenDate === 2:
        previousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${6}-${dayCurrenDate}`);
      case monthCurrenDate === 3:
        previousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${7}-${dayCurrenDate}`);
      case monthCurrenDate === 4:
        previousDate = new Date(`${yearCurrenDate - 1}-${0}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
      case monthCurrenDate === 5:
        previousDate = new Date(`${yearCurrenDate - 1}-${1}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
      case monthCurrenDate === 6:
        previousDate = new Date(`${yearCurrenDate - 1}-${2}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
      case monthCurrenDate === 7:
        previousDate = new Date(`${yearCurrenDate - 1}-${3}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
      default:
        previousDate = new Date(`${yearCurrenDate}-${monthCurrenDate - 4}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate}-${8}-${dayCurrenDate}`);
    }

    prevPreviousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: prevPreviousCuarter,
        },
        {
          createdAt: Between(prevPreviousDate, previousDate),
        },
      ],
    });
    previousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: previousCuarter,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });

    if (prevPreviousReport !== undefined && previousReport !== undefined) {
      return (prevPreviousReport.averageOfAssoc + previousReport.averageOfAssoc) / 2;
    } else if (prevPreviousReport === undefined || previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron reportes en la base de datos');
    }
  }
  async getActualAverageOfAssoc() {
    let currentDate = new Date();
    let previousDate: Date;
    let prevPreviousDate: Date;
    let yearCurrenDate = currentDate.getFullYear();
    let monthCurrenDate: any;
    let dayCurrenDate = currentDate.getDate();
    let previousReport: any;
    let prevPreviousReport: any;

    let prevPreviousCuarter: any;
    let previousCuarter: any;
    let currentCuarter = this.getNumberOfActualQuarter();

    if (currentCuarter === 1) {
      prevPreviousCuarter = 2;
      previousCuarter = 3;
    }
    if (currentCuarter === 2) {
      prevPreviousCuarter = 1;
      previousCuarter = 2;
    } else {
      prevPreviousCuarter = this.getNumberOfActualQuarter() - 2;
      previousCuarter = this.getNumberOfActualQuarter() - 1;
    }

    monthCurrenDate = currentDate.getMonth();

    switch (monthCurrenDate) {
      case monthCurrenDate === 0:
        previousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${4}-${dayCurrenDate}`);
      case monthCurrenDate === 1:
        previousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${5}-${dayCurrenDate}`);
      case monthCurrenDate === 2:
        previousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${6}-${dayCurrenDate}`);
      case monthCurrenDate === 3:
        previousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${7}-${dayCurrenDate}`);
      case monthCurrenDate === 4:
        previousDate = new Date(`${yearCurrenDate - 1}-${0}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
      case monthCurrenDate === 5:
        previousDate = new Date(`${yearCurrenDate - 1}-${1}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
      case monthCurrenDate === 6:
        previousDate = new Date(`${yearCurrenDate - 1}-${2}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
      case monthCurrenDate === 7:
        previousDate = new Date(`${yearCurrenDate - 1}-${3}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
      default:
        previousDate = new Date(`${yearCurrenDate}-${monthCurrenDate - 4}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate}-${8}-${dayCurrenDate}`);
    }

    prevPreviousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: prevPreviousCuarter,
        },
        {
          createdAt: Between(previousDate, currentDate), // previo
        },
      ],
    });
    previousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: previousCuarter,
        },
        {
          createdAt: Between(previousDate, currentDate), // actual
        },
      ],
    });

    if (prevPreviousReport !== undefined && previousReport !== undefined) {
      return (prevPreviousReport.averageOfAssoc + previousReport.averageOfAssoc) / 2;
    } else if (prevPreviousReport === undefined || previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron reportes en la base de datos');
    }
  }
  // Silver average
  async getPrevAverageOfSilver() {
    let currentDate = new Date();
    let previousDate: Date;
    let prevPreviousDate: Date;
    let yearCurrenDate = currentDate.getFullYear();
    let monthCurrenDate: any;
    let dayCurrenDate = currentDate.getDate();
    let previousReport: any;
    let prevPreviousReport: any;

    let prevPreviousCuarter: any;
    let previousCuarter: any;
    let currentCuarter = this.getNumberOfActualQuarter();

    if (currentCuarter === 1) {
      prevPreviousCuarter = 2;
      previousCuarter = 3;
    }
    if (currentCuarter === 2) {
      prevPreviousCuarter = 1;
      previousCuarter = 2;
    } else {
      prevPreviousCuarter = this.getNumberOfActualQuarter() - 2;
      previousCuarter = this.getNumberOfActualQuarter() - 1;
    }

    monthCurrenDate = currentDate.getMonth();

    switch (monthCurrenDate) {
      case monthCurrenDate === 0:
        previousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${4}-${dayCurrenDate}`);
      case monthCurrenDate === 1:
        previousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${5}-${dayCurrenDate}`);
      case monthCurrenDate === 2:
        previousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${6}-${dayCurrenDate}`);
      case monthCurrenDate === 3:
        previousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${7}-${dayCurrenDate}`);
      case monthCurrenDate === 4:
        previousDate = new Date(`${yearCurrenDate - 1}-${0}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
      case monthCurrenDate === 5:
        previousDate = new Date(`${yearCurrenDate - 1}-${1}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
      case monthCurrenDate === 6:
        previousDate = new Date(`${yearCurrenDate - 1}-${2}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
      case monthCurrenDate === 7:
        previousDate = new Date(`${yearCurrenDate - 1}-${3}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
      default:
        previousDate = new Date(`${yearCurrenDate}-${monthCurrenDate - 4}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate}-${8}-${dayCurrenDate}`);
    }
    prevPreviousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: prevPreviousCuarter,
        },
        {
          createdAt: Between(prevPreviousDate, previousDate),
        },
      ],
    });
    previousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: previousCuarter,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });

    if (prevPreviousReport !== undefined && previousReport !== undefined) {
      return (prevPreviousReport.averageOfSilver + previousReport.averageOfSilver) / 2;
    } else if (prevPreviousReport === undefined || previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron reportes en la base de datos');
    }
  }
  async getActualAverageOfSilver() {
    let currentDate = new Date();
    let previousDate: Date;
    let prevPreviousDate: Date;
    let yearCurrenDate = currentDate.getFullYear();
    let monthCurrenDate: any;
    let dayCurrenDate = currentDate.getDate();
    let previousReport: any;
    let prevPreviousReport: any;

    let prevPreviousCuarter: any;
    let previousCuarter: any;
    let currentCuarter = this.getNumberOfActualQuarter();

    if (currentCuarter === 1) {
      prevPreviousCuarter = 2;
      previousCuarter = 3;
    }
    if (currentCuarter === 2) {
      prevPreviousCuarter = 1;
      previousCuarter = 2;
    } else {
      prevPreviousCuarter = this.getNumberOfActualQuarter() - 2;
      previousCuarter = this.getNumberOfActualQuarter() - 1;
    }

    monthCurrenDate = currentDate.getMonth();

    switch (monthCurrenDate) {
      case monthCurrenDate === 0:
        previousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${4}-${dayCurrenDate}`);
      case monthCurrenDate === 1:
        previousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${5}-${dayCurrenDate}`);
      case monthCurrenDate === 2:
        previousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${6}-${dayCurrenDate}`);
      case monthCurrenDate === 3:
        previousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${7}-${dayCurrenDate}`);
      case monthCurrenDate === 4:
        previousDate = new Date(`${yearCurrenDate - 1}-${0}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
      case monthCurrenDate === 5:
        previousDate = new Date(`${yearCurrenDate - 1}-${1}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
      case monthCurrenDate === 6:
        previousDate = new Date(`${yearCurrenDate - 1}-${2}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
      case monthCurrenDate === 7:
        previousDate = new Date(`${yearCurrenDate - 1}-${3}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
      default:
        previousDate = new Date(`${yearCurrenDate}-${monthCurrenDate - 4}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate}-${8}-${dayCurrenDate}`);
    }
    prevPreviousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: prevPreviousCuarter,
        },
        {
          createdAt: Between(previousDate, currentDate), // previo
        },
      ],
    });
    previousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: previousCuarter,
        },
        {
          createdAt: Between(previousDate, currentDate), // actual
        },
      ],
    });

    if (prevPreviousReport !== undefined && previousReport !== undefined) {
      return (prevPreviousReport.averageOfGold + previousReport.averageOfGold || 0) / 2;
    } else if (prevPreviousReport === undefined || previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron reportes en la base de datos');
    }
  }
  // Gold average
  async getPrevAverageOfGold() {
    let currentDate = new Date();
    let previousDate: Date;
    let prevPreviousDate: Date;
    let yearCurrenDate = currentDate.getFullYear();
    let monthCurrenDate: any;
    let dayCurrenDate = currentDate.getDate();
    let previousReport: any;
    let prevPreviousReport: any;

    let prevPreviousCuarter: any;
    let previousCuarter: any;
    let currentCuarter = this.getNumberOfActualQuarter();

    if (currentCuarter === 1) {
      prevPreviousCuarter = 2;
      previousCuarter = 3;
    }
    if (currentCuarter === 2) {
      prevPreviousCuarter = 1;
      previousCuarter = 2;
    } else {
      prevPreviousCuarter = this.getNumberOfActualQuarter() - 2;
      previousCuarter = this.getNumberOfActualQuarter() - 1;
    }

    monthCurrenDate = currentDate.getMonth();

    switch (monthCurrenDate) {
      case monthCurrenDate === 0:
        previousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${4}-${dayCurrenDate}`);
      case monthCurrenDate === 1:
        previousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${5}-${dayCurrenDate}`);
      case monthCurrenDate === 2:
        previousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${6}-${dayCurrenDate}`);
      case monthCurrenDate === 3:
        previousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${7}-${dayCurrenDate}`);
      case monthCurrenDate === 4:
        previousDate = new Date(`${yearCurrenDate - 1}-${0}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
      case monthCurrenDate === 5:
        previousDate = new Date(`${yearCurrenDate - 1}-${1}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
      case monthCurrenDate === 6:
        previousDate = new Date(`${yearCurrenDate - 1}-${2}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
      case monthCurrenDate === 7:
        previousDate = new Date(`${yearCurrenDate - 1}-${3}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
      default:
        previousDate = new Date(`${yearCurrenDate}-${monthCurrenDate - 4}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate}-${8}-${dayCurrenDate}`);
    }
    prevPreviousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: prevPreviousCuarter,
        },
        {
          createdAt: Between(prevPreviousDate, previousDate),
        },
      ],
    });
    previousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: previousCuarter,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });

    if (prevPreviousReport !== undefined && previousReport !== undefined) {
      return (prevPreviousReport.averageOfGold + previousReport.averageOfGold) / 2;
    } else if (prevPreviousReport === undefined || previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron reportes en la base de datos');
    }
  }
  async getActualAverageOfGold() {
    let currentDate = new Date();
    let previousDate: Date;
    let prevPreviousDate: Date;
    let yearCurrenDate = currentDate.getFullYear();
    let monthCurrenDate: any;
    let dayCurrenDate = currentDate.getDate();
    let previousReport: any;
    let prevPreviousReport: any;

    let prevPreviousCuarter: any;
    let previousCuarter: any;
    let currentCuarter = this.getNumberOfActualQuarter();

    if (currentCuarter === 1) {
      prevPreviousCuarter = 2;
      previousCuarter = 3;
    }
    if (currentCuarter === 2) {
      prevPreviousCuarter = 1;
      previousCuarter = 2;
    } else {
      prevPreviousCuarter = this.getNumberOfActualQuarter() - 2;
      previousCuarter = this.getNumberOfActualQuarter() - 1;
    }

    monthCurrenDate = currentDate.getMonth();

    switch (monthCurrenDate) {
      case monthCurrenDate === 0:
        previousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${4}-${dayCurrenDate}`);
      case monthCurrenDate === 1:
        previousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${5}-${dayCurrenDate}`);
      case monthCurrenDate === 2:
        previousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${6}-${dayCurrenDate}`);
      case monthCurrenDate === 3:
        previousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${7}-${dayCurrenDate}`);
      case monthCurrenDate === 4:
        previousDate = new Date(`${yearCurrenDate - 1}-${0}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${8}-${dayCurrenDate}`);
      case monthCurrenDate === 5:
        previousDate = new Date(`${yearCurrenDate - 1}-${1}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${9}-${dayCurrenDate}`);
      case monthCurrenDate === 6:
        previousDate = new Date(`${yearCurrenDate - 1}-${2}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${10}-${dayCurrenDate}`);
      case monthCurrenDate === 7:
        previousDate = new Date(`${yearCurrenDate - 1}-${3}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate - 1}-${11}-${dayCurrenDate}`);
      default:
        previousDate = new Date(`${yearCurrenDate}-${monthCurrenDate - 4}-${dayCurrenDate}`);
        prevPreviousDate = new Date(`${yearCurrenDate}-${8}-${dayCurrenDate}`);
    }
    prevPreviousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: prevPreviousCuarter,
        },
        {
          createdAt: Between(previousDate, currentDate), // previo
        },
      ],
    });
    previousReport = await this.gralReportsScoreModel.findOne({
      where: [
        {
          quarter: previousCuarter,
        },
        {
          createdAt: Between(previousDate, currentDate), // actual
        },
      ],
    });

    if (prevPreviousReport !== undefined && previousReport !== undefined) {
      return (prevPreviousReport.averageOfGold + previousReport.averageOfGold) / 2;
    } else if (prevPreviousReport === undefined || previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron reportes en la base de datos');
    }
  }

  async getReportsScore() {
    const cuarter = this.getNumberOfActualQuarter();
    const totalAssociates = await this.rankingPartnerIndividual.find({
      relations: ['partner'],
      where: {
        rank: EnumRankPartnerIndividual.ASOCIADO,
        cuatrim: cuarter,
      },
    });
    const totalSilver = await this.rankingPartnerIndividual.find({
      relations: ['partner'],
      where: {
        rank: EnumRankPartnerIndividual.PLATA,
        cuatrim: cuarter,
      },
    });
    const totalGold = await this.rankingPartnerIndividual.find({
      relations: ['partner'],
      where: {
        rank: EnumRankPartnerIndividual.ORO,
        cuatrim: cuarter,
      },
    });
    // NonRepeat --------------------------------------------------------------
    const arrAssociates = [];
    const arrSilver = [];
    const arrGold = [];
    totalAssociates.length &&
      totalAssociates.map(el => {
        arrAssociates.push(el.partner.id);
      });
    totalSilver.length &&
      totalSilver.map(el => {
        arrSilver.push(el.partner.id);
      });
    totalGold &&
      totalGold.map(el => {
        arrGold.push(el.partner.id);
      });
    const newTotalAssociates = [...new Set(arrAssociates)].length;
    const newTotalSilver = [...new Set(arrSilver)].length;
    const newTotalGold = [...new Set(arrGold)].length;
    // -------------------------------------------------------------------------

    // ALFREDO ---------------------------------------------------------------
    const numberOfActualQuarterPromise = this.getNumberOfActualQuarter();

    const barGraphTotalScoreAssociatePromise = this.getBarGraphTotal({ rank: EnumRankPartnerIndividual.ASOCIADO });

    const barGraphCountTotalScoreAssociatePromise = this.getBarGraphCountTotal({
      rank: EnumRankPartnerIndividual.ASOCIADO,
    });

    const barGraphTotalScoreSilverPromise = this.getBarGraphTotal({ rank: EnumRankPartnerIndividual.PLATA });

    const barGraphCountTotalScoreSilverPromise = this.getBarGraphCountTotal({
      rank: EnumRankPartnerIndividual.PLATA,
    });

    const barGraphTotalScoreGoldPromise = this.getBarGraphTotal({ rank: EnumRankPartnerIndividual.ORO });

    const barGraphCountTotalScoreGoldPromise = this.getBarGraphCountTotal({
      rank: EnumRankPartnerIndividual.ORO,
    });

    const [
      numberOfActualQuarter,
      barGraphTotalScoreAssociate,
      barGraphCountTotalScoreAssociate,
      barGraphTotalScoreSilver,
      barGraphCountTotalScoreSilver,
      barGraphTotalScoreGold,
      barGraphCountTotalScoreGold,
    ] = await Promise.all([
      numberOfActualQuarterPromise,
      barGraphTotalScoreAssociatePromise,
      barGraphCountTotalScoreAssociatePromise,
      barGraphTotalScoreSilverPromise,
      barGraphCountTotalScoreSilverPromise,
      barGraphTotalScoreGoldPromise,
      barGraphCountTotalScoreGoldPromise,
    ]);

    // associates
    const barGraphMappedTotalAssociates = this.mapBarGraph({
      documents: barGraphTotalScoreAssociate,
      totalDocuments: barGraphCountTotalScoreAssociate.total,
    });
    // silver
    const barGraphMappedTotalSilver = this.mapBarGraph({
      documents: barGraphTotalScoreSilver,
      totalDocuments: barGraphCountTotalScoreSilver.total,
    });
    // gold
    const barGraphMappedTotalGold = this.mapBarGraph({
      documents: barGraphTotalScoreGold,
      totalDocuments: barGraphCountTotalScoreGold.total,
    });

    const compare = (a: any, b: any) => {
      const percentageA = a.percentage;
      const percentageB = b.percentage;

      let comparison = 0;
      if (percentageA > percentageB) {
        comparison = 1;
      } else if (percentageA < percentageB) {
        comparison = -1;
      }
      return comparison * -1;
    };

    // associates
    const sordetArrAssociates = barGraphMappedTotalAssociates.sort(compare);
    const slicedArrAssociates = sordetArrAssociates.slice(0, 3);
    // silver
    const sordetArrSilver = barGraphMappedTotalSilver.sort(compare);
    const slicedArrSilver = sordetArrSilver.slice(0, 3);
    // gold
    const sordetArrGold = barGraphMappedTotalGold.sort(compare);
    const slicedArrGold = sordetArrGold.slice(0, 3);

    return {
      totalAssociates: {
        name: 'Total asociados',
        total: newTotalAssociates,
        data: {
          title: 'Estatus de asociados',
          graphic_circle: [
            {
              title: 'Promedio cuatrimestral',
              percentage:
                Math.round(newTotalAssociates) / numberOfActualQuarter
                  ? Math.round(newTotalAssociates) / numberOfActualQuarter
                  : 0,
              total:
                Math.round(newTotalAssociates) / numberOfActualQuarter
                  ? Math.round(newTotalAssociates) / numberOfActualQuarter
                  : 0,
            },
            {
              title: 'Cuatrimestre anterior',
              percentage: Math.round(await this.getPrevAverageOfAssoc())
                ? Math.round(await this.getPrevAverageOfAssoc())
                : 0,
              total: Math.round(await this.getPrevAverageOfAssoc())
                ? Math.round(await this.getPrevAverageOfAssoc())
                : 0,
            },
            {
              title: 'Cuatrimestre actual',
              percentage: Math.round(await this.getActualAverageOfAssoc())
                ? Math.round(await this.getActualAverageOfAssoc())
                : 0,
              total: Math.round(await this.getActualAverageOfAssoc())
                ? Math.round(await this.getActualAverageOfAssoc())
                : 0,
            },
          ],
          bar_graph: slicedArrAssociates,
        },
      },
      totalSilver: {
        name: 'Total plata',
        total: newTotalSilver,
        data: {
          title: 'Estatus nivel plata',
          graphic_circle: [
            {
              title: 'Promedio cuatrimestral',
              percentage: Math.round(newTotalSilver / numberOfActualQuarter)
                ? Math.round(newTotalSilver / numberOfActualQuarter)
                : 0,
              total: Math.round(newTotalSilver / numberOfActualQuarter)
                ? Math.round(newTotalSilver / numberOfActualQuarter)
                : 0,
            },
            {
              title: 'Cuatrimestre anterior',
              percentage: Math.round(await this.getPrevAverageOfSilver())
                ? Math.round(await this.getPrevAverageOfSilver())
                : 0,
              total: Math.round(await this.getPrevAverageOfSilver())
                ? Math.round(await this.getPrevAverageOfSilver())
                : 0,
            },
            {
              title: 'Cuatrimestre actual',
              percentage: Math.round(await this.getActualAverageOfSilver())
                ? Math.round(await this.getActualAverageOfSilver())
                : 0,
              total: Math.round(await this.getActualAverageOfSilver())
                ? Math.round(await this.getActualAverageOfSilver())
                : 0,
            },
          ],
          bar_graph: slicedArrSilver,
        },
      },
      totalGold: {
        name: 'Total oro',
        total: newTotalGold,
        data: {
          title: 'Estatus de nivel oro',
          graphic_circle: [
            {
              title: 'Promedio cuatrimestral',
              percentage: Math.round(newTotalGold / numberOfActualQuarter)
                ? Math.round(newTotalGold / numberOfActualQuarter)
                : 0,
              total: Math.round(newTotalGold / numberOfActualQuarter)
                ? Math.round(newTotalGold / numberOfActualQuarter)
                : 0,
            },
            {
              title: 'Cuatrimestre anterior',
              percentage: Math.round(await this.getPrevAverageOfGold())
                ? Math.round(await this.getPrevAverageOfGold())
                : 0,
              total: Math.round(await this.getPrevAverageOfGold()) ? Math.round(await this.getPrevAverageOfGold()) : 0,
            },
            {
              title: 'Cuatrimestre actual',
              percentage: Math.round(await this.getActualAverageOfGold())
                ? Math.round(await this.getActualAverageOfGold())
                : 0,
              total: Math.round(await this.getActualAverageOfGold())
                ? Math.round(await this.getActualAverageOfGold())
                : 0,
            },
          ],
          bar_graph: slicedArrGold,
        },
      },
    };
  }

  private getPercentage({ total, parcial }: { total: number; parcial: number }): number {
    return +((parcial * 100) / total).toFixed(2);
  }

  private mapBarGraph({
    documents,
    totalDocuments,
  }: {
    documents: {
      title: string;
      total: string;
    }[];
    totalDocuments: number;
  }): {
    title: string;
    total: number;
    percentage: number;
  }[] {
    return documents.map(({ title, total }) => ({
      title,
      total: +total,
      percentage: this.getPercentage({ parcial: +total, total: totalDocuments }),
    }));
  }

  private getBarGraphTotal({ rank }: { rank: EnumRankPartnerIndividual }): Promise<{ title: string; total: string }[]> {
    return this.rankingPartnerIndividual
      .createQueryBuilder('ranking')
      .innerJoin('ranking.partner', 'partner')
      .innerJoin('partner.territory', 'territory')
      .select('territory.colony', 'title')
      .addSelect('COUNT(partner.id)', 'total')
      .where('ranking.rank = :rank', { rank })
      .groupBy('title')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  private getBarGraphCountTotal({ rank }: { rank: EnumRankPartnerIndividual }): Promise<{ total: number }> {
    return this.rankingPartnerIndividual
      .createQueryBuilder('ranking')
      .select('COUNT(ranking.partner)', 'total')
      .where('ranking.rank = :rank', { rank })
      .getRawOne();
  }
}
