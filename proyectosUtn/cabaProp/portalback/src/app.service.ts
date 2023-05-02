import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from './api/GeneralUsers/permissions/entities/permission.entity';
import { Repository } from 'typeorm';
import { PermissionsMockUp } from './seeder/mockUpData/permissions.mockUp';
import { AmbienceTypes } from './api/GeneralUsers/utils/entities/ambience-types.entity';
import { ambienceTypesMockUp } from './seeder/mockUpData/ambienceTypes.mockUp';
import { GralCharacteristics } from './api/GeneralUsers/utils/entities/gral-characteristics.entity';
import { PropertyTypes } from './api/GeneralUsers/utils/entities/property-types.entity';
import { propertyTypesMockup } from './seeder/mockUpData/propertyTypes.mockUp';
import { gralCharacteristicsMockUp } from './seeder/mockUpData/gralCharacteristics.Mockup';
import { OperationTypes } from './api/GeneralUsers/utils/entities/operation-types.entity';
import { CurrencyTypes } from './api/GeneralUsers/utils/entities/currency-types.entity';
import { AntiquityTypes } from './api/GeneralUsers/utils/entities/antiquity-types.entity';
import { antiquityTypesMockUp } from './seeder/mockUpData/antiquityTypes.mockUp';
import { currencyTypesMockUp } from './seeder/mockUpData/currencyTypes.mockUp';
import { operationTypesMockUp } from './seeder/mockUpData/operationTypes.mockUp';
import { BranchOffice } from './api/GeneralUsers/branch-offices/entities/branch-office.entity';
import { RealEstate } from './api/GeneralUsers/real-estate/entities/real-estate.entity';
import { Users } from './api/GeneralUsers/users/entities/user.entity';
import { adminUserMockUp } from './seeder/mockUpData/adminUser.mockUp';
import { Clients } from './api/GeneralUsers/clients/entities/client.entity';
import { clientUserMockUp } from './seeder/mockUpData/clientUser.mockUp';
import { Roles } from './api/GeneralUsers/roles/entities/role.entity';
import { RoleToPermission } from './api/GeneralUsers/roles/entities/role_permission.entity';
import { roleMockUp } from './seeder/mockUpData/role.mockUp';
import { InjectModel } from '@nestjs/mongoose';
import {
	Property,
	PropertyDocument,
} from './api/Properties/properties/schema/property.schema';
import { Model } from 'mongoose';
import { DatabaseService } from './config/logicExecuters/clear-db.service';
import { MailerService } from '@nestjs-modules/mailer';
import { MockUpService } from './seeder/mock-up.service';
import Axios from 'axios';

@Injectable()
export class AppService {
	constructor(
		@InjectModel(Property.name) private propertySchema: Model<PropertyDocument>,
		@InjectRepository(Permissions)
		private readonly permissionsRepository: Repository<Permissions>,
		@InjectRepository(AmbienceTypes)
		private readonly ambienceTypesRepository: Repository<AmbienceTypes>,
		@InjectRepository(AntiquityTypes)
		private readonly antiquityTypesRepository: Repository<AntiquityTypes>,
		@InjectRepository(GralCharacteristics)
		private readonly gralCharacteristicsRepository: Repository<GralCharacteristics>,
		@InjectRepository(PropertyTypes)
		private readonly propertyTypesRepository: Repository<PropertyTypes>,
		@InjectRepository(OperationTypes)
		private readonly operationTypesRepository: Repository<OperationTypes>,
		@InjectRepository(CurrencyTypes)
		private readonly currencyTypesRepository: Repository<CurrencyTypes>,
		@InjectRepository(BranchOffice)
		private readonly branchOfficeRepository: Repository<BranchOffice>,
		@InjectRepository(RealEstate)
		private readonly realEstateRepository: Repository<RealEstate>,
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>,
		@InjectRepository(Clients)
		private readonly clientsRepository: Repository<Clients>,
		@InjectRepository(Roles)
		private readonly rolesRepository: Repository<Roles>,
		@InjectRepository(RoleToPermission)
		private readonly roleToPermissionRepository: Repository<RoleToPermission>,
		private databaseService: DatabaseService,
		private mailerService: MailerService,
		private mockUpService: MockUpService
	) {}

	async getHello() {
		return 'Hello World!';
	}

	async executeMockUps() {
		// Creating---------------------------------------------------------------------------------------------
		try {
			await this.databaseService.clearDB();
			await this.mockUpService.mockUpExecuter(
				this.permissionsRepository,
				PermissionsMockUp
			);
			await this.mockUpService.mockUpAdminUserExecuter(
				this.usersRepository,
				adminUserMockUp,
				this.realEstateRepository,
				this.branchOfficeRepository
			);
			await this.mockUpService.mockUpExecuter(
				this.ambienceTypesRepository,
				ambienceTypesMockUp
			);
			await this.mockUpService.mockUpExecuter(
				this.propertyTypesRepository,
				propertyTypesMockup
			);
			await this.mockUpService.mockUpExecuter(
				this.gralCharacteristicsRepository,
				gralCharacteristicsMockUp
			);
			await this.mockUpService.mockUpExecuter(
				this.antiquityTypesRepository,
				antiquityTypesMockUp
			);
			await this.mockUpService.mockUpExecuter(
				this.currencyTypesRepository,
				currencyTypesMockUp
			);
			await this.mockUpService.mockUpExecuter(
				this.operationTypesRepository,
				operationTypesMockUp
			);
			await this.mockUpService.mockUpClientUserExecuter(
				this.clientsRepository,
				clientUserMockUp
			);
			await this.mockUpService.mockUpRoleExecuter(
				this.rolesRepository,
				roleMockUp,
				this.realEstateRepository,
				this.permissionsRepository,
				this.roleToPermissionRepository
			);
			await this.mockUpService.mockUpPropertiesExecuter(this.propertySchema);
			return {
				message: 'Mockups created successfully',
			};
		} catch (err) {
			return {
				message: `Cant'a create Mockups`,
				err,
			};
		}
	}

	async sendTestMail(user: any, token: any) {
		try {
			const url = `${process.env.FRONT_URL}/validar-token/${token}`;
			const result = await this.mailerService.sendMail({
				to: user.email,
				subject: 'Testing email Service',
				template: './confirmations',
				context: {
					firstName: user.firstName,
					url,
				},
			});
			return result;
		} catch (err) {
			return err;
		}
	}

	async getServerVersion(version: string) {
		// const version = JSON.parse(file).version;
		// return {
		// 	version
		// };
		return {
			version,
		};
	}
}
