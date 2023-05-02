import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { RealEstate } from './entities/real-estate.entity';
import { Brackets, ILike, Like, Repository } from 'typeorm';
import { FindAllPropertiesDto } from './dto/find-all-properties.dto';
import { BranchOffice } from '../branch-offices/entities/branch-office.entity';

@Injectable()
export class RealEstateService {
	constructor(
		@InjectRepository(RealEstate)
		private readonly realEstateRepository: Repository<RealEstate>,
		@InjectRepository(BranchOffice)
		private readonly branchOfficeRepository: Repository<BranchOffice>
	) {}

	async create(createRealEstateDto: CreateRealEstateDto) {
		try {
			const realEstateCreated =
				this.realEstateRepository.create(createRealEstateDto);
			await this.realEstateRepository.save(realEstateCreated);
			return {
				message: 'Inmobiliaria creada con éxito',
				body: realEstateCreated,
			};
		} catch (err) {
			throw new BadRequestException(
				'Algo ha salido mal, verifique que los datos ingresados para la creación sean correctos'
			);
		}
	}

	async findAll(findAllPropertiesDto: FindAllPropertiesDto) {
		let { field, offset, limit } = findAllPropertiesDto;
		offset ? offset : (offset = 0);
		let skip = limit * offset;
		let queryBuilder = this.realEstateRepository
			.createQueryBuilder('real_estate')
			.leftJoinAndSelect('real_estate.branchOffice', 'branch_office')
			.orderBy('real_estate.name', 'ASC')
			.skip(skip) // con este metodo skip no es necesario hacer el slice en el array abajo
			.take(limit); // el limite siempre debe venir
		if (field) {
			queryBuilder = queryBuilder.where(
				'(branch_office.branch_office_name ILike :searchField OR branch_office.phoneNumber ILike :searchField OR branch_office.address ILike :searchField)',
				{
					searchField: `%${field.trim()}%`,
				}
			);
		}
		const realEstates = await queryBuilder.getMany();

		if (realEstates.length === 0) {
			return {
				message: 'No se encontró ninguna inmobiliaria con el dato ingresado',
				allRealEstateLength: 0,
				result: [],
			};
		}
		// esta parte es para traer los length
		const allRealEstateLength = field
			? await this.realEstateRepository
					.createQueryBuilder('real_estate')
					.leftJoinAndSelect('real_estate.branchOffice', 'branch_office')
					.where(
						'(branch_office.branch_office_name ILike :searchField OR branch_office.phoneNumber ILike :searchField OR branch_office.address ILike :searchField)',
						{
							searchField: `%${field.trim()}%`,
						}
					)
					.getCount()
			: await this.realEstateRepository.count();
		return {
			allRealEstateLength,
			result: realEstates,
		};
	}

	async findOne(id: number) {
		const realEstate = await this.realEstateRepository.findOne({
			relations: ['branchOffice'],
			where: {
				id: id,
			},
		});
		if (!realEstate) {
			throw new NotFoundException(
				'No se encontró la inmobiliaria especificada'
			);
		}
		return realEstate;
	}
}
