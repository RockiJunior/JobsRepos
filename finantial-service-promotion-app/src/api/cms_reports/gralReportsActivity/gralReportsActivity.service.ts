import { HttpCode, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { GralReportsActivity } from '../../../common/database_entities/gralReportsActivity.entity';
import { Reports } from 'src/common/database_entities/reports.entity';
import { DateTime } from 'luxon';
import { EnumMovementTypesNumbers } from '../../../common/constants';
import { Movements } from '../../../common/database_entities/movements.entity';
import { NotFoundException } from '../../../config/exceptions/not.found.exception';

@Injectable()
export class GralReportsActivityService {
  static getGralReportsActivity: any;
  static getReportsActivityWeeklyCron: any;
  constructor(
    @InjectRepository(Reports) private readonly reportsModel: Repository<Reports>,
    @InjectRepository(GralReportsActivity) private readonly gralReportsActivity: Repository<GralReportsActivity>,
    @InjectRepository(Movements) private readonly movementsModel: Repository<Movements>,
  ) {}

  getNumberOfActualWeek() {
    // Retorna el numero de semana actual
    const currentDate = new Date();
    return DateTime.local(currentDate).weekNumber;
  }

  // Disbursements
  async getDisbursReportsByNumberWeek(number: number) {
    // Retorna la cantidad de desembolsos por numero de semana
    const disbursements = await this.reportsModel.find({
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.DESEMBOLSO,
        },
      },
    });
    const arr = disbursements.filter(el => el.week === number);
    return arr.reduce((el, acc) => el + acc.quantity, 0);
  }
  // Queries
  async getQueriesReportsByNumberWeek(number: number) {
    // Retorna la cantidad de consultas por numero de semana
    const disbursements = await this.reportsModel.find({
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.CONSULTAS,
        },
      },
    });
    const arr = disbursements.filter(el => el.week === number);
    return arr.reduce((el, acc) => el + acc.quantity, 0);
  }
  // BuyBacks
  async getBuyBackReportsByNumberWeek(number: number) {
    // Retorna la cantidad de desembolsos por numero de semana
    const disbursements = await this.reportsModel.find({
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.RECOMPRA,
        },
      },
    });
    const arr = disbursements.filter(el => el.week === number);
    return arr.reduce((el, acc) => el + acc.quantity, 0);
  }

  async getReportsActivityWeeklyCron() {
    let numberOfPrevWeek = this.getNumberOfActualWeek() - 1;
    const numberOfActualWeek = this.getNumberOfActualWeek();
    if (numberOfActualWeek === 1) {
      numberOfPrevWeek = 52;
    }
    // Disbursements - Desembolsos - 4
    const prevQuanOfDisburs = await this.getDisbursReportsByNumberWeek(numberOfPrevWeek);
    const actuQuanOfDisburs = await this.getDisbursReportsByNumberWeek(numberOfActualWeek);
    // Queries - Consultas - 1
    const prevQuanOfQueries = await this.getQueriesReportsByNumberWeek(numberOfPrevWeek);
    const actuQuanOfQueries = await this.getQueriesReportsByNumberWeek(numberOfActualWeek);
    // BuyBacks - Recompras - 3
    const prevQuanOfBuyBacks = await this.getBuyBackReportsByNumberWeek(numberOfPrevWeek);
    const actuQuanOfBuyBacks = await this.getBuyBackReportsByNumberWeek(numberOfActualWeek);
    // totalDisbursements -----------
    const totalDisbursements = await this.reportsModel.find({
      // Retorna el total de desembolsos
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.DESEMBOLSO,
        },
      },
    });
    const disbursements = totalDisbursements.reduce((el, acc) => el + acc.quantity, 0);
    // totalQueries ----------------
    const totalQueries = await this.reportsModel.find({
      // Retorna el total de consultas
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.CONSULTAS,
        },
      },
    });
    const queries = totalQueries.reduce((el, acc) => el + acc.quantity, 0);
    // totalBuyBacks ----------------
    const totalBuyBacks = await this.reportsModel.find({
      // Retorna el total de recompras
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.RECOMPRA,
        },
      },
    });
    const buyBacks = totalBuyBacks.reduce((el, acc) => el + acc.quantity, 0);
    // creating register ----------------
    const register = this.gralReportsActivity.create({
      week: await this.getNumberOfActualWeek(),
      quantityOfDisbursements: disbursements,
      quantityOfQueries: queries,
      quantityOfBuyback: buyBacks,
      averageOfDisbursements: (prevQuanOfDisburs + actuQuanOfDisburs) / 2,
      averageOfQueries: (prevQuanOfQueries + actuQuanOfQueries) / 2,
      averageOfBuyback: (prevQuanOfBuyBacks + actuQuanOfBuyBacks) / 2,
    });
    await this.gralReportsActivity.save(register); // saving register
    return {
      message: 'Reporte de actividad semanal creado',
      data: register,
    };
  }

  // Disbursementes - Desembolsos
  async getPrevAverageDisbursReportsActivity() {
    // Promedio semana anterior
    let prevPreviousReport: any;
    let previousReport: any;
    let currentDate = new Date();

    let yearCurrentDate = currentDate.getFullYear();
    let monthCurrentDate = currentDate.getMonth();
    let dayCurrentDate = currentDate.getDate();

    let previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate - 1}-${dayCurrentDate}`);
    if (monthCurrentDate === 0) {
      monthCurrentDate = 11;
      previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate}-${dayCurrentDate}`);
    }

    let prevPreviousWeek = this.getNumberOfActualWeek() - 2;
    let previousWeek = this.getNumberOfActualWeek() - 1;
    let currentWeek = this.getNumberOfActualWeek();

    if (currentWeek === 1) {
      prevPreviousWeek = 51;
      previousWeek = 52;
    }
    prevPreviousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    if (prevPreviousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal previo al anterior');
    }
    if (previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal anterior');
    } else if (prevPreviousReport === undefined && previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron registros semanales en la base de datos');
    } else {
      return (prevPreviousReport.averageOfDisbursements + previousReport.averageOfDisbursements) / 2;
    }
  }
  async getActualAverageDisbursReportsActivity() {
    // Promedio semana actual
    let prevPreviousReport: any;
    let previousReport: any;
    let currentDate = new Date();

    let yearCurrentDate = currentDate.getFullYear();
    let monthCurrentDate = currentDate.getMonth();
    let dayCurrentDate = currentDate.getDate();

    let previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate - 1}-${dayCurrentDate}`);
    if (monthCurrentDate === 0) {
      monthCurrentDate = 11;
      previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate}-${dayCurrentDate}`);
    }

    let prevPreviousWeek = this.getNumberOfActualWeek() - 2;
    let previousWeek = this.getNumberOfActualWeek() - 1;
    let currentWeek = this.getNumberOfActualWeek();
    if (currentWeek === 1) {
      prevPreviousWeek = 51;
      previousWeek = 52;
    }

    prevPreviousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: currentWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    if (prevPreviousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal previo al anterior');
    }
    if (previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal anterior');
    } else if (prevPreviousReport === undefined && previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron registros semanales en la base de datos');
    } else {
      return (prevPreviousReport.averageOfDisbursements + previousReport.averageOfDisbursements) / 2;
    }
  }
  // Queries - Consultas
  async getPrevAverageQueriesReportsActivity() {
    // Promedio semana anterior
    let prevPreviousReport: any;
    let previousReport: any;
    let currentDate = new Date();

    let yearCurrentDate = currentDate.getFullYear();
    let monthCurrentDate = currentDate.getMonth();
    let dayCurrentDate = currentDate.getDate();

    let previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate - 1}-${dayCurrentDate}`);
    if (monthCurrentDate === 0) {
      monthCurrentDate = 11;
      previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate}-${dayCurrentDate}`);
    }

    let prevPreviousWeek = this.getNumberOfActualWeek() - 2;
    let previousWeek = this.getNumberOfActualWeek() - 1;
    let currentWeek = this.getNumberOfActualWeek();
    if (currentWeek === 1) {
      prevPreviousWeek = 51;
      previousWeek = 52;
    }

    prevPreviousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    if (prevPreviousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal previo al anterior');
    }
    if (previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal anterior');
    } else if (prevPreviousReport === undefined && previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron registros semanales en la base de datos');
    } else {
      return (prevPreviousReport.averageOfQueries + previousReport.averageOfQueries) / 2;
    }
  }
  async getActualAverageQueriesReportsActivity() {
    // Promedio semana actual
    let prevPreviousReport: any;
    let previousReport: any;
    let currentDate = new Date();

    let yearCurrentDate = currentDate.getFullYear();
    let monthCurrentDate = currentDate.getMonth();
    let dayCurrentDate = currentDate.getDate();

    let previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate - 1}-${dayCurrentDate}`);
    if (monthCurrentDate === 0) {
      monthCurrentDate = 11;
      previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate}-${dayCurrentDate}`);
    }

    let prevPreviousWeek = this.getNumberOfActualWeek() - 2;
    let previousWeek = this.getNumberOfActualWeek() - 1;
    let currentWeek = this.getNumberOfActualWeek();
    if (currentWeek === 1) {
      prevPreviousWeek = 51;
      previousWeek = 52;
    }

    prevPreviousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: currentWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    if (prevPreviousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal previo al anterior');
    }
    if (previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal anterior');
    } else if (prevPreviousReport === undefined && previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron registros semanales en la base de datos');
    } else {
      return (prevPreviousReport.averageOfQueries + previousReport.averageOfQueries) / 2;
    }
  }
  // BuyBacks - Recompras
  async getPrevAverageBuyBackReportsActivity() {
    // Promedio semana anterior
    let prevPreviousReport: any;
    let previousReport: any;
    let currentDate = new Date();

    let yearCurrentDate = currentDate.getFullYear();
    let monthCurrentDate = currentDate.getMonth();
    let dayCurrentDate = currentDate.getDate();

    let previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate - 1}-${dayCurrentDate}`);
    if (monthCurrentDate === 0) {
      monthCurrentDate = 11;
      previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate}-${dayCurrentDate}`);
    }

    let prevPreviousWeek = this.getNumberOfActualWeek() - 2;
    let previousWeek = this.getNumberOfActualWeek() - 1;
    let currentWeek = this.getNumberOfActualWeek();
    if (currentWeek === 1) {
      prevPreviousWeek = 51;
      previousWeek = 52;
    }

    prevPreviousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    if (prevPreviousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal previo al anterior');
    }
    if (previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal anterior');
    } else if (prevPreviousReport === undefined && previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron registros semanales en la base de datos');
    } else {
      return (prevPreviousReport.averageOfBuyback + previousReport?.averageOfBuyback) / 2;
    }
  }
  async getActualAverageBuyBackReportsActivity() {
    // Promedio semana actual
    let prevPreviousReport: any;
    let previousReport: any;
    let currentDate = new Date();

    let yearCurrentDate = currentDate.getFullYear();
    let monthCurrentDate = currentDate.getMonth();
    let dayCurrentDate = currentDate.getDate();

    let previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate - 1}-${dayCurrentDate}`);
    if (monthCurrentDate === 0) {
      monthCurrentDate = 11;
      previousDate = new Date(`${yearCurrentDate}-${monthCurrentDate}-${dayCurrentDate}`);
    }

    let prevPreviousWeek = this.getNumberOfActualWeek() - 2;
    let previousWeek = this.getNumberOfActualWeek() - 1;
    let currentWeek = this.getNumberOfActualWeek();
    if (currentWeek === 1) {
      prevPreviousWeek = 51;
      previousWeek = 52;
    }

    prevPreviousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsActivity.findOne({
      where: [
        {
          week: currentWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    if (prevPreviousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal previo al anterior');
    }
    if (previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontro el reporte semanal anterior');
    } else if (prevPreviousReport === undefined && previousReport === undefined) {
      throw new NotFoundException('404', 'No se encontraron registros semanales en la base de datos');
    } else {
      return (prevPreviousReport.averageOfBuyback + previousReport?.averageOfBuyback) / 2;
    }
  }

  async getReportsActivity() {
    // ----------------------------------------------------------------------------------------------
    // Disbursements
    const totalDisbursementsPromise = await this.reportsModel.find({
      // Retorna el total de desembolsos - array
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.DESEMBOLSO,
        },
      },
    });
    const disbursements = totalDisbursementsPromise.reduce((el, acc) => el + acc.quantity, 0);
    // Queries
    const totalQueriesPromise = await this.reportsModel.find({
      // Retorna el total de consultas - array
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.CONSULTAS,
        },
      },
    });
    const queries = totalQueriesPromise.reduce((el, acc) => el + acc.quantity, 0);
    // BuyBacks
    const totalBuyBacksPromise = await this.reportsModel.find({
      // Retorna el total de recompras - array
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.RECOMPRA,
        },
      },
    });
    const buyBacks = totalBuyBacksPromise.reduce((el, acc) => el + acc.quantity, 0);
    // ----------------------------------------------------------------------------------------------

    const numberOfActualWeekPromise = this.getNumberOfActualWeek(); // numero semana actual

    const barGraphTotalDisbursementsPromise = this.getBarGraphTotal({ movementTypesId: 4 });

    const barGraphCountTotalDisbursementsPromise = this.getBarGraphCountTotal({ movementTypesId: 4 });

    const barGraphTotalQueriesPromise = this.getBarGraphTotal({ movementTypesId: 1 });

    const barGraphCountTotalQueriesPromise = this.getBarGraphCountTotal({ movementTypesId: 1 });

    const barGraphTotalBuyBacksPromise = this.getBarGraphTotal({ movementTypesId: 3 });

    const barGraphCountTotalBuyBacksPromise = this.getBarGraphCountTotal({ movementTypesId: 3 });

    const [
      totalDisbursements,
      totalQueries,
      totalBuyBacks,
      numberOfActualWeek,
      barGraphTotalDisbursements,
      barGraphCountTotalDisbursements,
      barGraphTotalQueries,
      barGraphCountTotalQueries,
      barGraphTotalBuyBacks,
      barGraphCountTotalBuyBacks,
    ] = await Promise.all([
      totalDisbursementsPromise,
      totalQueriesPromise,
      totalBuyBacksPromise,
      numberOfActualWeekPromise,
      barGraphTotalDisbursementsPromise,
      barGraphCountTotalDisbursementsPromise,
      barGraphTotalQueriesPromise,
      barGraphCountTotalQueriesPromise,
      barGraphTotalBuyBacksPromise,
      barGraphCountTotalBuyBacksPromise,
    ]);

    // Disbursements
    const barGraphMappedDisbursements = this.mapBarGraph({
      documents: barGraphTotalDisbursements,
      totalDocuments: barGraphCountTotalDisbursements.total,
    });
    // Queries
    const barGraphMappedQueries = this.mapBarGraph({
      documents: barGraphTotalQueries,
      totalDocuments: barGraphCountTotalQueries.total,
    });
    // BuyBacks
    const barGraphMappedBuyBacks = this.mapBarGraph({
      documents: barGraphTotalBuyBacks,
      totalDocuments: barGraphCountTotalBuyBacks.total,
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

    // Disbursements
    const sortedArrDisbursements = barGraphMappedDisbursements.sort(compare);
    const slicedArrDisbursements = sortedArrDisbursements.slice(0, 3);
    // Queries
    const sortedArrQueries = barGraphMappedQueries.sort(compare);
    const slicedArrQueries = sortedArrQueries.slice(0, 3);
    // BuyBacks
    const sortedArrBuyBacks = barGraphMappedBuyBacks.sort(compare);
    const slicedArrBuyBacks = sortedArrBuyBacks.slice(0, 3);

    return {
      totalDisbursements: {
        name: 'Total de desembolsos',
        total: disbursements,
        data: {
          title: 'Estatus de desembolsos',
          graphic_circle: [
            {
              title: 'Promedio semanal',
              percentage: Math.round(totalDisbursements.length / numberOfActualWeek),
              total: Math.round(totalDisbursements.length / numberOfActualWeek),
            },
            {
              title: 'Semana anterior',
              percentage: Math.round(await this.getPrevAverageDisbursReportsActivity()),
              total: Math.round(await this.getPrevAverageDisbursReportsActivity()),
            },
            {
              title: 'Semana actual',
              percentage: Math.round(await this.getActualAverageDisbursReportsActivity()),
              total: Math.round(await this.getActualAverageDisbursReportsActivity()),
            },
          ],
          bar_graph: slicedArrDisbursements,
        },
      },
      totalQueries: {
        name: 'Total de consultas',
        total: queries,
        data: {
          title: 'Estatus de consultas',
          graphic_circle: [
            {
              title: 'Promedio semanal',
              percentage: Math.round(totalQueries.length / numberOfActualWeek),
              total: Math.round(totalQueries.length / numberOfActualWeek),
            },
            {
              title: 'Semana anterior',
              percentage: Math.round(await this.getPrevAverageQueriesReportsActivity()),
              total: Math.round(await this.getPrevAverageQueriesReportsActivity()),
            },
            {
              title: 'Semana actual',
              percentage: Math.round(await this.getActualAverageQueriesReportsActivity()),
              total: Math.round(await this.getActualAverageQueriesReportsActivity()),
            },
          ],
          bar_graph: slicedArrQueries,
        },
      },
      totalBuyBacks: {
        name: 'Total de recompras',
        total: buyBacks,
        data: {
          title: 'Estatus de recompras',
          graphic_circle: [
            {
              title: 'Promedio semanal',
              percentage: Math.round(totalBuyBacks.length / numberOfActualWeek),
              total: Math.round(totalBuyBacks.length / numberOfActualWeek),
            },
            {
              title: 'Semana anterior',
              percentage: Math.round(await this.getPrevAverageBuyBackReportsActivity()),
              total: Math.round(await this.getPrevAverageBuyBackReportsActivity()),
            },
            {
              title: 'Semana actual',
              percentage: Math.round(await this.getActualAverageBuyBackReportsActivity()),
              total: Math.round(await this.getActualAverageBuyBackReportsActivity()),
            },
          ],
          bar_graph: slicedArrBuyBacks,
        },
      },
    };
  }

  private getPercentage({ total, parcial }: { total: number; parcial: number }): number {
    // console.log(((parcial * 100) / total).toFixed(2));
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

  private getBarGraphTotal({
    movementTypesId,
  }: {
    movementTypesId: number;
  }): Promise<{ title: string; total: string }[]> {
    return this.movementsModel
      .createQueryBuilder('movement')
      .innerJoin('movement.partner', 'partner')
      .innerJoin('partner.territory', 'territory')
      .select('territory.colony', 'title')
      .addSelect('COUNT(territory.colony)', 'total')
      .where('movement.movementTypesId = :id', { id: movementTypesId })
      .groupBy('title')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  private getBarGraphCountTotal({ movementTypesId }: { movementTypesId: number }): Promise<{ total: number }> {
    return this.movementsModel
      .createQueryBuilder('movement')
      .select('COUNT(movement.id)', 'total')
      .where('movement.movement_types = :id', { id: movementTypesId })
      .getRawOne();
  }
}
