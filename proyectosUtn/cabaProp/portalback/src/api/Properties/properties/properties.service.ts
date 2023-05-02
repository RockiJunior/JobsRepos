import {
	BadRequestException,
	Injectable,
	NotFoundException,
	NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Axios from 'axios';
import * as fs from 'fs';
import fsExtra from 'fs-extra';
import { Model } from 'mongoose';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { PropertyEnumStatus } from '../../../config/enum-types';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PropertyPublishedStatusDto } from './dto/property-published-status.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UploadMultimediaDto } from './dto/upload-multimedia.dto';
import { UploadCharacteristicsDto } from './dto/uploadCharacteristics.dto';
import { Property, PropertyDocument } from './schema/property.schema';

import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
	FindOptionsSort,
	FindOptionsSortAdmin,
	OperationTypesEnum,
	PropertyTypesEnum,
	SurfaceEnumType,
	TypeOfUser,
} from '../../../config/enum-types';
import { GoogleMapsService } from '../../../google-maps/google-maps.service';
import { BranchOffice } from '../../GeneralUsers/branch-offices/entities/branch-office.entity';
import { RealEstate } from '../../GeneralUsers/real-estate/entities/real-estate.entity';
import { Users } from '../../GeneralUsers/users/entities/user.entity';
import { FindPropertiesAdmin } from './dto/find-properties-admin.dto';
import { PaginationQueryBranchOfficeDto } from './dto/pagination-query-branchOffice.dto';
import { UploadCsvDto } from './dto/upload-csv.dto';
import { Statistics } from '../statistics/schema/statistics.schema';
import { StatisticsDocument } from '../statistics/schema/statistics.schema';
import * as geoip from 'geoip-lite';
import { Conversation } from 'src/api/GeneralUsers/conversations/entities/conversation.entity';
import { Posts } from 'src/api/GeneralUsers/posts/entities/post.entity';

@Injectable()
export class PropertiesService {
	constructor(
		@InjectModel(Property.name)
		private propertiesSchema: Model<PropertyDocument>,
		@InjectModel(Statistics.name)
		private statisticsSchema: Model<StatisticsDocument>,
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>,
		@InjectRepository(RealEstate)
		private readonly realEstateRepository: Repository<RealEstate>,
		@InjectRepository(BranchOffice)
		private readonly branchOfficeRepository: Repository<BranchOffice>,
		private readonly googleService: GoogleMapsService,
		@InjectRepository(Conversation)
		private readonly conversationRepository: Repository<Conversation>,
		@InjectRepository(Posts)
		private readonly postsRepository: Repository<Posts>
	) {}
	// --------------------------------------------------------------------------- Detail
	async findOneProperty(propertyId: string, obj: any) {
		const { navigator, operationSystem, origin, ipAddress, userId } = obj;
		try {
			let property: any = await this.propertiesSchema.findOne({
				_id: propertyId,
			});
			if (!property) {
				throw new NotFoundException('No se encontró la propiedad especificada');
			}
			const realEstate = await this.realEstateRepository.findOne({
				where: {
					id: property.real_estate.id,
				},
			});
			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: property.branch_office.id,
				},
			});
			let {
				_id,
				description,
				status,
				images,
				created_at,
				updated_at,
				deleted_at,
				title,
				price,
				video,
				video360,
				operation_type,
				property_type,
				sub_property_type,
				location,
				surface,
				antiquity,
				characteristics,
				extras,
			} = property;
			const geo = geoip.lookup(ipAddress);
			await this.statisticsSchema.create({
				ipAddress,
				propertyId: property._id,
				userId: userId ? userId : null,
				navigator,
				origin,
				operationSystem,
				location: geo,
			});
			return {
				_id,
				description,
				status,
				images,
				created_at,
				updated_at,
				deleted_at,
				title,
				price,
				video,
				video360,
				real_estate: realEstate,
				branch_office: branchOffice,
				operation_type,
				property_type,
				sub_property_type,
				location,
				surface,
				antiquity,
				characteristics,
				extras,
			};
		} catch (err) {
			throw new BadRequestException(err.message);
		}
	}
	// --------------------------------------------------------------------------- Find All By Queries & Body
	async findAllPropertyByQueries(
		pagination?: PaginationQueryDto,
		findOptions?: any
	) {
		// ----------------------------------------------------- Pagination
		let { limit, offset, realEstateId, orderBy, sort } = pagination;
		if (!offset) {
			offset = 0;
		}
		let skip = limit * offset;
		// ---------------------------------------------------------------------------------------------- Dates
		const now = new Date();
		const lastMonth = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);
		// ----------------------------------------------------- First Filter
		const {
			operationType,
			propertyTypes,
			barrios,
			surface,
			price,
			ambiences,
			bedRooms,
			bathRooms,
			garages,
			extras,
		} = findOptions;
		// ----------------------------------------------------- Advanced Filter
		if (!limit && !offset) {
			throw new BadRequestException(
				'Por favor ingrese los datos de la paginación'
			);
		} else {
			try {
				let properties: any;
				let queries = [];
				let ordering = {};
				// ---------------------------------------------- Default option
				queries.push(
					{ operation_type: operationType },
					{ status: PropertyEnumStatus.published }
				);
				// --------------------------------------------------------------
				if (realEstateId) {
					queries.push({ 'real_estate.id': realEstateId });
				}
				if (propertyTypes) {
					if (propertyTypes.length > 0) {
						queries.push({
							property_type: {
								$in: propertyTypes,
							},
						});
					}
				}
				if (barrios && barrios.length > 0) {
					queries.push({
						'location.barrio': { $in: barrios },
					});
				}
				if (surface) {
					if (surface.type === SurfaceEnumType.totalSurface) {
						if (surface.max) {
							queries.push({
								'surface.totalSurface': {
									$gte: surface.min || 0,
									$lte: surface.max,
								},
							});
						} else {
							queries.push({
								'surface.totalSurface': {
									$gte: surface.min,
								},
							});
						}
					} else if (surface.type === SurfaceEnumType.coveredSurface) {
						if (surface.max) {
							queries.push({
								'surface.coveredSurface': {
									$gte: surface.min || 0,
									$lte: surface.max,
								},
							});
						} else {
							queries.push({
								'surface.coveredSurface': {
									$gte: surface.min,
								},
							});
						}
					}
				}
				if (price && (price.currencyARS || price.currencyUSD)) {
					if (
						price.currencyARS.min &&
						price.currencyUSD.min &&
						!price.currencyARS.max &&
						!price.currencyUSD.max
					) {
						queries.push({
							$or: [
								{
									'price.total': { $gte: price.currencyUSD.min },
									'price.currency': 1,
								},
								{
									'price.total': { $gte: price.currencyARS.min },
									'price.currency': 2,
								},
							],
						});
					} else if (price.currencyARS.max && price.currencyUSD.max) {
						queries.push({
							$or: [
								{
									'price.total': {
										$gte: price.currencyUSD.min || 0,
										$lte: price.currencyUSD.max,
									},
									'price.currency': 1,
								},
								{
									'price.total': {
										$gte: price.currencyARS.min || 0,
										$lte: price.currencyARS.max,
									},
									'price.currency': 2,
								},
							],
						});
					}
				}
				if (ambiences) {
					if (ambiences === 5) {
						queries.push({
							'characteristics.ambience': {
								$gte: 5,
							},
						});
					} else if (ambiences < 5 && ambiences > 0) {
						queries.push({
							'characteristics.ambience': {
								$eq: ambiences,
							},
						});
					}
				}
				if (bedRooms) {
					if (bedRooms === 5) {
						queries.push({
							'characteristics.bedrooms': {
								$gte: 5,
							},
						});
					} else if (bedRooms < 5) {
						queries.push({
							'characteristics.bedrooms': {
								$eq: bedRooms,
							},
						});
					}
				}
				if (bathRooms) {
					queries.push({
						'characteristics.bathrooms': {
							$gte: bathRooms,
						},
					});
				}
				if (garages) {
					queries.push({
						'characteristics.garages': {
							$gte: garages,
						},
					});
				}
				if (extras && extras.length > 0) {
					let extrasQuery = {};
					extras.forEach((item: any) => {
						if (typeof item === 'number' && item >= 1 && item <= 57) {
							extrasQuery['extras.' + item] = true;
						}
					});
					queries.push({
						$and: [
							{
								$or: [extrasQuery],
							},
						],
					});
				}
				if (orderBy) {
					ordering = { [orderBy]: sort === FindOptionsSort.desc ? -1 : 1 };
				} else if (!orderBy) {
					ordering = { created_at: -1 };
				}
				properties = await this.propertiesSchema
					.find({
						$and: queries,
					})
					.sort(ordering);
				// ----------------------------------------------------------------------------------- Statistics
				const propertyViews = await this.statisticsSchema.aggregate([
					{
						$group: {
							_id: '$propertyId',
							totalEvents: { $sum: 1 },
							firstEventDate: { $min: '$created_at' }, // sirve para saber cuando fue el primer registro
							lastEventDate: { $max: '$created_at' }, // sirve para saber cuando fue el ultimo registro
							userIds: { $addToSet: '$userId' }, // trae lista de userIds sin repetir || NO BORRAR
							ipAddress: { $addToSet: '$ipAddress' }, // trae lista de ipAddress sin repetir || NO BORRAR
						},
					},
				]);

				properties = await Promise.all(
					properties.map(async (prop: any) => {
						const propWithStatistics = propertyViews.find(
							(propView: any) => prop._id.toString() === propView._id.toString()
						);
						if (propWithStatistics) {
							const postsCount = await this.postsRepository.count({
								where: {
									propertyId: propWithStatistics._id.toString(),
									created_at: Between(lastMonth, now),
								},
							});
							const conversationCount = await this.conversationRepository.count(
								{
									where: {
										propertyId: propWithStatistics._id.toString(),
									},
								}
							);
							return {
								...prop.toObject(),
								statistics: {
									views: propWithStatistics.totalEvents
										? propWithStatistics.totalEvents
										: 0,
									interested: postsCount ? postsCount : 0,
									queries: conversationCount ? conversationCount : 0,
								},
							};
						} else {
							return {
								...prop.toObject(),
								statistics: {
									views: 0,
									interested: 0,
									queries: 0,
								},
							};
						}
					})
				);
				return {
					allPropertiesLength: properties.length,
					result: properties.slice(skip, skip + limit),
				};
			} catch (err) {
				return err;
			}
		}
	}

	// ---------------------------------------------------- ByBranchOffice
	async findPropertiesByBranchOffice(
		body: FindPropertiesAdmin,
		pagination: PaginationQueryBranchOfficeDto
	) {
		const { branchOffices, property, operation, status, sortBy, finisheds } =
			body;
		let { offset, limit, field } = pagination;
		if (!offset) {
			offset = 0;
		}
		let skip = limit * offset;
		let queries: any;

		// ---------------------------------------------------------------------------------------------- Dates
		const now = new Date();
		const lastMonth = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);

		if (branchOffices) {
			queries = [{ 'branch_office.id': { $in: branchOffices } }];
		}
		let ordering: any = {};
		let properties: any;
		const dictionary = {
			operation: {
				1: 'Venta',
				2: 'Alquiler',
				3: 'Temporario',
			},
			type: {
				1: 'Departamento',
				2: 'Casa',
				3: 'PH',
				4: 'Cochera',
				5: 'Consultorio',
				6: 'Fondo de comercio',
				7: 'Local comercial',
				8: 'Oficina comercial',
				9: 'Bodega/Galpón/Depósito',
				10: 'Terreno',
				11: 'Hotel',
				12: 'Edificio',
				13: 'Bóveda/Nicho/Parcela',
			},
			status: {
				published: 'Activa',
				pending: 'Pendiente',
				paused: 'Pausada',
				finished: 'Finalizada',
			},
		};
		if (property !== 0) {
			queries.push({
				property_type: property,
			});
		}
		if (operation !== 0) {
			queries.push({
				operation_type: operation,
			});
		}
		if (status === 'all') {
			if (finisheds) {
				queries.push({
					status: { $ne: PropertyEnumStatus.deleted },
				});
			} else {
				queries.push({
					status: {
						$nin: [PropertyEnumStatus.deleted, PropertyEnumStatus.finished],
					},
				});
			}
		} else {
			queries.push({
				status: status,
			});
		}
		if (field) {
			queries.push({
				$or: [
					{ description: new RegExp(field, 'i') },
					{ title: new RegExp(field, 'i') },
					{
						$expr: {
							$regexMatch: {
								input: {
									$concat: [
										'$location.street',
										' ',
										{ $toString: '$location.number' },
									],
								},
								regex: new RegExp(field, 'i'),
							},
						},
					},
				],
			});
		}
		if (
			sortBy.prop &&
			sortBy.order &&
			sortBy.prop !== 'type' &&
			sortBy.prop !== 'operation' &&
			sortBy.prop !== 'status'
		) {
			const sortType = FindOptionsSortAdmin[sortBy.prop];
			ordering = { [sortType]: sortBy.order === FindOptionsSort.desc ? -1 : 1 };
			properties = await this.propertiesSchema
				.find({
					$and: queries,
				})
				.sort(ordering);
		} else if (
			sortBy.prop &&
			sortBy.order &&
			(sortBy.prop === 'type' ||
				sortBy.prop === 'operation' ||
				sortBy.prop === 'status')
		) {
			const orderSense = sortBy.order === 'asc' ? [1, -1] : [-1, 1];
			const propSorted = FindOptionsSortAdmin[sortBy.prop];
			properties = await this.propertiesSchema.find({
				$and: queries,
			});
			properties = properties.sort((a: any, b: any) => {
				const list = dictionary[sortBy.prop];
				return list[a[propSorted]] > list[b[propSorted]]
					? orderSense[0]
					: orderSense[1];
			});
		} else {
			ordering = { updated_at: -1 };
			properties = await this.propertiesSchema
				.find({
					$and: queries,
				})
				.sort(ordering);
		}

		// ----------------------------------------------------------------------------------- Statistics
		const propertyViews = await this.statisticsSchema.aggregate([
			{
				$group: {
					_id: '$propertyId',
					totalEvents: { $sum: 1 },
					firstEventDate: { $min: '$created_at' }, // sirve para saber cuando fue el primer registro
					lastEventDate: { $max: '$created_at' }, // sirve para saber cuando fue el ultimo registro
					userIds: { $addToSet: '$userId' }, // trae lista de userIds sin repetir || NO BORRAR
					ipAddress: { $addToSet: '$ipAddress' }, // trae lista de ipAddress sin repetir || NO BORRAR
				},
			},
		]);

		properties = await Promise.all(
			properties.map(async (prop: any) => {
				const propWithStatistics = propertyViews.find(
					(propView: any) => prop._id.toString() === propView._id.toString()
				);

				if (propWithStatistics) {
					const postsCount = await this.postsRepository.count({
						where: {
							propertyId: propWithStatistics._id.toString(),
							created_at: Between(lastMonth, now),
						},
					});
					const conversationCount = await this.conversationRepository.count({
						where: {
							propertyId: propWithStatistics._id.toString(),
						},
					});

					return {
						...prop.toObject(),
						statistics: {
							views: propWithStatistics.totalEvents
								? propWithStatistics.totalEvents
								: 0,
							interested: postsCount ? postsCount : 0,
							queries: conversationCount ? conversationCount : 0,
						},
					};
				} else {
					return {
						...prop.toObject(),
						statistics: {
							views: 0,
							interested: 0,
							queries: 0,
						},
					};
				}
			})
		);

		return {
			allPropertiesLength: properties.length,
			result: properties.slice(skip, skip + limit),
		};
	}

	async create(createPropertyDto: CreatePropertyDto) {
		if (
			createPropertyDto.location.street == null ||
			createPropertyDto.location.number == null
		) {
			throw new BadRequestException(
				'Please enter all values for location property'
			);
		} else {
			if (typeof createPropertyDto.real_estate === 'number') {
				throw new BadRequestException('Real Estate no debe ser un id');
			}

			if (typeof createPropertyDto.branch_office === 'number') {
				throw new BadRequestException('Branch Office no debe ser un id');
			}

			const propertyCreated = await this.propertiesSchema.create(
				createPropertyDto
			);
			const newName = propertyCreated._id;
			fs.mkdir(
				`./uploads/properties/${newName}`,
				{ recursive: true },
				(err) => {
					if (err) {
						return err;
					}
				}
			);
			return {
				propertyId: propertyCreated._id,
				message: 'Propiedad publicada con éxito',
			};
		}
	}

	async update(propertyId: string, updatePropertyDto: UpdatePropertyDto) {
		try {
			if (typeof updatePropertyDto.real_estate === 'number') {
				throw new BadRequestException('Real Estate no debe ser un id');
			}

			if (typeof updatePropertyDto.branch_office === 'number') {
				throw new BadRequestException('Branch Office no debe ser un id');
			}

			await this.propertiesSchema.findOneAndUpdate(
				{
					_id: propertyId,
				},
				{
					$set: updatePropertyDto,
				}
			);
			return {
				message: 'Propiedad actualizada con éxito',
			};
		} catch (err) {
			throw new BadRequestException(
				'No se pudo encontrar la propiedad especificada'
			);
		}
	}

	async uploadCharacteristics(
		propertyId: string,
		uploadCharacteristics: UploadCharacteristicsDto
	) {
		try {
			if (typeof uploadCharacteristics.real_estate === 'number') {
				throw new BadRequestException('Real Estate no debe ser un id');
			}
			if (typeof uploadCharacteristics.branch_office === 'number') {
				throw new BadRequestException('Branch Office no debe ser un id');
			}
			const findProperty = await this.propertiesSchema.findOne({
				_id: propertyId,
			});
			if (!findProperty) {
				throw new NotFoundException('No se pudo encontrar el id especificado');
			}
			await this.propertiesSchema.findOneAndUpdate(
				{
					_id: propertyId,
				},
				{
					$set: uploadCharacteristics,
				}
			);
			return {
				message: 'Propiedad actualizada con éxito',
			};
		} catch (err) {
			throw new BadRequestException(
				'No se pudo encontrar la propiedad especificada'
			);
		}
	}

	async uploadMultimedia(
		files: UploadMultimediaDto,
		propertyId: string,
		body: UploadMultimediaDto
	) {
		const { video, video360, imageType } = body;
		const images = [];
		const response = [];
		try {
			await this.propertiesSchema.findOneAndUpdate(
				{
					_id: propertyId,
				},
				{
					$set: {
						video,
						video360,
					},
				}
			);
			const property = await this.propertiesSchema.findOne({
				_id: propertyId,
			});
			// ------------------------------- Images
			if (files.image) {
				const { filename, originalname } = files.image[0];
				const fileResponse = {
					url: '',
					title: '',
					type: imageType,
					originalname: `${originalname}`,
					filename: filename,
				};
				// ------------------------------------------------------- Resizing image
				const imagePath = `./uploads/properties/${filename}`;
				const filePath = `./uploads/properties`;
				const metadata = await sharp(imagePath).metadata();
				const maxWidth = 800;
				const maxHeight = 600;

				if (metadata.width > maxWidth || metadata.height > maxHeight) {
					let width = metadata.width;
					let height = metadata.height;
					if (width > maxWidth) {
						height = Math.round(height * (maxWidth / width));
						width = maxWidth;
					}
					if (height > maxHeight) {
						width = Math.round(width * (maxHeight / height));
						height = maxHeight;
					}
					const resizedImage = await sharp(imagePath)
						.resize({
							width,
							height,
							fit: sharp.fit.inside,
							withoutEnlargement: true,
						})
						.toBuffer();
					await sharp(resizedImage).toFile(`${filePath}/${filename}`);
				} else {
					await sharp(imagePath).toFile(`${filePath}/${filename}`);
				}
				// -------------------------------------------------------

				images.push(...property.images, fileResponse);

				await this.propertiesSchema.findOneAndUpdate(
					{
						_id: propertyId,
					},
					{
						$set: {
							images,
						},
					}
				);
				response.push(fileResponse);
			}
			// ------------------------------- HouseMaps
			if (files.houseMap) {
				const { filename, originalname } = files.houseMap[0];
				const fileResponse = {
					url: '',
					title: '',
					type: imageType,
					originalname: `${originalname}`,
					filename: filename,
				};
				// ------------------------------------------------------- Resizing houseMap
				const imagePath = `./uploads/properties/${filename}`;
				const filePath = `./uploads/properties`;
				const metadata = await sharp(imagePath).metadata();
				const maxWidth = 800;
				const maxHeight = 600;
				if (metadata.width > maxWidth || metadata.height > maxHeight) {
					let width = metadata.width;
					let height = metadata.height;
					if (width > maxWidth) {
						height = Math.round(height * (maxWidth / width));
						width = maxWidth;
					}
					if (height > maxHeight) {
						width = Math.round(width * (maxHeight / height));
						height = maxHeight;
					}
					const resizedImage = await sharp(imagePath)
						.resize({
							width,
							height,
							fit: sharp.fit.inside,
							withoutEnlargement: true,
						})
						.toBuffer();
					await sharp(resizedImage).toFile(`${filePath}/${filename}`);
				} else {
					await sharp(imagePath).toFile(`${filePath}/${filename}`);
				}
				// -------------------------------------------------------
				images.push(...property.images, fileResponse);
				await this.propertiesSchema.findOneAndUpdate(
					{
						_id: propertyId,
					},
					{
						$set: {
							images,
						},
					}
				);
				response.push(fileResponse);
			}
			return [
				...response,
				{
					video: video,
					video360: video360,
				},
			];
		} catch (err) {
			return err;
		}
	}

	async deleteFile(propertyId: string, body: any) {
		const { filename } = body;
		const property = await this.propertiesSchema.findOne({
			_id: propertyId,
		});
		if (!property) {
			throw new BadRequestException(
				'No se ha encontrado la propiedad especificada'
			);
		}
		let image: any = property.images.find(
			(el: any) => el.filename === filename
		);
		if (!image) {
			throw new NotFoundException('No se ha encontrado la imagen especificada');
		}
		let images = property.images.filter((el: any) => el.filename !== filename);
		await this.propertiesSchema.findOneAndUpdate(
			{
				_id: propertyId,
			},
			{
				$set: {
					images,
				},
			}
		);
		try {
			if (image.url === '') {
				fs.unlinkSync(`./uploads/properties/${filename}`);
			}
			return {
				result: images,
				message: 'Imagen Eliminada con éxito',
			};
		} catch (error) {
			throw new BadRequestException(
				'No se ha encontrado la imagen o ya ha sido eliminada'
			);
		}
	}

	async publishProperty(id: string, body: PropertyPublishedStatusDto) {
		if (body.status === PropertyEnumStatus.deleted) {
			throw new NotImplementedException(
				'No tiene permisos suficientes para realizar esta operacion'
			);
		}
		if (body.status === PropertyEnumStatus.pending) {
			throw new NotImplementedException(
				'No tiene permisos suficientes para realizar esta operacion'
			);
		}
		if (!body) {
			throw new BadRequestException(
				'Algo salió mal. No se pudo publicar la propiedad. Intente nuevamente o comuniquese con soporte.'
			);
		}
		const findProperty = await this.propertiesSchema.findOne({
			_id: id,
		});
		if (!findProperty) {
			throw new NotFoundException('No se pudo encontrar el id especificado');
		}
		await this.propertiesSchema.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: {
					status: body.status,
				},
			}
		);
		return {
			message: 'Propiedad actualizada con éxito',
		};
	}

	// ------------------------------------------------------------------------ LOGICAL REMOVE
	async removeLogical(id: string) {
		const images = [];
		const setData = {
			deleted_at: new Date(),
			images: images,
			video: '',
			video360: '',
			status: PropertyEnumStatus.deleted,
		};
		const finded = await this.propertiesSchema.findOne({
			_id: id,
		});
		if (!finded) {
			throw new NotFoundException(
				'No se pudo encontrar la propiedad especificada'
			);
		}
		if (finded.status === PropertyEnumStatus.deleted) {
			throw new NotImplementedException(
				'La Propiedad ingresada no se encontró o ya no existe'
			);
		} else {
			try {
				await this.propertiesSchema.findOneAndUpdate(
					{
						_id: id,
					},
					{
						$set: setData,
					}
				);
				//fs.rmdirSync(`./uploads/properties/${id}`, { recursive: true });
				return {
					message: 'Propiedad eliminada con éxito',
				};
			} catch (err) {
				throw new BadRequestException(
					'No se pudo borrar, porque ya ha sido eliminada la propiedad. No existen registros'
				);
			}
		}
	}

	// ------------------------------------------------------------------------ PHISICAL REMOVE
	async removePhisical(id: string) {
		try {
			await this.propertiesSchema.findOneAndRemove({
				_id: id,
			});
			fs.rmdirSync(`./uploads/properties/${id}`, { recursive: true });
			return {
				message: 'Propiedad eliminada con éxito',
			};
		} catch (err) {
			throw new BadRequestException(
				'No se pudo borrar, porque ya ha sido eliminada la propiedad. No existen registros'
			);
		}
	}

	async uploadMultiplePropertiesByCsv(
		user: any,
		data: any,
		body: UploadCsvDto
	) {
		try {
			const { branchOfficeId } = body;
			let realEstate: any;
			let rowErrors = [];
			const urlVideoRegex =
				/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
			if (user.typeOfUser === TypeOfUser.collabUser) {
				const collabFinded: any = await this.usersRepository.findOne({
					where: {
						id: user.adminUserId,
					},
				});
				const realEstateFinded = await this.realEstateRepository.findOne({
					where: {
						user: collabFinded,
					},
				});
				realEstate.id = realEstateFinded.id;
				realEstate.logo = realEstateFinded.logo;
			} else if (user.typeOfUser === TypeOfUser.adminUser) {
				const adminFinded: any = await this.usersRepository.findOne({
					where: {
						id: user.id,
					},
				});
				const realEstateFinded = await this.realEstateRepository.findOne({
					where: {
						user: adminFinded,
					},
				});
				realEstate.id = realEstateFinded.id;
				realEstate.logo = realEstateFinded.logo;
			}
			for (const [index, row] of data.entries()) {
				const downloadImage = async (url: string): Promise<Buffer> => {
					try {
						const response = await Axios.get(url, {
							responseType: 'arraybuffer',
						});
						if (response.status !== 200) {
							throw new BadRequestException(
								'La url de la imagen ingresada es inválida'
							);
						}
						const buffer = Buffer.from(response.data, 'binary');
						return buffer;
					} catch (err) {
						throw new BadRequestException(
							'La url de la imagen ingresada es inválida'
						);
					}
				};
				const saveImageToDisk = async (
					url: string,
					filePath: string,
					fileName: string,
					width: number,
					height: number
				): Promise<void> => {
					const buffer = await downloadImage(url);
					fs.writeFileSync(`${filePath}/${fileName}`, buffer);
					await sharp(buffer)
						.resize(width, height)
						.toFile(`${filePath}/${fileName}`);
				};
				const responseLocation = await this.googleService.getCoordinates({
					address: `${row.CALLE} ${row['ALTURA/NUMERO']} ${row.LOCALIDAD}`,
				});
				if (!row.ID) {
					let errorObj = {
						wrongIndex: null,
						emptyIndex: null,
						notFoundedId: null,
						notFoundedMessage: '',
						fieldName: '',
						repeatedIndex: null,
						multimediaErrors: '',
						multimediaIndexError: null,
					};
					if (row.VIDEO !== '') {
						const resultVideoRegex = urlVideoRegex.test(row.VIDEO);
						if (resultVideoRegex === false) {
							errorObj.multimediaErrors =
								'Registro descartado por la url del video';
							rowErrors.push(errorObj);
							continue;
						}
					}
					if (row.MONEDA === 'USD') {
						row.MONEDA = 1;
					}
					if (row.MONEDA === 'ARS') {
						row.MONEDA = 2;
					}
					switch (row['TIPO DE OPERACION']) {
						case OperationTypesEnum.venta:
							row['TIPO DE OPERACION'] = 1;
							break;
						case OperationTypesEnum.alquiler:
							row['TIPO DE OPERACION'] = 2;
						case OperationTypesEnum.temporario:
							row['TIPO DE OPERACION'] = 3;
					}
					if (!row['TIPO DE OPERACION']) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'TIPO DE OPERACION';
						rowErrors.push(errorObj);
						continue;
					}
					switch (row['TIPO DE PROPIEDAD']) {
						case PropertyTypesEnum.departamento:
							row['TIPO DE PROPIEDAD'] = 1;
						case PropertyTypesEnum.casa:
							row['TIPO DE PROPIEDAD'] = 2;
							break;
						case PropertyTypesEnum.PH:
							row['TIPO DE PROPIEDAD'] = 3;
							break;
						case PropertyTypesEnum.cochera:
							row['TIPO DE PROPIEDAD'] = 4;
							break;
						case PropertyTypesEnum.consultorio:
							row['TIPO DE PROPIEDAD'] = 5;
							break;
						case PropertyTypesEnum.fondoDeComercio:
							row['TIPO DE PROPIEDAD'] = 6;
							break;
						case PropertyTypesEnum.localComercial:
							row['TIPO DE PROPIEDAD'] = 7;
							break;
						case PropertyTypesEnum.oficinaComercial:
							row['TIPO DE PROPIEDAD'] = 8;
							break;
						case PropertyTypesEnum.bodegaGalponDeposito:
							row['TIPO DE PROPIEDAD'] = 9;
							break;
						case PropertyTypesEnum.terreno:
							row['TIPO DE PROPIEDAD'] = 10;
							break;
						case PropertyTypesEnum.hotel:
							row['TIPO DE PROPIEDAD'] = 11;
							break;
						case PropertyTypesEnum.edificio:
							row['TIPO DE PROPIEDAD'] = 12;
							break;
						case PropertyTypesEnum.bovedaNichoParecela:
							row['TIPO DE PROPIEDAD'] = 13;
							break;
					}
					if (!row['TIPO DE PROPIEDAD']) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'TIPO DE PROPIEDAD';
						rowErrors.push(errorObj);
						continue;
					}
					if (!row.TITULO) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'TITULO';
						rowErrors.push(errorObj);
						continue;
					}
					// ----------------------------------------------Location params
					if (!row.CALLE) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'CALLE';
						rowErrors.push(errorObj);
						continue;
					}
					if (!row['ALTURA/NUMERO']) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'NUMERO';
						rowErrors.push(errorObj);
						continue;
					}
					if (
						responseLocation?.message === 'No se han encontrado resultados' ||
						responseLocation?.message ===
							'La dirección ingresada no se encuentra en CABA'
					) {
						errorObj.wrongIndex = index + 1;
						errorObj.fieldName = 'CALLE O NUMERO';
						rowErrors.push(errorObj);
						continue;
					}
					const propertyFinded: any = await this.propertiesSchema.findOne({
						title: row.TITULO,
					});
					if (
						propertyFinded &&
						propertyFinded.property_type === row['TIPO DE PROPIEDAD'] &&
						propertyFinded.operation_type === row['TIPO DE OPERACION'] &&
						propertyFinded.title === row.TITULO &&
						propertyFinded.location.street === row.CALLE &&
						propertyFinded.location.number === parseInt(row['ALTURA/NUMERO'])
					) {
						errorObj.fieldName = 'TITULO';
						errorObj.repeatedIndex = index + 1;
						rowErrors.push(errorObj);
						continue;
					}
					const propertyCreated: any = await this.propertiesSchema.create({
						description: row.DESCRIPCION,
						status: 'paused',
						images: [],
						title: row.TITULO,
						created_at: new Date(),
						updated_at: new Date(),
						deleted_at: null,
						price: {
							total: parseInt(row['PRECIO TOTAL']),
							currency: row.MONEDA,
						},
						video: row.VIDEO,
						video360: row.VIDEO360,
						real_estate: realEstate,
						branch_office: branchOfficeId,
						operation_type: parseInt(row['TIPO DE OPERACION']),
						property_type: parseInt(row['TIPO DE PROPIEDAD']),
						location: {
							number: parseInt(responseLocation.streetNumber),
							street: responseLocation.streetName,
							barrio: responseLocation.sublocality_level_1,
							lat: responseLocation.lat,
							lng: responseLocation.lng,
							cp: responseLocation.postalCode,
							cp_suffix: responseLocation.postalCodeSuffix,
							area_level_1: responseLocation.administrative_area_level_1,
							area_level_2: responseLocation.administrative_area_level_2,
							locality: responseLocation.locality,
						},
						surface: {
							totalSurface: parseInt(row['SUPERFICIE TOTAL']),
							coveredSurface: parseInt(row['SUPERFICIE CUBIERTA']),
						},
						antiquity: {
							type: parseInt(row.ANTIGUEDAD),
							years: parseInt(row['AÑOS DE ANTIGUEDAD']),
						},
						characteristics: {
							ambience: parseInt(row.AMBIENTES),
							bedRooms: parseInt(row.DORMITORIOS),
							floors: parseInt(row.PISOS),
							bathRooms: parseInt(row.BAÑOS),
							privateBathRooms: parseInt(row['BAÑOS PRIVADOS']),
							toilettes: parseInt(row.TOILETTES),
							garages: parseInt(row.GARAGES),
							covered: row['GARAGE CUBIERTO'],
							lift: row.ELEVADOR,
							underground: row['COCHERA BAJO TIERRA'],
							building: row['COCHERA DE EDIFICIO'],
						},
						extras: {
							'1': row['ACCESO P/PERSONAS C/DISCAPACIDAD'],
							'2': row.PARRILLA,
							'3': row.SOLARIUM,
							'4': row['APTO PROFESIONAL'],
							'5': row['PERMITE MASCOTAS'],
							'6': row['USO COMERCIAL'],
							'7': row.GIMNASIO,
							'8': row.PILETA,
							'9': row.HIDROMASAJE,
							'10': row['SALA DE JUEGOS'],
							//  -------------------------------
							'11': row['AIRE ACONDICIONADO'],
							'12': row['COCINA EQUIPADA'],
							'13': row.SUM,
							'14': row.ALARMA,
							'15': row.FRIGOBAR,
							'16': row.SAUNA,
							'17': row.AMOBLADO,
							'18': row.LAVARROPAS,
							'19': row.SECARROPAS,
							'20': row.CALDERA,
							'21': row.LAVAVAJILLAS,
							'22': row.TERMOTANQUE,
							'23': row.MICROONDAS,
							'24': row.VIGILANCIA,
							'25': row['CANCHA DEPORTES'],
							'26': row.QUINCHO,
							'27': row['PLAZA DE MANIOBRAS'],
							'28': row.GRUA,
							'29': row['FUERZA MOTRIZ'],
							'31': row.MOTORES,
							'32': row['GRUPO ELECTROGENO'],
							'33': row.ASCENSOR,
							'34': row['CAJA FUERTE'],
							'35': row.LAUNDRY,
							'36': row.INTERNET,
							'37': row.WIFI,
							'38': row.CABLE,
							'39': row.BALCON,
							'40': row['DORMITORIO EN SUITE'],
							'41': row['LIVING COMEDOR'],
							'42': row.BAULERA,
							'43': row.ESCRITORIO,
							'44': row.PATIO,
							'45': row.COCINA,
							'46': row.HALL,
							'47': row.SOTANO,
							'48': row.COMEDOR,
							'49': row.JARDIN,
							'50': row.TERRAZA,
							'51': row['COMEDOR DE DIARIO'],
							'52': row.LAVADERO,
							'53': row.TOILETTE,
							'54': row['DEPENDENCIA DE SERVICIO'],
							'55': row.LIVING,
							'56': row.VESTIDOR,
							'57': row.OFICINAS,
						},
					});
					if (propertyCreated) {
						const newName = propertyCreated._id;
						fs.mkdir(
							`./uploads/properties/${newName}`,
							{ recursive: true },
							(err) => {
								if (err) {
									return err;
								}
							}
						);
						let images = row.IMAGENES.split(',');
						let houseMaps = row.PLANOS.split(',');
						if (images.length) {
							if (images.length === 5 || images.length > 5) {
								images.forEach(async (img: string, index: number) => {
									const uuid = uuidv4();
									let obj = {
										url: `${img}`,
										title: '',
										type: 'image',
									};
									await this.propertiesSchema.findOneAndUpdate(
										{
											_id: propertyCreated._id,
										},
										{
											$push: {
												images: obj,
											},
										}
									);
									await saveImageToDisk(
										`${img}`,
										`./uploads/properties/${newName}`,
										`${uuid}.jpg`,
										800,
										600
									);
								});
							} else if (images.length < 5) {
								errorObj.fieldName = 'IMAGENES';
								errorObj.multimediaErrors =
									'No ha cargado la minima cantidad de imagenes (5)';
								errorObj.multimediaIndexError = index + 1;
								rowErrors.push(errorObj);
								continue;
							}
						}
						if (houseMaps.length) {
							houseMaps.forEach(async (hm: string) => {
								const uuid = uuidv4();
								let obj = {
									url: `${hm}`,
									title: '',
									type: 'houseMap',
								};
								await this.propertiesSchema.findOneAndUpdate(
									{
										_id: propertyCreated.id,
									},
									{
										$push: {
											images: obj,
										},
									}
								);
								await saveImageToDisk(
									`${hm}`,
									`./uploads/properties/${newName}`,
									`${uuid}.jpg`,
									800,
									600
								);
							});
						}
					}
				} else if (row.ID) {
					let errorObj = {
						wrongIndex: null,
						emptyIndex: null,
						notFoundedId: null,
						notFoundedMessage: '',
						fieldName: '',
						repeatedIndex: null,
						multimediaIndexError: null,
						multimediaErrors: '',
					};
					if (row.VIDEO !== '') {
						const resultVideoRegex = urlVideoRegex.test(row.VIDEO);
						if (resultVideoRegex === false) {
							errorObj.multimediaErrors =
								'Registro descartado por la url del video';
							rowErrors.push(errorObj);
							continue;
						}
					}
					if (row.MONEDA === 'USD') {
						row.MONEDA = 1;
					}
					if (row.MONEDA === 'ARS') {
						row.MONEDA = 2;
					}
					switch (row['TIPO DE OPERACION']) {
						case OperationTypesEnum.venta:
							row['TIPO DE OPERACION'] = 1;
							break;
						case OperationTypesEnum.alquiler:
							row['TIPO DE OPERACION'] = 2;
						case OperationTypesEnum.temporario:
							row['TIPO DE OPERACION'] = 3;
					}
					if (!row['TIPO DE OPERACION']) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'TIPO DE OPERACION';
						rowErrors.push(errorObj);
						continue;
					}
					switch (row['TIPO DE PROPIEDAD']) {
						case PropertyTypesEnum.departamento:
							row['TIPO DE PROPIEDAD'] = 1;
						case PropertyTypesEnum.casa:
							row['TIPO DE PROPIEDAD'] = 2;
							break;
						case PropertyTypesEnum.PH:
							row['TIPO DE PROPIEDAD'] = 3;
							break;
						case PropertyTypesEnum.cochera:
							row['TIPO DE PROPIEDAD'] = 4;
							break;
						case PropertyTypesEnum.consultorio:
							row['TIPO DE PROPIEDAD'] = 5;
							break;
						case PropertyTypesEnum.fondoDeComercio:
							row['TIPO DE PROPIEDAD'] = 6;
							break;
						case PropertyTypesEnum.localComercial:
							row['TIPO DE PROPIEDAD'] = 7;
							break;
						case PropertyTypesEnum.oficinaComercial:
							row['TIPO DE PROPIEDAD'] = 8;
							break;
						case PropertyTypesEnum.bodegaGalponDeposito:
							row['TIPO DE PROPIEDAD'] = 9;
							break;
						case PropertyTypesEnum.terreno:
							row['TIPO DE PROPIEDAD'] = 10;
							break;
						case PropertyTypesEnum.hotel:
							row['TIPO DE PROPIEDAD'] = 11;
							break;
						case PropertyTypesEnum.edificio:
							row['TIPO DE PROPIEDAD'] = 12;
							break;
						case PropertyTypesEnum.bovedaNichoParecela:
							row['TIPO DE PROPIEDAD'] = 13;
							break;
					}
					if (!row['TIPO DE PROPIEDAD']) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'TIPO DE PROPIEDAD';
						rowErrors.push(errorObj);
						continue;
					}
					if (!row.TITULO) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'TITULO';
						rowErrors.push(errorObj);
						continue;
					}
					// ----------------------------------------------Location params
					if (!row.CALLE) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'CALLE';
						rowErrors.push(errorObj);
						continue;
					}
					if (!row['ALTURA/NUMERO']) {
						errorObj.emptyIndex = index + 1;
						errorObj.fieldName = 'NUMERO';
						rowErrors.push(errorObj);
						continue;
					}
					const propertyFinded = await this.propertiesSchema.findById(row.ID);
					if (!propertyFinded) {
						errorObj.notFoundedId = index + 1;
						errorObj.notFoundedMessage =
							'No se encontró la propiedad especificada';
						continue;
					}
					await this.propertiesSchema.findOneAndUpdate(
						{ _id: row.ID },
						{
							$set: {
								description: row.DESCRIPCION,
								status: propertyFinded.status,
								images: [],
								title: row.TITULO,
								created_at: new Date(),
								updated_at: new Date(),
								deleted_at: null,
								price: {
									total: parseInt(row['PRECIO TOTAL']),
									currency: row.MONEDA,
								},
								video: row.VIDEO,
								video360: row.VIDEO360,
								real_estate: realEstate,
								branch_office: branchOfficeId,
								operation_type: parseInt(row['TIPO DE OPERACION']),
								property_type: parseInt(row['TIPO DE PROPIEDAD']),
								location: {
									number: parseInt(responseLocation.streetNumber),
									street: responseLocation.streetName,
									barrio: responseLocation.sublocality_level_1,
									lat: responseLocation.lat,
									lng: responseLocation.lng,
									cp: responseLocation.postalCode,
									cp_suffix: responseLocation.postalCodeSuffix,
									area_level_1: responseLocation.administrative_area_level_1,
									area_level_2: responseLocation.administrative_area_level_2,
									locality: responseLocation.locality,
								},
								surface: {
									totalSurface: parseInt(row['SUPERFICIE TOTAL']),
									coveredSurface: parseInt(row['SUPERFICIE CUBIERTA']),
								},
								antiquity: {
									type: parseInt(row.ANTIGUEDAD),
									years: parseInt(row['AÑOS DE ANTIGUEDAD']),
								},
								characteristics: {
									ambience: parseInt(row.AMBIENTES),
									bedRooms: parseInt(row.DORMITORIOS),
									floors: parseInt(row.PISOS),
									bathRooms: parseInt(row.BAÑOS),
									privateBathRooms: parseInt(row['BAÑOS PRIVADOS']),
									toilettes: parseInt(row.TOILETTES),
									garages: parseInt(row.GARAGES),
									covered: row['GARAGE CUBIERTO'],
									lift: row.ELEVADOR,
									underground: row['COCHERA BAJO TIERRA'],
									building: row['COCHERA DE EDIFICIO'],
								},
								extras: {
									'1': row['ACCESO P/PERSONAS C/DISCAPACIDAD'],
									'2': row.PARRILLA,
									'3': row.SOLARIUM,
									'4': row['APTO PROFESIONAL'],
									'5': row['PERMITE MASCOTAS'],
									'6': row['USO COMERCIAL'],
									'7': row.GIMNASIO,
									'8': row.PILETA,
									'9': row.HIDROMASAJE,
									'10': row['SALA DE JUEGOS'],
									//  -------------------------------
									'11': row['AIRE ACONDICIONADO'],
									'12': row['COCINA EQUIPADA'],
									'13': row.SUM,
									'14': row.ALARMA,
									'15': row.FRIGOBAR,
									'16': row.SAUNA,
									'17': row.AMOBLADO,
									'18': row.LAVARROPAS,
									'19': row.SECARROPAS,
									'20': row.CALDERA,
									'21': row.LAVAVAJILLAS,
									'22': row.TERMOTANQUE,
									'23': row.MICROONDAS,
									'24': row.VIGILANCIA,
									'25': row['CANCHA DEPORTES'],
									'26': row.QUINCHO,
									'27': row['PLAZA DE MANIOBRAS'],
									'28': row.GRUA,
									'29': row['FUERZA MOTRIZ'],
									'31': row.MOTORES,
									'32': row['GRUPO ELECTROGENO'],
									'33': row.ASCENSOR,
									'34': row['CAJA FUERTE'],
									'35': row.LAUNDRY,
									'36': row.INTERNET,
									'37': row.WIFI,
									'38': row.CABLE,
									'39': row.BALCON,
									'40': row['DORMITORIO EN SUITE'],
									'41': row['LIVING COMEDOR'],
									'42': row.BAULERA,
									'43': row.ESCRITORIO,
									'44': row.PATIO,
									'45': row.COCINA,
									'46': row.HALL,
									'47': row.SOTANO,
									'48': row.COMEDOR,
									'49': row.JARDIN,
									'50': row.TERRAZA,
									'51': row['COMEDOR DE DIARIO'],
									'52': row.LAVADERO,
									'53': row.TOILETTE,
									'54': row['DEPENDENCIA DE SERVICIO'],
									'55': row.LIVING,
									'56': row.VESTIDOR,
									'57': row.OFICINAS,
								},
							},
						}
					);
					if (propertyFinded) {
						const newName = propertyFinded._id;
						let images = row.IMAGENES.split(',');
						let houseMaps = row.PLANOS.split(',');
						let newImages = [];
						let newHouseMaps = [];
						if (images.length) {
							if (images.length === 5 || images.length > 5) {
								images.forEach(async (img: string, i: any) => {
									const uuid = uuidv4();
									let obj = {
										url: `${img}`,
										title: '',
										type: 'image',
									};
									newImages = [...newImages, obj];
									await this.propertiesSchema.findOneAndUpdate(
										{
											_id: propertyFinded._id,
										},
										{
											$set: {
												images: newImages,
											},
										}
									);
									await fsExtra.emptyDirSync(`./uploads/properties/${newName}`);
									await saveImageToDisk(
										`${img}`,
										`./uploads/properties/${newName}`,
										`${uuid}.jpg`,
										800,
										600
									);
								});
							} else if (images.length < 5) {
								errorObj.fieldName = 'IMAGENES';
								errorObj.multimediaErrors =
									'No ha cargado la minima cantidad de imagenes (5)';
								errorObj.multimediaIndexError = index + 1; // posición del string del campo IMAGENES
								rowErrors.push(errorObj);
								continue;
							}
						}
						if (houseMaps.length) {
							houseMaps.forEach(async (hm: string) => {
								const uuid = uuidv4();
								let obj = {
									url: `${hm}`,
									title: '',
									type: 'houseMap',
								};
								newHouseMaps = [...newHouseMaps, obj];
								await saveImageToDisk(
									`${hm}`,
									`./uploads/properties/${newName}`,
									`${uuid}.jpg`,
									800,
									600
								);
								await this.propertiesSchema.findOneAndUpdate(
									{
										_id: propertyFinded.id,
									},
									{
										$set: {
											images: [...newImages, ...newHouseMaps],
										},
									}
								);
							});
						}
					}
				}
			}
			if (rowErrors.length === 0) {
				return {
					message: 'Propiedades Cargadas con éxito',
				};
			} else if (rowErrors.length > 0) {
				return {
					message:
						'Se cargaron propiedades, pero algunas filas del archivo han fallado.',
					fields: rowErrors,
				};
			} else {
				throw new BadRequestException(
					'Ha ocurrido un error, verifique que los datos no esten repetidos, o existan campos obligatorios vacios'
				);
			}
		} catch (err) {
			throw new BadRequestException(err.message);
		}
	}
}
