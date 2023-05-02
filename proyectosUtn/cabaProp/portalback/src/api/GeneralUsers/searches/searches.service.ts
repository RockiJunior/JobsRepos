import {
	Injectable,
	NotImplementedException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSearchDto } from './dto/create-search.dto';
import { Searches } from './entities/search.entity';
import { Repository } from 'typeorm';
import { Clients } from '../clients/entities/client.entity';
import { UpdateSearchDto } from './dto/update-search.dto';
import { AlertEnumTypes } from '../../../config/enum-types';
import { SearchesPaginationDto } from './dto/searches-pagination.dto';
import { DeleteSearchDto } from './dto/delete-search.dto';

@Injectable()
export class SearchesService {
	constructor(
		@InjectRepository(Searches)
		private readonly searchesRepository: Repository<Searches>,
		@InjectRepository(Clients)
		private readonly clientsRepository: Repository<Clients>
	) {}

	async create(clientId: string, createSearchDto: CreateSearchDto) {
		let { name, path, tags } = createSearchDto;

		const clientFinded = await this.clientsRepository.findOne({
			where: {
				id: clientId,
			},
		});
		if (!clientFinded) {
			throw new NotFoundException(
				'No se ha encontrado el cliente especificado'
			);
		}
		const searchFinded = await this.searchesRepository.findOne({
			where: {
				name: name,
			},
		});
		if (searchFinded) {
			throw new NotImplementedException(
				'Ya existe una busqueda guardada con el mismo nombre, por favor cambialo e intenta nuevamente sin repetirlo'
			);
		}

		const searchCreated: any = this.searchesRepository.create({
			name: name,
			path: path,
			client: clientFinded,
			tags: tags,
		});
		if (!searchCreated) {
			throw new NotImplementedException(
				'Ha ocurrido un error, no se ha guardado la busqueda'
			);
		}
		await this.searchesRepository.save(searchCreated);
		return {
			message: 'Busqueda guardada con éxito',
		};
	}

	async findAllByClientId(clientId: string, pagination: SearchesPaginationDto) {
		let { offset, limit } = pagination;
		if (!offset) {
			offset = 0;
		}
		let skip = limit * offset;
		try {
			const clientFinded: any = await this.clientsRepository.findOne({
				where: {
					id: clientId,
				},
			});
			if (!clientFinded) {
				throw new NotFoundException(
					'No se ha encontrado el cliente especificado'
				);
			}
			const searchesFinded = await this.searchesRepository.find({
				where: {
					client: clientFinded,
				},
				order: {
					created_at: 'ASC',
				},
			});
			return {
				allSearchesLength: searchesFinded.length || 0,
				result: searchesFinded.length
					? searchesFinded.slice(skip, skip + limit)
					: [],
			};
		} catch (err) {
			return err;
		}
	}

	async findBySearchId(searchId: number) {
		try {
			const search = await this.searchesRepository.findOne({
				where: {
					id: searchId,
				},
			});
			if (!search) {
				throw new NotFoundException(
					'No se ha encontrado la busqueda expecificada'
				);
			}
			return search;
		} catch (err) {
			return err;
		}
	}

	async updateSearchName(searchId: number, updateSearchDto: UpdateSearchDto) {
		try {
			const { name } = updateSearchDto;
			const searchFinded = await this.searchesRepository.findOne({
				where: {
					id: searchId,
				},
			});
			if (!searchFinded) {
				throw new NotFoundException(
					'No se ha encontrado la busqueda expecificada'
				);
			}
			await this.searchesRepository.update(searchFinded.id, {
				name: name,
				updated_at: new Date(),
			});
			return {
				message: 'La busqueda guardada se ha actualizado con éxito',
			};
		} catch (err) {
			return err;
		}
	}

	// async updateAlert(searchId: number, alert: AlertEnumTypes) {
	// 	console.log(searchId, alert);
	// }

	async remove(clientId: string, deleteSearchDto: DeleteSearchDto) {
		const { name } = deleteSearchDto;
		try {
			const clientFinded: any = await this.clientsRepository.findOne({
				where: {
					id: clientId,
				},
			});
			const search = await this.searchesRepository.findOne({
				where: {
					client: clientFinded,
					name: name,
				},
			});
			if (!search) {
				throw new NotFoundException(
					'No se ha encontrado la busqueda expecificada'
				);
			}
			await this.searchesRepository.remove(search);
			return {
				message: 'Busqueda eliminada con éxito',
			};
		} catch (err) {
			return err;
		}
	}
}
