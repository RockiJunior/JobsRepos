import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Commission } from '../../common/database_entities/commission.entity';
import { Concept } from '../../common/database_entities/concept.entity';
import { CommissionType } from '../../common/database_entities/commission_type.entity';
import { Level } from '../../common/database_entities/level.entity';
import { MeasurementUnit } from '../../common/database_entities/measurment_unit.entity';
import { PaymentChronology } from '../../common/database_entities/payment_chronology.entity';
import { Partner } from 'src/common/database_entities/partner.entity';
import { Reports } from 'src/common/database_entities/reports.entity';
import { RankingPartnersIndiv } from 'src/common/database_entities/rankingPartnersIndiv.entity';
import { RankingPartnersLead } from 'src/common/database_entities/rankingPartnersLead.entity';
import { AsociadoStatus, EnumMovementTypes, EnumPeriodRanking } from 'src/common/constants';
import { IndividualCommissions } from 'src/common/database_entities/individual_commissions.entity';
import { MonthlyBonus } from 'src/common/database_entities/monthly_bonus.entity';
import { CommissionsPatchDTO } from './dtos/patch_commisions.dto';
import { RankingLeadership } from 'src/common/database_entities/rankingLeadership.entity';
import { ReferredEntity } from 'src/common/database_entities/referred.entity';
import { LeadershipCommissions } from 'src/common/database_entities/leadership_commissions.entity';
import { MonthlyGoal } from 'src/common/database_entities/monthly_goal.entity';
import { EnumLeaderRank } from '../../common/constants';
import { DateTime } from 'luxon';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,
    @InjectRepository(Concept)
    private readonly conceptRepository: Repository<Concept>,
    @InjectRepository(CommissionType)
    private readonly commissionTypeRepository: Repository<CommissionType>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    @InjectRepository(MeasurementUnit)
    private readonly measurementUnitRepository: Repository<MeasurementUnit>,
    @InjectRepository(PaymentChronology)
    private readonly paymentChronologyRepository: Repository<PaymentChronology>,
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
    @InjectRepository(RankingPartnersIndiv)
    private readonly rankingIndividualRepo: Repository<RankingPartnersIndiv>,
    @InjectRepository(RankingPartnersLead)
    private readonly rankingLeadershipRepo: Repository<RankingPartnersLead>,
    @InjectRepository(IndividualCommissions)
    private readonly individualCommissionsRepo: Repository<IndividualCommissions>,
    @InjectRepository(LeadershipCommissions)
    private readonly leadershipCommissionRepo: Repository<LeadershipCommissions>,
    @InjectRepository(MonthlyBonus)
    private readonly monthlyBonusRepository: Repository<MonthlyBonus>,
    @InjectRepository(MonthlyGoal)
    private readonly monthlyGoalRepository: Repository<MonthlyGoal>,
    @InjectRepository(RankingLeadership)
    private readonly rankingLeadershipCMS: Repository<RankingLeadership>,
    @InjectRepository(ReferredEntity)
    private readonly referredRepository: Repository<ReferredEntity>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  //Find all commissions
  async findAll(is_individual: boolean) {
    const commissions = await this.commissionRepository.find({
      where: {
        ranking: is_individual ? 'Individual' : 'Liderazgo',
      },
    });

    return {
      params: await this.getParams(),
      commissions: commissions,
    };
  }

  //Find commission by id
  async findById(id: number) {
    const comission = await this.commissionRepository.findOne(id);

    return {
      params: await this.getParams(),
      commissions: comission,
    };
  }

  //Update commission by id
  async update(id: number, commission: CommissionsPatchDTO): Promise<CommissionsPatchDTO> {
    const commissionToUpdate = await this.commissionRepository.findOne(id);
    if (!commissionToUpdate) {
      throw new Error('Commission not found');
    }
    await this.commissionRepository.update(id, commission);
    const commissionUpdated = await this.commissionRepository.findOne(id);
    return commissionUpdated;
  }

  //Delete commission
  async delete(id: number): Promise<Commission> {
    const commission = await this.commissionRepository.findOne(id);
    if (!commission) {
      throw new Error('Commission not found');
    }
    await this.commissionRepository.update(id, { is_active: false });
    return commission;
  }

  async getParams() {
    //TODO: This should be improved with relations later
    const concepts = await this.conceptRepository.find();
    const commissionTypes = await this.commissionTypeRepository.find();
    const levels = await this.levelRepository.find();
    const measurementUnits = await this.measurementUnitRepository.find();
    const paymentChronologies = await this.paymentChronologyRepository.find();

    const params = {
      concepts: concepts,
      commissionTypes: commissionTypes,
      levels: levels,
      measurementUnits: measurementUnits,
      paymentChronologies: paymentChronologies,
    };
    return params;
  }

  //Generate individual commissions
  async generateIndividualComm(id: number) {
    //Generación de fechas, meses y semanas
    const today = new Date();
    const month = today.getMonth();
    const current_week = this.getNumberOfWeek();
    const week = current_week === 0 ? 52 : current_week - 1;

    const cuatri =
      month === 0 || month === 1 || month === 2 || month === 3
        ? 1
        : month === 4 || month === 5 || month === 6 || month === 7
        ? 2
        : month === 8 || month === 9 || month === 10 || month === 11
        ? 3
        : null;

    //Búsqueda de partner y sus reportes
    const partner = await this.partnerRepository.findOne(id);
    const reports_filtered = await this.reportsRepository.find({
      where: { partner: partner, week: week },
      relations: ['movement_type'],
    });

    //Genero comisiones para cuando no hay reportes la semana anterior
    if (reports_filtered.length === 0) {
      const commission_created = this.individualCommissionsRepo.create({
        amount_desembolsos_first: 0,
        quantity_desembolsos_first: 0,
        commission_desembolsos_first: 0,
        amount_desembolsos_second: 0,
        quantity_desembolsos_second: 0,
        commission_desembolsos_second: 0,
        quantity_consultas: 0,
        commission_consultas: 0,
        amount_recompras: 0,
        commission_recompras: 0,
        commission_casos_al_corriente: 0,
        fee_first_stretch: 0,
        fee_second_stretch: 0,
        fee_consultas: 0,
        fee_recompras: 0,
        week: week,
        partner: partner,
        minimum_consultas: 0,
      });
      await this.individualCommissionsRepo.save(commission_created);
      //Acá si ya tienen reportes, filtramos los reportes por tipo
    } else {
      const reports_by_consultas = reports_filtered.find(el => el.movement_type.name === EnumMovementTypes.CONSULTAS);
      const reports_by_des = reports_filtered.find(el => el.movement_type.name === EnumMovementTypes.DESEMBOLSO);
      const reports_by_rec = reports_filtered.find(el => el.movement_type.name === EnumMovementTypes.RECOMPRA);
      const reports_by_cac = reports_filtered.find(el => el.movement_type.name === EnumMovementTypes.CASO_AL_CORRIENTE);

      //Generamos las fechas
      const date2 = new Date();
      const date1 = new Date();
      date1.setMonth(date1.getMonth() - 4);

      //Obtenemos el ranking individual entre las fechas creadas, desde 4 meses atras hasta hoy
      const indiv_ranking_filtered = await this.rankingIndividualRepo.findOne({
        where: { partner: partner, createdAt: Between(date1, date2) },
      });

      //Obtenemos las constantes de cálculo y los rankings individuales (que ocupan los primeros 3 registros de la base de datos)
      const constants = await this.rankingIndividualRepo.find();
      const rankings = constants.slice(0, 3);

      //Obtenemos las configuraciones de las comisiones (cantidades míminas, montos de pago, etc)
      const commissions = await this.commissionRepository.find();

      //Filtramos las mismas por tipo
      const consultas_commissions = commissions.find(el => el.commissionName === 'Consultas Totales');
      const coloc_commission1 = commissions.find(el => el.commissionName === 'Colocación Semanal 1');
      const coloc_commission2 = commissions.find(el => el.commissionName === 'Colocación Semanal 2');
      const coloc_commission3 = commissions.find(el => el.commissionName === 'Colocación Semanal 3');
      const coloc_commission4 = commissions.find(el => el.commissionName === 'Colocación Semanal 4');
      const coloc_commission5 = commissions.find(el => el.commissionName === 'Colocación Semanal 5');
      const coloc_commission6 = commissions.find(el => el.commissionName === 'Colocación Semanal 6');
      const recom_commission1 = commissions.find(el => el.commissionName === 'Recompra Digital 1');
      const recom_commission2 = commissions.find(el => el.commissionName === 'Recompra Digital 2');
      const recom_commission3 = commissions.find(el => el.commissionName === 'Recompra Digital 3');
      const caso_al_corr_commission = commissions.find(el => el.commissionName === 'Caso al Corriente');

      const commission = {
        consultas: 0,
        desembolsos_first: 0,
        desembolsos_second: 0,
        recompras: 0,
        casos_al_corriente: 0,
      };

      const user_data = {
        quantity_consultas: 0,
        quantity_desembolsos_first: 0,
        amount_desembolsos_first: 0,
        quantity_desembolsos_second: 0,
        amount_desembolsos_second: 0,
        amount_recompras: 0,
        fee_first_stretch: 0,
        fee_second_stretch: 0,
        fee_consultas: 0,
        fee_recompras: 0,
        minimum_consultas: 0,
      };

      //Validamos si su ranking es asociado
      if (indiv_ranking_filtered.rank === rankings[0].rank) {
        //Si hay un reporte de consultas, y cumple con la condición, realizamos la operación de cálculo
        if (reports_by_consultas && reports_by_consultas.quantity >= consultas_commissions.ruleComputeValue) {
          user_data.minimum_consultas = consultas_commissions.ruleComputeValue;
          user_data.quantity_consultas = reports_by_consultas.quantity;
          user_data.fee_consultas = consultas_commissions.measurment_value;
          commission.consultas = consultas_commissions.measurment_value;
        }
        //Si hay un reporte de desembolsos y cumple con la condición, realizamos la operación de cálculo
        if (reports_by_des && reports_by_des.quantity < coloc_commission1.ruleComputeValue) {
          user_data.amount_desembolsos_first = reports_by_des.amount;
          user_data.quantity_desembolsos_first = reports_by_des.quantity;
          user_data.fee_first_stretch = coloc_commission1.measurment_value;
          commission.desembolsos_first = reports_by_des.amount * (coloc_commission1.measurment_value / 100);
          //Caso contrario, hay un reporte y cumple la condición inversa
        } else if (reports_by_des && reports_by_des.quantity >= coloc_commission2.ruleComputeValue) {
          user_data.amount_desembolsos_second = reports_by_des.amount;
          user_data.quantity_desembolsos_second = reports_by_des.quantity;
          user_data.fee_second_stretch = coloc_commission2.measurment_value;
          commission.desembolsos_second = reports_by_des.amount * (coloc_commission2.measurment_value / 100);
        }
        //Si hay un reporte de recompras
        if (reports_by_rec) {
          user_data.amount_recompras = reports_by_rec.amount;
          user_data.fee_recompras = recom_commission1.measurment_value;
          commission.recompras = reports_by_rec.amount * (recom_commission1.measurment_value / 100);
        }
        //Si hay un reporte de caso al corriente
        if (reports_by_cac) {
          commission.casos_al_corriente = caso_al_corr_commission.ruleComputeValue * reports_by_cac.quantity;
        }
      }

      //Validamos si su ranking es plata
      if (indiv_ranking_filtered.rank === rankings[1].rank) {
        //Tiene reportes tipo consultas y la cantidad es menor o igual a la regla
        if (reports_by_consultas && reports_by_consultas.quantity >= consultas_commissions.ruleComputeValue) {
          user_data.minimum_consultas = consultas_commissions.ruleComputeValue;
          user_data.quantity_consultas = reports_by_consultas.quantity;
          user_data.fee_consultas = consultas_commissions.measurment_value;
          commission.consultas = consultas_commissions.measurment_value;
        }
        //Si existen reportes de desembolsos y la cantidad es menor a la regla
        if (reports_by_des && reports_by_des.quantity < coloc_commission3.ruleComputeValue) {
          user_data.amount_desembolsos_first = reports_by_des.amount;
          user_data.quantity_desembolsos_first = reports_by_des.quantity;
          user_data.fee_first_stretch = coloc_commission3.measurment_value;
          commission.desembolsos_first = reports_by_des.amount * (coloc_commission3.measurment_value / 100);
          //Si la cantidad es mayor a la regla
        } else if (reports_by_des && reports_by_des.quantity >= coloc_commission4.ruleComputeValue) {
          user_data.amount_desembolsos_second = reports_by_des.amount;
          user_data.quantity_desembolsos_second = reports_by_des.quantity;
          user_data.fee_second_stretch = coloc_commission4.measurment_value;
          commission.desembolsos_second = reports_by_des.amount * (coloc_commission4.measurment_value / 100);
        }
        //Si existen reportes de recompras
        if (reports_by_rec) {
          user_data.amount_recompras = reports_by_rec.amount;
          user_data.fee_recompras = recom_commission2.measurment_value;
          commission.recompras = reports_by_rec.amount * (recom_commission2.measurment_value / 100);
        }
        //Si existen reportes de casos al corriente
        if (reports_by_cac) {
          commission.casos_al_corriente = caso_al_corr_commission.ruleComputeValue * reports_by_cac.quantity;
        }
      }

      //Validamos si su ranking es oro
      if (indiv_ranking_filtered.rank === rankings[2].rank) {
        //Si existen reportes de consultas y su cantidad es mayor a la regla
        if (reports_by_consultas && reports_by_consultas.quantity >= consultas_commissions.ruleComputeValue) {
          user_data.minimum_consultas = consultas_commissions.ruleComputeValue;
          user_data.quantity_consultas = reports_by_consultas.quantity;
          user_data.fee_consultas = consultas_commissions.measurment_value;
          commission.consultas = consultas_commissions.measurment_value;
        }
        //Si existen reportes de desembolsos y su cantidad es menor a la regla
        if (reports_by_des && reports_by_des.quantity < coloc_commission5.ruleComputeValue) {
          user_data.amount_desembolsos_first = reports_by_des.amount;
          user_data.quantity_desembolsos_first = reports_by_des.quantity;
          user_data.fee_first_stretch = coloc_commission5.measurment_value;
          commission.desembolsos_first = reports_by_des.amount * (coloc_commission5.measurment_value / 100);
          //Si la cantidad es mayor a la regla
        } else if (reports_by_des && reports_by_des.quantity >= coloc_commission6.ruleComputeValue) {
          user_data.amount_desembolsos_second = reports_by_des.amount;
          user_data.quantity_desembolsos_second = reports_by_des.quantity;
          user_data.fee_second_stretch = coloc_commission6.measurment_value;
          commission.desembolsos_second = reports_by_des.amount * (coloc_commission6.measurment_value / 100);
        }
        //Si existen reportes de recompras
        if (reports_by_rec) {
          user_data.amount_recompras = reports_by_rec.amount;
          user_data.fee_recompras = recom_commission3.measurment_value;
          commission.recompras = reports_by_rec.amount * (recom_commission3.measurment_value / 100);
        }
        if (reports_by_cac && reports_by_cac) {
          commission.casos_al_corriente = caso_al_corr_commission.ruleComputeValue * reports_by_cac.quantity;
        }
      }

      //Creación y guardado de comisiones individuales.
      const commission_created = this.individualCommissionsRepo.create({
        amount_desembolsos_first: user_data.amount_desembolsos_first,
        quantity_desembolsos_first: user_data.quantity_desembolsos_first,
        commission_desembolsos_first: commission.desembolsos_first,
        amount_desembolsos_second: user_data.amount_desembolsos_second,
        quantity_desembolsos_second: user_data.quantity_desembolsos_second,
        commission_desembolsos_second: commission.desembolsos_second,
        quantity_consultas: user_data.quantity_consultas,
        commission_consultas: commission.consultas,
        amount_recompras: user_data.amount_recompras,
        commission_recompras: commission.recompras,
        commission_casos_al_corriente: commission.casos_al_corriente,
        fee_first_stretch: user_data.fee_first_stretch,
        fee_second_stretch: user_data.fee_second_stretch,
        fee_consultas: user_data.fee_consultas,
        fee_recompras: user_data.fee_recompras,
        week: week,
        partner: partner,
        minimum_consultas: user_data.minimum_consultas,
      });
      await this.individualCommissionsRepo.save(commission_created);
    }
  }

  //Generate monthly bonus
  async generateMonthlyBonus(id: number) {
    //Genera bono mensual en base a los reportes del mes, no usa el nivel del partner
    const currentDate = new Date();
    const lastDate = new Date(currentDate);
    lastDate.setMonth(lastDate.getMonth() - 1);
    const month = lastDate.getMonth();
    const reports = await this.reportsRepository.find({ where: { partner: id }, relations: ['movement_type'] });
    const reports_filtered = reports.filter(el => el.createdAt.getMonth() === month);
    const reports_by_type = reports_filtered.filter(el => el.movement_type.name === EnumMovementTypes.DESEMBOLSO);
    const month_bonus_commission = await this.commissionRepository.findOne({
      where: { commissionName: 'Bono Mensual' },
    });

    const total_quantity_month = reports_by_type.reduce((acc, el) => acc + el.quantity, 0);
    const total_amount_month = reports_by_type.reduce((acc, el) => acc + el.amount, 0);

    const month_commission =
      total_quantity_month >= month_bonus_commission.ruleComputeValue
        ? total_amount_month * (month_bonus_commission.measurment_value / 100)
        : 0;

    const partner = await this.partnerRepository.findOne(id);
    const monthly_bonus = this.monthlyBonusRepository.create({
      commission: month_commission,
      month: month,
      partner: partner,
      quantity: total_quantity_month,
      total_amount: total_amount_month,
    });
    await this.monthlyBonusRepository.save(monthly_bonus);
  }

  //Generate leadership commission
  async generateLeadershipComm(id: number) {
    //Fecha actual, semana y 2 meses atrás
    const currentDate = new Date();
    const week = this.getNumberOfWeek();
    const month = currentDate.getMonth() - 2;

    //Obtención del bimestre en base a 2 meses atrás
    const bimester =
      month === 0 || month === 1
        ? EnumPeriodRanking.NOV_DIC
        : month === 2 || month === 3
        ? EnumPeriodRanking.ENE_FEB
        : month === 4 || month === 5
        ? EnumPeriodRanking.MAR_ABR
        : month === 6 || month === 7
        ? EnumPeriodRanking.MAY_JUN
        : month === 8 || month === 9
        ? EnumPeriodRanking.JUL_AGO
        : month === 10 || month === 11
        ? EnumPeriodRanking.SEP_OCT
        : null;

    //Obtengo el ranking del anterior bimestre al actual y el partner correspondiente
    const partnerRanks = await this.rankingLeadershipRepo.findOne({ where: { partner: id, period: bimester } });
    const partner = await this.partnerRepository.findOne({
      where: { id },
    });

    //Si el ranking no existe o existe pero el nivel es NO_RANK, entonces creo comisiones vacías
    if (!partnerRanks || partnerRanks.level === EnumLeaderRank.NO_RANK) {
      const leadership_commission = this.leadershipCommissionRepo.create({
        consultas_commission: 0,
        consultas_quantity: 0,
        credito_1: 0,
        credito_2: 0,
        credito_3: 0,
        week: week,
        partner: partner,
      });
      await this.leadershipCommissionRepo.save(leadership_commission);
      //De lo contrario, si tiene alguno de los 3 niveles de ranking, realizo el cálculo correspondiente
    } else if (
      partnerRanks.level === EnumLeaderRank.FUTURO_LIDER ||
      partnerRanks.level === EnumLeaderRank.LIDER_BRONCE ||
      partnerRanks.level === EnumLeaderRank.LIDER_PLATA
    ) {
      //Obtenemos la configuración y reglamentación de las comisiones liderazgo , que son 4
      const cms_configs = await this.rankingLeadershipCMS.find();
      const commissions_configs = await this.commissionRepository.find();
      const consultas_rule = commissions_configs.find(el => el.commissionName === 'Consultas');
      const desembolsos_rule_1 = commissions_configs.find(el => el.commissionName === 'Pago por Crédito 1');
      const desembolsos_rule_2 = commissions_configs.find(el => el.commissionName === 'Pago por Crédito 2');
      const desembolsos_rule_3 = commissions_configs.find(el => el.commissionName === 'Pago por Crédito 3');

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

      //Generamos la cantidad de consultas de nuestra red
      const consultas_reports = partnerReports.filter(el => el.movement_type.name === EnumMovementTypes.CONSULTAS);
      const consultas_quantity = consultas_reports.reduce((acc, el) => acc + el.quantity, 0);

      //Generamos la cantidad de desembolsos de nuestra red
      const desembolsos_reports = partnerReports.filter(el => el.movement_type.name === EnumMovementTypes.DESEMBOLSO);
      const desembolsos_network = desembolsos_reports.reduce((acc, el) => acc + el.quantity, 0);

      //Creamos un objeto vacío al que lo iremos modificando de acuerdo a los cálculos.
      const network_commissions = {
        consultas_commission: 0,
        consultas_quantity: consultas_quantity,
        credito_1: 0,
        credito_2: 0,
        credito_3: 0,
      };

      //Si es futuro líder
      if (partnerRanks.level == cms_configs[2].level) {
        if (consultas_quantity >= 30) {
          network_commissions.consultas_commission = consultas_rule.measurment_value;
        }
        if (desembolsos_network >= desembolsos_rule_1.ruleComputeValue) {
          network_commissions.credito_1 = desembolsos_rule_1.measurment_value;
        }
      }
      //Si es bronce
      if (partnerRanks.level == cms_configs[1].level) {
        if (consultas_quantity >= 30) {
          network_commissions.consultas_commission = consultas_rule.measurment_value;
        }
        if (desembolsos_network >= desembolsos_rule_2.ruleComputeValue) {
          network_commissions.credito_2 = desembolsos_rule_2.measurment_value;
        }
      }
      //Si es plata
      if (partnerRanks.level == cms_configs[0].level) {
        if (consultas_quantity >= 30) {
          network_commissions.consultas_commission = consultas_rule.measurment_value;
        }
        if (desembolsos_network >= desembolsos_rule_3.ruleComputeValue) {
          network_commissions.credito_3 = desembolsos_rule_3.measurment_value;
        }
      }

      //Creamos el objeto a guardar en la base de datos, y luego lo guardamos
      const leadership_commission = this.leadershipCommissionRepo.create({
        consultas_commission: network_commissions.consultas_commission,
        consultas_quantity: network_commissions.consultas_quantity,
        credito_1: network_commissions.credito_1,
        credito_2: network_commissions.credito_2,
        credito_3: network_commissions.credito_3,
        week: week,
        partner: partner,
      });
      // await this.leadershipCommissionRepo.save(leadership_commission);
    }
  }

  //Generate monthly goal
  async generateMonthlyGoal(id: number) {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const bimester =
      month === 0 || month === 1
        ? EnumPeriodRanking.ENE_FEB
        : month === 2 || month === 3
        ? EnumPeriodRanking.MAR_ABR
        : month === 4 || month === 5
        ? EnumPeriodRanking.MAY_JUN
        : month === 6 || month === 7
        ? EnumPeriodRanking.JUL_AGO
        : month === 8 || month === 9
        ? EnumPeriodRanking.SEP_OCT
        : month === 10 || month === 11
        ? EnumPeriodRanking.NOV_DIC
        : null;

    const partner_rank = await this.rankingLeadershipRepo.find({ where: { partner: id } });

    let previousBimester: number;
    let partner_rank_period: Array<any>;
    switch (previousBimester) {
      case EnumPeriodRanking.ENE_FEB:
        previousBimester = EnumPeriodRanking.NOV_DIC;
      default:
        //TODO: CORREGIR ESTA WEA
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        previousBimester = bimester - 2;
    }

    partner_rank_period = partner_rank.filter(el => el.period === previousBimester);

    const partner = await this.partnerRepository.findOne(id);

    if (partner_rank_period.length === 0) {
      const monthly_goal = {
        meta_2: 0,
        meta_3: 0,
        month: month,
        goal: 0,
        desembolsos_red: 0,
        fee: 0,
        earnings: 0,
        partner: partner,
      };
      await this.monthlyGoalRepository.save(monthly_goal);
    } else {
      //Traemos la red de asociados activos
      const associatedNet = await this.referredRepository.find({ where: { partner: id }, relations: ['referred'] });
      const associatedNetActives = associatedNet.filter(el => el.referred.status === AsociadoStatus.ACTIVE);

      //Guardamos los reportes de los partners de la red de asociados
      let partnerReports = [];
      for (let associated of associatedNetActives) {
        const reports = await this.reportsRepository.find({
          where: { partner: associated.referred.id },
          relations: ['movement_type'],
        });
        reports.forEach(el => partnerReports.push(el));
      }
      const desembolsos_network = partnerReports.reduce((acc, el) => acc + el.quantity, 0);

      const cms_configs = await this.rankingLeadershipCMS.find();
      const commissions_configs = await this.commissionRepository.find();
      const meta_cumplida_2 = commissions_configs.filter(el => el.commissionName === 'Meta Cumplida 2');
      const meta_cumplida_3 = commissions_configs.filter(el => el.commissionName === 'Meta Cumplida 3');

      const monthly_goal = {
        meta_2: 0,
        meta_3: 0,
        month: month,
        goal: 0,
      };

      //Si es plata
      if (partner_rank_period[0].level == cms_configs[0].level) {
        if (desembolsos_network >= meta_cumplida_2[0].ruleComputeValue) {
          monthly_goal.meta_2 = meta_cumplida_2[0].measurment_value;
          monthly_goal.goal = meta_cumplida_2[0].ruleComputeValue;
        }
      }
      if (partner_rank_period[0].level == cms_configs[1].level) {
        if (desembolsos_network >= meta_cumplida_3[0].ruleComputeValue) {
          monthly_goal.meta_2 = meta_cumplida_3[0].measurment_value;
          monthly_goal.goal = meta_cumplida_3[0].ruleComputeValue;
        }
      }

      const monthly_goal_db = this.monthlyGoalRepository.create({
        month: monthly_goal.month,
        goal: monthly_goal.goal,
        desembolsos_red: desembolsos_network,
        fee: meta_cumplida_2[0].measurment_value
          ? meta_cumplida_2[0].measurment_value
          : meta_cumplida_3[0].measurment_value
          ? meta_cumplida_3[0].measurment_value
          : 0,
        meta_2: monthly_goal.meta_2,
        meta_3: monthly_goal.meta_3,
        earnings: monthly_goal.meta_2
          ? meta_cumplida_2[0].measurment_value
          : monthly_goal.meta_3
          ? meta_cumplida_3[0].measurment_value
          : 0,
        partner: partner,
      });

      await this.monthlyGoalRepository.save(monthly_goal_db);
      return {
        message: 'Comisión meta cumplida generada.',
      };
    }
  }

  //Get number of week
  getNumberOfWeek() {
    const currentDate = new Date();
    return DateTime.local(currentDate).weekNumber;
  }

  //Get individual commissions
  async getIndividualCommission(partner: Partner, mes?: number) {
    const currentDate = new Date();
    const month = mes ? mes : currentDate.getMonth();
    const individual_commission = await this.individualCommissionsRepo.find({
      where: { partner: partner },
    });

    const individual_commission_by_month = individual_commission.filter(el => el.createdAt.getMonth() == month);
    const prev_individual_commission_by_month = individual_commission.filter(
      el => el.createdAt.getMonth() == month - 1,
      //TODO: corregir mes anterior
    );

    const long = individual_commission_by_month.length;
    if (!individual_commission_by_month.length) {
      throw new BadRequestException({
        statusCode: 404,
        error: 'Not found',
        message: 'El usuario no posee registros de comisiones para el mes indicado.',
      });
    }

    const individual_earnings = individual_commission_by_month.reduce(
      (acc, el) =>
        acc +
        el.commission_casos_al_corriente +
        el.commission_consultas +
        el.commission_desembolsos_first +
        el.commission_desembolsos_second +
        el.commission_recompras,
      0,
    );
    const monthly_bonus = await this.getMonthlyBonus(partner, mes);
    const individual = {
      date: new Date(),
      desembolsos_first_stretch: {
        total_amount: individual_commission_by_month[0].amount_desembolsos_first,
        total_quantity: individual_commission_by_month[0].quantity_desembolsos_first,
        fee: individual_commission_by_month[0].fee_first_stretch,
        earnings: individual_commission_by_month[0].commission_desembolsos_first,
      },
      desembolsos_second_stretch: {
        total_amount: individual_commission_by_month[0].amount_desembolsos_second,
        total_quantity: individual_commission_by_month[0].quantity_desembolsos_second,
        fee: individual_commission_by_month[0].fee_second_stretch,
        earnings: individual_commission_by_month[0].commission_desembolsos_second,
      },
      consultas: {
        minimum_consultas: individual_commission_by_month[0].minimum_consultas,
        quantity: individual_commission_by_month[0].quantity_consultas,
        fee: individual_commission_by_month[0].fee_consultas,
        earnings: individual_commission_by_month[0].commission_consultas,
      },
      recompras: {
        amount: individual_commission_by_month[0].amount_recompras,
        fee: individual_commission_by_month[0].fee_recompras,
        earnings: individual_commission_by_month[0].commission_recompras,
      },
      monthly_bonus,
      individual_earnings:
        individual_commission_by_month[0].commission_desembolsos_first +
        individual_commission_by_month[0].commission_desembolsos_second +
        individual_commission_by_month[0].commission_consultas +
        individual_commission_by_month[0].commission_recompras,
    };
    return {
      prev: prev_individual_commission_by_month.length
        ? prev_individual_commission_by_month[0].createdAt.getMonth()
        : null,
      date: individual_commission_by_month[long - 1].createdAt,
      individual_earnings,
      individual,
    };
  }

  //Get monthly bonus
  async getMonthlyBonus(partner: Partner, mes?: number) {
    const currentDate = new Date();
    const month = mes ? mes : currentDate.getMonth();

    const month_bonus = await this.monthlyBonusRepository.findOne({ where: { partner: partner, month: month } });

    const constants = await this.commissionRepository.find();
    const desembolsos_rule = constants.filter(el => el.commissionName === 'Bono Mensual');

    if (!month_bonus || !constants) {
      throw new BadRequestException({
        statusCode: 404,
        error: 'Not found',
        message: 'El usuario no posee registros de bonificaciones mensuales.',
      });
    }

    const response = {
      minimum_desembolsos: desembolsos_rule[0].ruleComputeValue,
      quantity: month_bonus.quantity,
      amount: month_bonus.total_amount,
      fee: desembolsos_rule[0].measurment_value,
      earnings: month_bonus.commission,
    };

    return response;
  }

  //Get leadership commission
  async getLeadershipCommission(partner: Partner, mes?: number) {
    const currentDate = new Date();
    const month = mes ? mes : currentDate.getMonth();

    const leadership_commission = await this.leadershipCommissionRepo.find({ where: { partner: partner } });
    const leadership_commission_by_month = leadership_commission.filter(el => el.createdAt.getMonth() == month);
    const monthly_goal = await this.monthlyGoalRepository.find({ where: { partner: partner } });
    const monthly_goal_by_month = monthly_goal.filter(el => el.createdAt.getMonth() == month);

    const response = {
      consultas_network: {
        quantity: leadership_commission_by_month[0].consultas_quantity,
        earnings: leadership_commission_by_month[0].consultas_commission,
      },
      desembolsos_network: {
        monthly_goal: monthly_goal_by_month[0].goal,
        desembolsos_network: monthly_goal_by_month[0].desembolsos_red,
        //TODO:Pantalla 12.1 hay algo raro
        fee_desembolsos: 0,
        earnings: leadership_commission_by_month[0].credito_1
          ? leadership_commission_by_month[0].credito_1
          : leadership_commission_by_month[0].credito_2
          ? leadership_commission_by_month[0].credito_2
          : leadership_commission_by_month[0].credito_3
          ? leadership_commission_by_month[0].credito_3
          : 0,
      },
      bonus_goal: {
        minimum_production: monthly_goal_by_month[0].goal,
        monthly_production: monthly_goal_by_month[0].desembolsos_red,
        fee_bonus_goal: monthly_goal_by_month[0].fee,
        earnings: monthly_goal_by_month[0].earnings,
      },
    };
    return response;
  }

  //Get account state (aquí debería ir toda la respuesta completa)
  async getAccountState(partner: Partner, mes?: number) {
    const individual_commission = await this.getIndividualCommission(partner, mes);
    const leadership_commission = await this.getLeadershipCommission(partner, mes);
    const { prev, date, individual, individual_earnings } = individual_commission;
    const { consultas_network, desembolsos_network, bonus_goal } = leadership_commission;
    const total_earning =
      individual_earnings + consultas_network.earnings + desembolsos_network.earnings + bonus_goal.earnings;

    const response = {
      prev,
      date,
      individual_earning: individual_earnings,
      leadership_earning: consultas_network.earnings + desembolsos_network.earnings + bonus_goal.earnings,
      total_earning,
      individual,
      leadership: {
        consultas_network,
        desembolsos_network,
        bonus_goal,
        leadership_earnings: consultas_network.earnings + desembolsos_network.earnings + bonus_goal.earnings,
      },
    };
    return response;
  }

  async generateLeadershipCommCron() {
    const partners = await this.partnerRepository.find();
    for (const partner of partners) {
      if (partner.status === AsociadoStatus.ACTIVE) {
        await this.generateLeadershipComm(partner.id);
      }
    }
  }

  async generateIndividualCommCron() {
    const partners = await this.partnerRepository.find();
    for (const partner of partners) {
      if (partner.status === AsociadoStatus.ACTIVE) {
        await this.generateIndividualComm(partner.id);
      }
    }
  }

  async generateMonthlyBonusCron() {
    const partners = await this.partnerRepository.find();
    for (const partner of partners) {
      await this.generateMonthlyBonus(partner.id);
    }
  }

  async generateMonthlyGoalCron() {
    const partners = await this.partnerRepository.find();
    for (const partner of partners) {
      await this.generateMonthlyGoal(partner.id);
    }
  }
}
