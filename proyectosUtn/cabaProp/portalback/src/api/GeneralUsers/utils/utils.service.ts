import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmbienceTypes } from './entities/ambience-types.entity';
import { AntiquityTypes } from './entities/antiquity-types.entity';
import { CurrencyTypes } from './entities/currency-types.entity';
import { GralCharacteristics } from './entities/gral-characteristics.entity';
import { OperationTypes } from './entities/operation-types.entity';
import { PropertyTypes } from './entities/property-types.entity';

@Injectable()
export class UtilsService {
	constructor(
		@InjectRepository(GralCharacteristics)
		private readonly gralCharacteristicsRepository: Repository<GralCharacteristics>,
		@InjectRepository(AmbienceTypes)
		private readonly ambienceTypesRepository: Repository<AmbienceTypes>,
		@InjectRepository(AntiquityTypes)
		private readonly antiquityTypesRepository: Repository<AntiquityTypes>,
		@InjectRepository(CurrencyTypes)
		private readonly currencyTypesRepository: Repository<CurrencyTypes>,
		@InjectRepository(OperationTypes)
		private readonly operationTypesRepository: Repository<OperationTypes>,
		@InjectRepository(PropertyTypes)
		private readonly propertyTypesRepository: Repository<PropertyTypes>
	) {}
	// Characteristics ----------------------------------------------------------------------
	async findAllCharacteristics() {
		const characteristics = await this.gralCharacteristicsRepository.find();
		if (!characteristics) {
			throw new NotFoundException('No se encontraron caracteristicas');
		}
		return characteristics;
	}

	async findOneCharacteristic(id: number) {
		return `This action returns a #${id} util`;
	}

	// Ambiences ----------------------------------------------------------------------
	async findAllAmbiences() {
		const ambiences = await this.ambienceTypesRepository.find();
		if (!ambiences) {
			throw new NotFoundException('No se encontraron ambientes');
		}
		return ambiences;
	}

	async findOneAmbience(id: number) {
		return `This action returns a #${id} util`;
	}
	// Antiquities ----------------------------------------------------------------------
	async findAllAntiquities() {
		const antiquities = await this.antiquityTypesRepository.find();
		if (!antiquities) {
			throw new NotFoundException('No se encontraron antiguedades');
		}
		return antiquities;
	}

	async findOneAntiquity(id: number) {
		return `This action returns a #${id} util`;
	}
	// Currencies ----------------------------------------------------------------------
	async findAllCurrencies() {
		const currencies = await this.currencyTypesRepository.find();
		if (!currencies) {
			throw new NotFoundException('No se encontraron los tipos de monedas');
		}
		return currencies;
	}

	async findOneCurrency(id: number) {
		return `This action returns a #${id} util`;
	}

	// Operations ----------------------------------------------------------------------
	async findAllOperations() {
		const operations = await this.operationTypesRepository.find();
		if (!operations) {
			throw new NotFoundException('No se encontraron los tipos de operaciones');
		}
		return operations;
	}

	async findOneOperation(id: number) {
		return `This action returns a #${id} util`;
	}
	// Properties ----------------------------------------------------------------------
	async findAllProperties() {
		const properties = await this.propertyTypesRepository.find();
		if (!properties) {
			throw new NotFoundException('No se encontraron los tipos de propiedades');
		}
		return properties;
	}

	async findOneProperty(id: number) {
		return `This action returns a #${id} util`;
	}
}
