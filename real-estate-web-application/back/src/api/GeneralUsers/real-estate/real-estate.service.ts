import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { RealEstate } from './entities/real-estate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RealEstateService {
	constructor(
		@InjectRepository(RealEstate)
		private readonly realEstateRepository: Repository<RealEstate>
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

	async findAll() {
		const realEstates = await this.realEstateRepository.find({
			relations: ['branchOffice'],
		});
		if (!realEstates) {
			throw new NotFoundException('No se encontró ninguna inmobiliaria');
		}
		return realEstates;
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
