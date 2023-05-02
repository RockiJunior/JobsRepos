// Libraries
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Databases, Controllers, Services & Dtos
import { CreateBranchOfficeDto } from './dto/create-branch-office.dto';
import { BranchOffice } from './entities/branch-office.entity';
import { RealEstate } from '../real-estate/entities/real-estate.entity';

@Injectable()
export class BranchOfficesService {
	constructor(
		@InjectRepository(BranchOffice)
		private readonly branchOfficeRepository: Repository<BranchOffice>,
		@InjectRepository(RealEstate)
		private readonly realEstateRepository: Repository<RealEstate>
	) {}

	async create(createBranchOfficeDto: CreateBranchOfficeDto) {
		const { branchOfficeName, realEstateId } = createBranchOfficeDto;

		const findRealEstate = await this.realEstateRepository.findOne({
			where: {
				id: realEstateId,
			},
		});

		if (!findRealEstate) {
			throw new NotFoundException(
				'No se encontro la inmobiliaria especificada'
			);
		}
		const branchOfficeCreated = this.branchOfficeRepository.create({
			branch_office_name: branchOfficeName,
			realEstate: findRealEstate,
		});
		await this.branchOfficeRepository.save(branchOfficeCreated);
		return {
			message: 'Sucursal creada con éxito',
		};
	}

	async findAll() {
		const branchOffices = await this.branchOfficeRepository.find({
			relations: ['realEstate'],
		});
		if (!branchOffices) {
			throw new NotFoundException('No se encontró ninguna sucursal');
		}
		return branchOffices;
	}

	async findOne(id: number) {
		const branchOffice = await this.branchOfficeRepository.findOne({
			relations: ['realEstate'],
			where: {
				id: id,
			},
		});
		if (!branchOffice) {
			throw new NotFoundException('No se encontró la sucursal especificada');
		}
		return branchOffice;
	}
}
