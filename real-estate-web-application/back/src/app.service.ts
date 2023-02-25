import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from './api/GeneralUsers/permissions/entities/permission.entity';
import { Repository } from 'typeorm';
import { mockUpExecuter } from './mockUps/mockUpExecuter/mockUp.executer';
import { PermissionsMockUp } from './mockUps/mockUpData/permissions.mockUp';
import { AmbienceTypes } from './api/GeneralUsers/utils/entities/ambience-types.entity';
import { ambienceTypesMockUp } from './mockUps/mockUpData/ambienceTypes.mockUp';
import { GralCharacteristics } from './api/GeneralUsers/utils/entities/gral-characteristics.entity';
import { PropertyTypes } from './api/GeneralUsers/utils/entities/property-types.entity';
import { propertyTypesMockup } from './mockUps/mockUpData/propertyTypes.mockUp';
import { gralCharacteristicsMockUp } from './mockUps/mockUpData/gralCharacteristics.Mockup';
import { OperationTypes } from './api/GeneralUsers/utils/entities/operation-types.entity';
import { CurrencyTypes } from './api/GeneralUsers/utils/entities/currency-types.entity';
import { AntiquityTypes } from './api/GeneralUsers/utils/entities/antiquity-types.entity';
import { antiquityTypesMockUp } from './mockUps/mockUpData/antiquityTypes.mockUp';
import { currencyTypesMockUp } from './mockUps/mockUpData/currencyTypes.mockUp';
import { operationTypesMockUp } from './mockUps/mockUpData/operationTypes.mockUp';
import { BranchOffice } from './api/GeneralUsers/branch-offices/entities/branch-office.entity';
import { RealEstate } from './api/GeneralUsers/real-estate/entities/real-estate.entity';
import { RealEstatesMockUp } from './mockUps/mockUpData/realEstate.mockUp';
import { BranchOfficesMockUp } from './mockUps/mockUpData/branchOffices.mockUp';
import { mockUpExecuterBranchOffice } from './mockUps/mockUpExecuter/mockUp-branchOffice.executer';
import { Users } from './api/GeneralUsers/users/entities/user.entity';
import { adminUserMockUp } from './mockUps/mockUpData/adminUser.mockUp';
import { Clients } from './api/GeneralUsers/clients/entities/client.entity';
import { clientUserMockUp } from './mockUps/mockUpData/clientUser.mockUp';
import { mockUpAdminUserExecuter } from './mockUps/mockUpExecuter/mockUp-adminUser.executer';
import { mockUpClientUserExecuter } from './mockUps/mockUpExecuter/mockUp-clientUser.executer';
import { mockUpRoleExecuter } from './mockUps/mockUpExecuter/mockUp-role.executer';
import { Roles } from './api/GeneralUsers/roles/entities/role.entity';
import { RoleToPermission } from './api/GeneralUsers/roles/entities/role_permission.entity';
import { roleMockUp } from './mockUps/mockUpData/role.mockUp';
import { InjectModel } from '@nestjs/mongoose';
import {
	Property,
	PropertyDocument,
} from './api/Properties/properties/schema/property.schema';
import { Model } from 'mongoose';
import { mockUpPropertiesExecuter } from './mockUps/mockUpExecuter/mockUp.properties.executer';
import { PropertiesMockUp } from './mockUps/mockUpData/properties.mockUp';

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
		private readonly roleToPermissionRepository: Repository<RoleToPermission>
	) {}
	getHello(): string {
		return 'Hello World!';
	}

	async executeMockUps() {
		// Creating---------------------------------------------------------------------------------------------
		try {
			await mockUpExecuter(this.permissionsRepository, PermissionsMockUp);
			await mockUpExecuter(this.realEstateRepository, RealEstatesMockUp);
			await mockUpExecuterBranchOffice(
				this.branchOfficeRepository,
				BranchOfficesMockUp,
				this.realEstateRepository
			);
			await mockUpExecuter(this.ambienceTypesRepository, ambienceTypesMockUp);
			await mockUpExecuter(this.propertyTypesRepository, propertyTypesMockup);
			await mockUpExecuter(
				this.gralCharacteristicsRepository,
				gralCharacteristicsMockUp
			);
			await mockUpExecuter(this.antiquityTypesRepository, antiquityTypesMockUp);
			await mockUpExecuter(this.currencyTypesRepository, currencyTypesMockUp);
			await mockUpExecuter(this.operationTypesRepository, operationTypesMockUp);
			await mockUpAdminUserExecuter(
				this.usersRepository,
				adminUserMockUp,
				this.realEstateRepository
			);
			await mockUpClientUserExecuter(this.clientsRepository, clientUserMockUp);
			await mockUpRoleExecuter(
				this.rolesRepository,
				roleMockUp,
				this.realEstateRepository,
				this.permissionsRepository,
				this.roleToPermissionRepository
			);
			await mockUpPropertiesExecuter(this.propertySchema, PropertiesMockUp);
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
}
