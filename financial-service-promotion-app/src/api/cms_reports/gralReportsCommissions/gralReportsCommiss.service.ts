import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { GralReportsCommiss } from '../../../common/database_entities/gralReportsCommiss.entity';
import { DateTime } from 'luxon';
import { Reports } from '../../../common/database_entities/reports.entity';
import { Movements } from 'src/common/database_entities/movements.entity';
import { EnumMovementTypesNumbers } from '../../../common/constants';
import { NotFoundException } from '../../../config/exceptions/not.found.exception';

@Injectable()
export class GralReportsCommissService {
  constructor(
    @InjectRepository(Reports) private readonly reportsModel: Repository<Reports>,
    @InjectRepository(GralReportsCommiss) private readonly gralReportsComissModel: Repository<GralReportsCommiss>,
    @InjectRepository(Movements) private readonly movementsModel: Repository<Movements>,
  ) {}

  getNumberOfActualWeek() {
    return DateTime.local().weekNumber;
  }
  // Disbursementes by number week
  async getDisbursTotalAmountByNumberWeek(number: number) {
    // Retorna el monto total de desembolsos por numero de semana
    const disbursements = await this.reportsModel.find({
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.DESEMBOLSO,
        },
      },
    });
    const filterArr = disbursements.filter(el => el.week === number);
    const mounts = filterArr.reduce((acc, el) => acc + el.amount, 0);
    return mounts;
  }
  // Queries by number week
  async getQueriesTotalAmountByNumberWeek(number: number) {
    // Retorna el monto total de consultas por numero de semana
    const disbursements = await this.reportsModel.find({
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.CONSULTAS,
        },
      },
    });
    const filterArr = disbursements.filter(el => el.week === number);
    const mounts = filterArr.reduce((acc, el) => acc + el.amount, 0);
    return mounts;
  }
  // BuyBacks by number week
  async getBuyBackTotalAmountByNumberWeek(number: number) {
    // Retorna el monto total de desembolsos por numero de semana
    const disbursements = await this.reportsModel.find({
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.RECOMPRA,
        },
      },
    });
    const filterArr = disbursements.filter(el => el.week === number);
    const mounts = filterArr.reduce((acc, el) => acc + el.amount, 0);
    return mounts;
  }
  // Disbursements total amount
  async totalAmountDisbursements() {
    const disbursements = await this.reportsModel.find({
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.DESEMBOLSO,
        },
      },
    });
    const mounts = disbursements.reduce((acc, el) => acc + el.amount, 0);
    return mounts;
  }
  // Queries total amount
  async totalAmountQueries() {
    const queries = await this.reportsModel.find({
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.CONSULTAS,
        },
      },
    });
    const mounts = queries.reduce((acc, el) => acc + el.amount, 0);
    return mounts;
  }
  // BuyBack total amount
  async totalAmountBuyBack() {
    const burBacks = await this.reportsModel.find({
      relations: ['movement_type'],
      where: {
        movement_type: {
          id: EnumMovementTypesNumbers.RECOMPRA,
        },
      },
    });
    const mounts = burBacks.reduce((acc, el) => acc + el.amount, 0);
    return mounts;
  }

  async getReportsCommissWeeklyCron() {
    const numberOfActualWeek = await this.getNumberOfActualWeek();
    const numberOfPrevWeek = numberOfActualWeek - 1;
    // Disbuersements
    const prevAmountOfDisburs = await this.getDisbursTotalAmountByNumberWeek(numberOfPrevWeek);
    const actualAmountOfDisburs = await this.getDisbursTotalAmountByNumberWeek(numberOfActualWeek);
    // Queries
    const prevAmountOfQueries = await this.getQueriesTotalAmountByNumberWeek(numberOfPrevWeek);
    const actualAmountOfQueries = await this.getQueriesTotalAmountByNumberWeek(numberOfActualWeek);
    // BuyBacks
    const prevAmountOfBuyBacks = await this.getBuyBackTotalAmountByNumberWeek(numberOfPrevWeek);
    const actualAmountOfBuyBacks = await this.getBuyBackTotalAmountByNumberWeek(numberOfActualWeek);

    const register = this.gralReportsComissModel.create({
      week: numberOfActualWeek,
      amountOfDisbursements: await this.totalAmountDisbursements(),
      amountOfQueries: await this.totalAmountQueries(),
      amountOfBuyBacks: await this.totalAmountBuyBack(),
      averageOfDisbursements: (prevAmountOfDisburs + actualAmountOfDisburs) / 2,
      averageOfQueries: (prevAmountOfQueries + actualAmountOfQueries) / 2,
      averageOfBuyBacks: (prevAmountOfBuyBacks + actualAmountOfBuyBacks) / 2,
    });
    await this.gralReportsComissModel.save(register);
    return {
      message: 'Reporte de comisiones semanal creado',
      data: register,
    };
  }
  // Disbursements average
  async getPrevAverageDisbursReportsComiss() {
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

    prevPreviousReport = await this.gralReportsComissModel.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsComissModel.findOne({
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
  async getActualAverageDisbursReportsCommis() {
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

    prevPreviousReport = await this.gralReportsComissModel.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsComissModel.findOne({
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
  // Queries average
  async getPrevAverageQueriesReportsComiss() {
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

    prevPreviousReport = await this.gralReportsComissModel.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsComissModel.findOne({
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
  async getActualAverageQueriesReportsComiss() {
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

    prevPreviousReport = await this.gralReportsComissModel.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsComissModel.findOne({
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
  // BuyBacks average
  async getPrevAverageBuyBacksReportsComiss() {
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

    prevPreviousReport = await this.gralReportsComissModel.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsComissModel.findOne({
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
      return (prevPreviousReport.averageOfBuyBacks + previousReport.averageOfBuyBacks) / 2;
    }
  }
  async getActualAverageBuyBacksReportsComiss() {
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

    prevPreviousReport = await this.gralReportsComissModel.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsComissModel.findOne({
      where: [
        {
          week: currentWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    return (prevPreviousReport.averageOfBuyBacks + previousReport?.averageOfBuyBacks || 0) / 2;
  }

  async getReportsCommiss() {
    const numberOfActualWeekPromise = this.getNumberOfActualWeek(); // numero semana actual

    const barGraphTotalAmountDisbursementsPromise = this.getBarGraphTotal({ movementTypesId: 4 });

    const barGraphCountTotalAmountDisbursementsPromise = this.getBarGraphCountTotal({ movementTypesId: 4 });

    const barGraphTotalAmountQueriesPromise = this.getBarGraphTotal({ movementTypesId: 1 });

    const barGraphCountTotalAmountQueriesPromise = this.getBarGraphCountTotal({ movementTypesId: 1 });

    const barGraphTotalAmountBuyBacksPromise = this.getBarGraphTotal({ movementTypesId: 3 });

    const barGraphCountTotalAmountBuyBacksPromise = this.getBarGraphCountTotal({ movementTypesId: 3 });

    const [
      numberOfActualWeek,
      barGraphTotalAmountDisbursements,
      barGraphCountTotalAmountDisbursements,
      barGraphTotalAmountQueries,
      barGraphCountTotalAmountQueries,
      barGraphTotalAmountBuyBacks,
      barGraphCountTotalAmountBuyBacks,
    ] = await Promise.all([
      numberOfActualWeekPromise,
      barGraphTotalAmountDisbursementsPromise,
      barGraphCountTotalAmountDisbursementsPromise,
      barGraphTotalAmountQueriesPromise,
      barGraphCountTotalAmountQueriesPromise,
      barGraphTotalAmountBuyBacksPromise,
      barGraphCountTotalAmountBuyBacksPromise,
    ]);

    // Disbursements
    const barGraphMappedDisbursements = this.mapBarGraph({
      documents: barGraphTotalAmountDisbursements,
      totalDocuments: barGraphCountTotalAmountDisbursements.total,
    });
    // Queries
    const barGraphMappedQueries = this.mapBarGraph({
      documents: barGraphTotalAmountQueries,
      totalDocuments: barGraphCountTotalAmountQueries.total,
    });
    // BuyBacks
    const barGraphMappedBuyBacks = this.mapBarGraph({
      documents: barGraphTotalAmountBuyBacks,
      totalDocuments: barGraphCountTotalAmountBuyBacks.total,
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
        total: await this.totalAmountDisbursements(),
        data: {
          title: 'Estatus de desembolsos',
          graphic_circle: [
            {
              title: 'Promedio semanal',
              percentage: Math.round((await this.totalAmountDisbursements()) / numberOfActualWeek),
              total: Math.round((await this.totalAmountDisbursements()) / numberOfActualWeek),
            },
            {
              title: 'Semana anterior',
              percentage: Math.round(await this.getPrevAverageDisbursReportsComiss()),
              total: Math.round(await this.getPrevAverageDisbursReportsComiss()),
            },
            {
              title: 'Semana actual',
              percentage: Math.round(await this.getActualAverageDisbursReportsCommis()),
              total: Math.round(await this.getActualAverageDisbursReportsCommis()),
            },
          ],
          bar_graph: slicedArrDisbursements,
        },
      },
      totalQueries: {
        name: 'Total de consultas',
        total: await this.totalAmountQueries(),
        data: {
          title: 'Estatus de consultas',
          graphic_circle: [
            {
              title: 'Promedio semanal',
              percentage: Math.round((await this.totalAmountQueries()) / numberOfActualWeek),
              total: Math.round((await this.totalAmountQueries()) / numberOfActualWeek),
            },
            {
              title: 'Semana anterior',
              percentage: Math.round(await this.getPrevAverageQueriesReportsComiss()),
              total: Math.round(await this.getPrevAverageQueriesReportsComiss()),
            },
            {
              title: 'Semana actual',
              percentage: Math.round(await this.getActualAverageQueriesReportsComiss()),
              total: Math.round(await this.getActualAverageQueriesReportsComiss()),
            },
          ],
          bar_graph: slicedArrQueries,
        },
      },
      totalBuyBacks: {
        name: 'Total de recompras',
        total: await this.totalAmountBuyBack(),
        data: {
          title: 'Estatus de recompras',
          graphic_circle: [
            {
              title: 'Promedio semanal',
              percentage: Math.round((await this.totalAmountBuyBack()) / numberOfActualWeek),
              total: Math.round((await this.totalAmountBuyBack()) / numberOfActualWeek),
            },
            {
              title: 'Semana anterior',
              percentage: Math.round(await this.getPrevAverageBuyBacksReportsComiss()),
              total: Math.round(await this.getPrevAverageBuyBacksReportsComiss()),
            },
            {
              title: 'Semana actual',
              percentage: Math.round(await this.getActualAverageBuyBacksReportsComiss()),
              total: Math.round(await this.getActualAverageBuyBacksReportsComiss()),
            },
          ],
          bar_graph: slicedArrBuyBacks,
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
      .addSelect('SUM(movement.amount)', 'total')
      .where('movement.movementTypesId = :id', { id: movementTypesId })
      .groupBy('title')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  private getBarGraphCountTotal({ movementTypesId }: { movementTypesId: number }): Promise<{ total: number }> {
    return this.movementsModel
      .createQueryBuilder('movement')
      .select('SUM(movement.amount)', 'total')
      .where('movement.movement_types = :id', { id: movementTypesId })
      .getRawOne();
  }
}
