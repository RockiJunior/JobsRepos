//Libraries
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DateTime } from 'luxon';

// Shemas
import { Partner } from '../../../common/database_entities/partner.entity';
import { GralReportsAssoc } from '../../../common/database_entities/gralReportsAssoc.entity';
import { AsociadoStatus, AsociadoStatusReports } from 'src/common/constants';
import { NotFoundException } from '../../../config/exceptions/not.found.exception';

@Injectable()
export class GralReportsAssocService {
  constructor(
    @InjectRepository(Partner) private readonly partnerModel: Repository<Partner>,
    @InjectRepository(GralReportsAssoc) private readonly gralReportsAssocModel: Repository<GralReportsAssoc>,
  ) {}

  getNumberOfActualWeek() {
    // Retorna el numero de semana actual
    const currentDate = new Date();
    return DateTime.local(currentDate).weekNumber;
  }
  // Affiliates
  async getPartnerAffQuantByWeekNumber(number: number) {
    // retorna el numero de afiliados, por numero de semana
    const partnerWeeks = await this.partnerModel.find({
      where: {
        status: AsociadoStatusReports.ACTIVE,
      },
    });
    const arr = partnerWeeks.filter(el => el.week == number);
    return arr.length;
  }
  // Pending
  async getPartnerPendQuantByWeekNumber(number: number) {
    // retorna el numero de pendientes, por numero de semana
    const partnerWeeks = await this.partnerModel.find({
      where: [
        { status: AsociadoStatusReports.ONBOARDING },
        { status: AsociadoStatusReports.ONBOARDING_FILES },
        { status: AsociadoStatusReports.TRAINING_PENDING },
        { status: AsociadoStatusReports.TRAINING_COMPLETED },
      ],
    });
    const arr = partnerWeeks.filter(el => el.week == number);
    return arr.length;
  }
  // Rejected
  async getPartnerRejQuantByWeekNumber(number: number) {
    // retorna el numero de rechazados, por numero de semana
    const partnerWeeks = await this.partnerModel.find({
      where: { status: AsociadoStatusReports.REJECTED },
    });
    const arr = partnerWeeks.filter(el => el.week == number);
    return arr.length;
  }

  async getReportsAssocWeeklyCron() {
    const numberOfPrevWeek = (await this.getNumberOfActualWeek()) - 1; // numero semana previa
    const numberOfActualWeek = await this.getNumberOfActualWeek(); // numero semana actual
    // Affiliates
    const prevQuanOfAff = await this.getPartnerAffQuantByWeekNumber(numberOfPrevWeek); // cantidad de afiliados de semana previa de previa
    const actQuanOfAff = await this.getPartnerAffQuantByWeekNumber(numberOfActualWeek); // cantidad de afiliados de semana previa de actual
    // Pendings
    const prevQuanOfPend = await this.getPartnerPendQuantByWeekNumber(numberOfActualWeek); // cantidad de pendientes de semana previa de previa
    const actQuanOfPend = await this.getPartnerPendQuantByWeekNumber(numberOfActualWeek); // cantidad de pendientes de semana previa de actual
    // Rejected
    const prevQuanOfRej = await this.getPartnerRejQuantByWeekNumber(numberOfPrevWeek); // cantidad de rechazados de semana previa de previa
    const actQuanOfRej = await this.getPartnerRejQuantByWeekNumber(numberOfActualWeek); // cantidad de rechazados de semana previa de actual

    const totalAffiliates = await this.partnerModel.find({
      where: {
        status: AsociadoStatusReports.ACTIVE,
      },
    });

    const pendingAffiliates = await this.partnerModel.find({
      where: [
        { status: AsociadoStatusReports.ONBOARDING },
        { status: AsociadoStatusReports.ONBOARDING_FILES },
        { status: AsociadoStatusReports.TRAINING_PENDING },
        { status: AsociadoStatusReports.TRAINING_COMPLETED },
      ],
    });

    const rejectedAffiliates = await this.partnerModel.find({
      where: {
        status: AsociadoStatusReports.REJECTED,
      },
    });

    const register = this.gralReportsAssocModel.create({
      week: await this.getNumberOfActualWeek(),
      quantityAffiliates: totalAffiliates.length,
      quantityPendingAffiliates: pendingAffiliates.length,
      quantityRejectedAffiliates: rejectedAffiliates.length,
      averageAffiliates: (prevQuanOfAff + actQuanOfAff) / 2,
      averagePendings: (prevQuanOfPend + actQuanOfPend) / 2,
      averageRejected: (prevQuanOfRej + actQuanOfRej) / 2,
    });
    await this.gralReportsAssocModel.save(register);
    return {
      message: 'Reporte semanal de asociados creado',
      data: register,
    };
  }
  // Affiliates
  async getPrevAffAverage() {
    // semana anterior
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

    prevPreviousReport = await this.gralReportsAssocModel.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsAssocModel.findOne({
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
      return (prevPreviousReport.averageAffiliates + previousReport.averageAffiliates) / 2;
    }
  }
  async getActualAffAverage() {
    // semana actual
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

    prevPreviousReport = await this.gralReportsAssocModel.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });

    previousReport = await this.gralReportsAssocModel.findOne({
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
      return (prevPreviousReport.averageAffiliates + previousReport.averageAffiliates) / 2;
    }
  }
  // Pendings
  async getPrevPendAverage() {
    // semana anterior
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

    prevPreviousReport = await this.gralReportsAssocModel.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsAssocModel.findOne({
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
      return (prevPreviousReport.averagePendings + previousReport.averagePendings) / 2;
    }
  }
  async getActualPendAverage() {
    // semana actual
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

    prevPreviousReport = await this.gralReportsAssocModel.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });

    previousReport = await this.gralReportsAssocModel.findOne({
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
      return (prevPreviousReport.averagePendings + previousReport.averagePendings) / 2;
    }
  }
  // Rejected
  async getPrevRejAverage() {
    // semana anterior
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

    prevPreviousReport = await this.gralReportsAssocModel.findOne({
      where: [
        {
          week: prevPreviousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });
    previousReport = await this.gralReportsAssocModel.findOne({
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
      return (prevPreviousReport.averageRejected + previousReport.averageRejected) / 2;
    }
  }
  async getActualRejAverage() {
    // semana actual
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

    prevPreviousReport = await this.gralReportsAssocModel.findOne({
      where: [
        {
          week: previousWeek,
        },
        {
          createdAt: Between(previousDate, currentDate),
        },
      ],
    });

    previousReport = await this.gralReportsAssocModel.findOne({
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
      return (prevPreviousReport.averageRejected + previousReport.averageRejected) / 2;
    }
  }

  async getReportsAssoc() {
    const totalAffiliatesPromise = this.partnerModel.find({
      where: {
        status: AsociadoStatusReports.ACTIVE,
      },
    });

    const pendingAffiliatesPromise = this.partnerModel.find({
      where: [
        { status: AsociadoStatusReports.ONBOARDING },
        { status: AsociadoStatusReports.ONBOARDING_FILES },
        { status: AsociadoStatusReports.TRAINING_PENDING },
        { status: AsociadoStatusReports.TRAINING_COMPLETED },
      ],
    });

    const rejectedAffiliatesPromise = this.partnerModel.find({
      where: {
        status: AsociadoStatusReports.REJECTED,
      },
    });

    const numberOfActualWeekPromise = this.getNumberOfActualWeek(); // numero semana actual

    const barGraphTotalAffiliatesPromise = this.partnerModel
      .createQueryBuilder('partner')
      .innerJoin('partner.territory', 'territory')
      .select('territory.colony', 'title')
      .addSelect('COUNT(territory.colony)', 'total')
      .groupBy('title')
      .orderBy('total', 'DESC')
      .getRawMany();

    const barGraphPendingAffiliatesPromise = this.partnerModel
      .createQueryBuilder('partner')
      .innerJoin('partner.territory', 'territory')
      .select('territory.colony', 'title')
      .addSelect('COUNT(territory.colony)', 'total')
      .where('partner.status = :status2', { status2: AsociadoStatus.ONBOARDING })
      .orWhere('partner.status = :status3', { status3: AsociadoStatus.ONBOARDING_FILES })
      .orWhere('partner.status = :status4', { status4: AsociadoStatus.TRAINING_PENDING })
      .orWhere('partner.status = :status5', { status5: AsociadoStatus.TRAINING_COMPLETED })
      .groupBy('title')
      .orderBy('total', 'DESC')
      .getRawMany();

    const barGraphRejectedAffiliatesPromise = this.partnerModel
      .createQueryBuilder('partner')
      .innerJoin('partner.territory', 'territory')
      .select('territory.colony', 'title')
      .addSelect('COUNT(territory.colony)', 'total')
      .where('partner.status = :status', { status: AsociadoStatusReports.REJECTED })
      .groupBy('title')
      .orderBy('total', 'DESC')
      .getRawMany();

    const [
      totalAffiliates,
      pendingAffiliates,
      rejectedAffiliates,
      numberOfActualWeek,
      barGraphTotalAffiliates,
      barGraphPendingAffiliates,
      barGraphRejectedAffiliates,
    ] = await Promise.all([
      totalAffiliatesPromise,
      pendingAffiliatesPromise,
      rejectedAffiliatesPromise,
      numberOfActualWeekPromise,
      barGraphTotalAffiliatesPromise,
      barGraphPendingAffiliatesPromise,
      barGraphRejectedAffiliatesPromise,
    ]);

    // Affiliates
    const barGraphMappedAffiliates = this.mapBarGraph({
      documents: barGraphTotalAffiliates,
      totalDocuments: totalAffiliates.length,
    });
    // Pendings
    const barGraphMappedPendingAffiliates = this.mapBarGraph({
      documents: barGraphPendingAffiliates,
      totalDocuments: pendingAffiliates.length,
    });
    // Rejected
    const barGraphMappedRejectedAffiliates = this.mapBarGraph({
      documents: barGraphRejectedAffiliates,
      totalDocuments: rejectedAffiliates.length,
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
    // Affiliates
    const sortedArrAffiliates = barGraphMappedAffiliates.sort(compare);
    const slicedArrAffiliates = sortedArrAffiliates.slice(0, 3);
    // pendingsAffiliates
    const sortedArrPendingAffiliates = barGraphMappedPendingAffiliates.sort(compare);
    const slicedArrPendingAffiliates = sortedArrPendingAffiliates.slice(0, 3);
    // Rejected
    const sortedArrRejectedAffiliates = barGraphMappedRejectedAffiliates.sort(compare);
    const slicedArrRejectedAffiliates = sortedArrRejectedAffiliates.slice(0, 3);
    return {
      reportsGeneralAssociated: {
        name: 'Total de afiliados',
        total: totalAffiliates.length,
        data: {
          title: 'Estatus de afiliación',
          graphic_circle: [
            {
              title: 'Promedio semanal',
              percentage: Math.round(totalAffiliates.length / numberOfActualWeek), // divido total de afiliados sobre numero de semanas
              total: Math.round(totalAffiliates.length / numberOfActualWeek),
            },
            {
              title: 'Semana anterior',
              percentage: Math.round(await this.getPrevAffAverage()),
              total: Math.round(await this.getPrevAffAverage()),
            },
            {
              title: 'Semana actual',
              percentage: Math.round(await this.getActualAffAverage()),
              total: Math.round(await this.getActualAffAverage()),
            },
          ],
          bar_graph: slicedArrAffiliates,
        },
      },
      pendingAffiliated: {
        name: 'Total de afiliados pendientes',
        total: pendingAffiliates.length,
        data: {
          title: 'Estatus de afiliados pendientes',
          graphic_circle: [
            {
              title: 'Promedio semanal',
              percentage: Math.round(pendingAffiliates.length / numberOfActualWeek),
              total: Math.round(pendingAffiliates.length / numberOfActualWeek),
            },
            {
              title: 'Semana anterior',
              percentage: Math.round(await this.getPrevPendAverage()),
              total: Math.round(await this.getPrevPendAverage()),
            },
            {
              title: 'Semana actual',
              percentage: Math.round(await this.getActualPendAverage()),
              total: Math.round(await this.getActualPendAverage()),
            },
          ],
          bar_graph: slicedArrPendingAffiliates,
        },
      },
      unfinishedAffiliated: {
        name: 'Total de afiliaciones rechazadas/no terminadas',
        total: rejectedAffiliates.length,
        data: {
          title: 'Estatus de afiliaciones rechazadas/no terminadas',
          graphic_circle: [
            {
              title: 'Promedio semanal',
              percentage: Math.round(rejectedAffiliates.length / numberOfActualWeek),
              total: Math.round(rejectedAffiliates.length / numberOfActualWeek),
            },
            {
              title: 'Semana anterior',
              percentage: Math.round(await this.getPrevRejAverage()),
              total: Math.round(await this.getPrevRejAverage()),
            },
            {
              title: 'Semana actual',
              percentage: Math.round(await this.getActualRejAverage()),
              total: Math.round(await this.getActualRejAverage()),
            },
          ],
          bar_graph: slicedArrRejectedAffiliates,
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
    documents: { title: string; total: string }[];
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
}
