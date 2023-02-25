import {
	BadGatewayException,
	Injectable,
	NotFoundException,
	NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Clients } from '../clients/entities/client.entity';
import {
	Property,
	PropertyDocument,
} from '../../Properties/properties/schema/property.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PropertyEnumStatus } from '../../../config/enum-types';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(Posts)
		private readonly postsRepository: Repository<Posts>,
		@InjectRepository(Clients)
		private readonly clientsRepository: Repository<Clients>,
		@InjectModel(Property.name)
		private propertiesSchema: Model<PropertyDocument>
	) {}

	async create(body: CreatePostDto, clientId: string) {
		const { propertyId } = body;
		// ------------------------------------------------------------------ Client
		const clientFinded: any = await this.clientsRepository.findOne({
			where: {
				id: clientId,
			},
		});
		if (!clientFinded) {
			throw new NotFoundException('No se encontró el cliente especificado');
		}
		// ------------------------------------------------------------------ Post
		const postFinded: any = await this.postsRepository.findOne({
			where: {
				propertyId: propertyId,
				client: clientFinded,
			},
		});
		if (postFinded) {
			throw new NotImplementedException(
				'Ya existe esta propiedad en su lista de favoritos'
			);
		}
		const postCreated: any = this.postsRepository.create({
			propertyId: propertyId,
			client: clientFinded,
		});
		if (!postCreated) {
			throw new BadGatewayException('Error en la creación del favorito');
		}
		await this.postsRepository.save(postCreated);
		return {
			message: 'Favorito guardado',
		};
	}

	async findAll() {
		try {
			const posts = await this.postsRepository.find();
			if (!posts) {
				throw new NotFoundException('No se ha encontrado ningun favorito');
			}
			let result = posts.map(async (el: any) => {
				let property: any = await this.propertiesSchema.findOne({
					_id: el.propertyId,
				});
				return {
					...el,
					property,
				};
			});
			return Promise.all(result);
		} catch (err) {
			return err;
		}
	}

	async findAllByClientId(clientId: string) {
		// TODO: ordenar por fecha de guardado, por título, y precio
		try {
			const clientFinded: any = await this.clientsRepository.findOne({
				where: {
					id: clientId,
				},
			});
			const posts: any = await this.postsRepository.find({
				where: {
					client: clientFinded,
				},
			});
			if (!posts) {
				throw new NotFoundException(
					'No se ha encontrado el favorito especificado'
				);
			}
			let result = posts.map(async (el: any) => {
				let property: any = await this.propertiesSchema.findOne({
					_id: el.propertyId,
					status: PropertyEnumStatus.published,
				});
				return {
					...el,
					property,
				};
			});
			return Promise.all(result);
		} catch (err) {
			return err;
		}
	}

	async findOne(postId: number) {
		const post = await this.postsRepository.findOne({
			where: {
				id: postId,
			},
		});
		const property = await this.propertiesSchema.findOne({
			_id: post.propertyId,
		});
		if (!post) {
			throw new NotFoundException(
				'No se ha encontrado el favorito especificado'
			);
		}
		return {
			...post,
			property,
		};
	}

	async remove(id: number) {
		const postFinded: any = await this.postsRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!postFinded) {
			throw new NotFoundException('No se ha encontrado el id especificado');
		}
		await this.postsRepository.remove(postFinded);
		return {
			message: 'Favorito eliminado con éxito',
		};
	}
}
