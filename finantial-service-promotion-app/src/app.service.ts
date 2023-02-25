import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import config from './config';
import { Commission } from './common/database_entities/commission.entity';
import { Repository } from 'typeorm';

// import mockups executer
import { mockUpExecuter } from './mockUps/mockUpExecuter/mockUp.executer';
// import Mocks
import { commissionMockUps } from './mockUps/mockupsData/commissions.mockUp';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExceptionResponseError } from './config/exceptions/dto/exceptions.response.errors';
import { Concept } from './common/database_entities/concept.entity';
import { Level } from './common/database_entities/level.entity';
import { MeasurementUnit } from './common/database_entities/measurment_unit.entity';
import { MovementTypes } from './common/database_entities/movement_types.entity';
import { PaymentChronology } from './common/database_entities/payment_chronology.entity';
import { RankingIndividual } from './common/database_entities/rankingIndividual.entity';
import { RankingLeadership } from './common/database_entities/rankingLeadership.entity';
import { Roles } from './common/database_entities/roles.entity';
import { SequentialEntity } from './common/database_entities/sequential.entity';
import { Territory } from './common/database_entities/territories.entity';
import { CommissionType } from './common/database_entities/commission_type.entity';
import { User } from './api/users/entities/user.entity';
import { conceptsMockUp } from './mockUps/mockupsData/concepts.mockUp';
import { levelMockUp } from './mockUps/mockupsData/level.mockUp';
import { measurmentUnitMockUp } from './mockUps/mockupsData/measurmentUnits.mockUp';
import { movementeTypesMockUp } from './mockUps/mockupsData/movementTypes.mockUp';
import { paymentChronologyMockUp } from './mockUps/mockupsData/paymentChronology.mockUp';
import { rankingIndividualCmsMockUp } from './mockUps/mockupsData/rankingIndividual-cms.mockUp';
import { rankingLeadershipCmsMockUp } from './mockUps/mockupsData/rankingLeaderchip-cms.mockUp';
import { rolesMockUp } from './mockUps/mockupsData/roles.mockUp';
import { sequentialMockUp } from './mockUps/mockupsData/sequential.mockUp';
import { territoriesMockUp } from './mockUps/mockupsData/territories.mockUp';
import { typeCommissionsMockUp } from './mockUps/mockupsData/typeCommissions.mockUp';
import { usersMockUp } from './mockUps/mockupsData/users.mockUp';

@ApiTags('App Server')
@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(Commission) private readonly commissionRepository: Repository<Commission>,
    @InjectRepository(Concept) private readonly conceptRepository: Repository<Concept>,
    @InjectRepository(Level) private readonly levelRepository: Repository<Level>,
    @InjectRepository(MeasurementUnit) private readonly measurementUnitRepository: Repository<MeasurementUnit>,
    @InjectRepository(MovementTypes) private readonly movementTypesRepository: Repository<MovementTypes>,
    @InjectRepository(PaymentChronology) private readonly paymentChronologyRepository: Repository<PaymentChronology>,
    @InjectRepository(RankingIndividual) private readonly rankingIndividualRepository: Repository<RankingIndividual>,
    @InjectRepository(RankingLeadership) private readonly rankingLeadershipRepository: Repository<RankingLeadership>,
    @InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(SequentialEntity) private readonly sequentialEntityRepository: Repository<SequentialEntity>,
    @InjectRepository(Territory) private readonly territoryRepository: Repository<Territory>,
    @InjectRepository(CommissionType) private readonly commissionTypeRepository: Repository<CommissionType>,
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
  ) {}
  getHello(): string {
    const apiKey = this.configService.apiKey;
    const name = this.configService.database.name;
    return `Hello World! ${apiKey} ${name}`;
  }

  @ApiOperation({
    summary: 'Generates registers with Mockups',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success Response',
  })
  @ApiResponse({ type: ExceptionResponseError, description: 'Most of the errors have the following structure.' })
  async executeMockUps() {
    // Creating---------------------------------------------------------------------------------------------
    try {
      await mockUpExecuter(this.commissionRepository, commissionMockUps);
      await mockUpExecuter(this.conceptRepository, conceptsMockUp);
      await mockUpExecuter(this.levelRepository, levelMockUp);
      await mockUpExecuter(this.measurementUnitRepository, measurmentUnitMockUp);
      await mockUpExecuter(this.movementTypesRepository, movementeTypesMockUp);
      await mockUpExecuter(this.paymentChronologyRepository, paymentChronologyMockUp);
      await mockUpExecuter(this.rankingIndividualRepository, rankingIndividualCmsMockUp);
      await mockUpExecuter(this.rankingLeadershipRepository, rankingLeadershipCmsMockUp);
      await mockUpExecuter(this.rolesRepository, rolesMockUp);
      await mockUpExecuter(this.sequentialEntityRepository, sequentialMockUp);
      await mockUpExecuter(this.territoryRepository, territoriesMockUp);
      await mockUpExecuter(this.commissionTypeRepository, typeCommissionsMockUp);
      await mockUpExecuter(this.UserRepository, usersMockUp);
      return {
        message: 'Mockups created successfully'
      }
    } catch (err) {
      return {
        message: `Cant'a create Mockups`,
        err,
      };
    }
    // await mockUpExecuter(this.UserRepository, usersMockUp);
  }
}
