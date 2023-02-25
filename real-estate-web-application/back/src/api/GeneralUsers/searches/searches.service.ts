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

	async findAllByClientId(clientId: string) {
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
					created_at: 'ASC'
				}
			});
			if (!searchesFinded) {
				throw new NotFoundException(
					'No se ha encontrado ninguna busqueda guardada'
				);
			}
			return searchesFinded;
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

	async remove(searchId: number) {
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
			await this.searchesRepository.remove(search);
			return {
				message: 'Busqueda eliminada con éxito',
			};
		} catch (err) {
			return err;
		}
	}
}
