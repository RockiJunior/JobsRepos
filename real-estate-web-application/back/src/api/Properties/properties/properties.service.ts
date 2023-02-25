import {
	BadRequestException,
	Injectable,
	NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property, PropertyDocument } from './schema/property.schema';
import {
	PropertyEnumStatus,
	CurrencyEnumNumbers,
} from '../../../config/enum-types';
import { UploadCharacteristicsDto } from './dto/uploadCharacteristics.dto';
import { UploadMultimediaDto } from './dto/upload-multimedia.dto';
import { PropertyPublishedStatusDto } from './dto/property-published-status.dto';
import { NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UploadCloudinaryDto } from './dto/upload-cloudinary';
import { DeleteCloudinaryDto } from './dto/delete-cloudinary';
import { FindPropertyOptionsDto } from './dto/find-property-options.dto';
import { SurfaceEnumType } from '../../../config/enum-types';
@Injectable()
export class PropertiesService {
	constructor(
		@InjectModel(Property.name)
		private propertiesSchema: Model<PropertyDocument>, // private readonly dataSource: DataSource
		private cloudinary: CloudinaryService
	) {}
	// ---------------------------------------------------- Clients
	async findOneClient(propertyId: string) {
		try {
			const property = await this.propertiesSchema.findOne({
				_id: propertyId,
			});
			if (!property) {
				throw new NotFoundException('No se encontró la propiedad especificada');
			}
			return property;
		} catch (err) {
			throw new BadRequestException(err.message);
		}
	}

	async findAllPropertyByQueries(
		pagination?: PaginationQueryDto,
		findOptions?: any
	) {
		// ----------------------------------------------------- Pagination
		let { limit, offset } = pagination;
		if (!offset) {
			offset = 0;
		}
		let skip = limit * offset;
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
				let properties: any = await this.propertiesSchema
					.find({
						$and: [
							{ operation_type: operationType },
							{ status: PropertyEnumStatus.published },
						],
					})
					.sort({ created_at: -1 });

				if (propertyTypes.length > 0) {
					propertyTypes.forEach((propertyType: number) => {
						properties = [...properties].filter(
							(el: any) => el.property_type === propertyType
						);
					});
				}
				if (barrios.length > 0) {
					barrios.forEach((b: number) => {
						properties = [...properties].filter(
							(el: any) => el.location.barrio === b
						);
					});
				}
				if (surface) {
					if (surface.type === SurfaceEnumType.totalSurface) {
						properties = [...properties].filter(
							(el) =>
								el.surface.totalSurface >= surface.min &&
								el.surface.totalSurface <= surface.max
						);
					} else if (surface.type === SurfaceEnumType.coveredSurface) {
						properties = [...properties].filter(
							(el) =>
								el.surface.coveredSurface >= surface.min &&
								el.surface.coveredSurface <= surface.max
						);
					}
				}
				if (price) {
					if (price.currency === CurrencyEnumNumbers.USD) {
						properties = [...properties]
							.filter(
								(usdCurr) =>
									usdCurr.price.total >= price.min &&
									usdCurr.price.total <= price.max
							)
							.filter((el) => el.price.currency === 1);
					} else if (price.currency === CurrencyEnumNumbers.ARS) {
						properties = [...properties]
							.filter(
								(arsCurr) =>
									arsCurr.price.total >= price.min &&
									arsCurr.price.total <= price.max
							)
							.filter((el) => el.price.currency === 2);
					}
				}
				if (ambiences) {
					if (ambiences === 5) {
						properties = [...properties].filter(
							(el) =>
								el.characteristics.ambience &&
								el.characteristics.ambience >= ambiences
						);
					}
					properties = [...properties].filter(
						(el) =>
							el.characteristics.ambience &&
							el.characteristics.ambience === ambiences
					);
				}
				if (bedRooms) {
					if (bedRooms === 5) {
						properties = [...properties].filter(
							(el) =>
								el.characteristics.bedrooms &&
								el.characteristics.bedrooms >= bedRooms
						);
					}
					properties = [...properties].filter(
						(el) =>
							el.characteristics.bedrooms &&
							el.characteristics.bedrooms === bedRooms
					);
				}
				if (bathRooms) {
					if (bathRooms === 5) {
						properties = [...properties].filter(
							(el) =>
								el.characteristics.bathrooms &&
								el.characteristics.bathrooms >= bathRooms
						);
					}
					properties = [...properties].filter(
						(el) =>
							el.characteristics.bathrooms &&
							el.characteristics.bathrooms === bathRooms
					);
				}
				if (garages) {
					if (garages === 4) {
						properties = [...properties].filter(
							(el) =>
								el.characteristics.garages &&
								el.characteristics.garages >= garages
						);
					}
					properties = [...properties].filter(
						(el) =>
							el.characteristics.garages &&
							el.characteristics.garages === garages
					);
				}
				return {
					allPropertiesLength: properties.length,
					result: properties.slice(skip, skip + limit),
				};
			} catch (err) {
				return err;
			}
		}
	}

	// ---------------------------------------------------- RealEstate
	async findAllRealEstate(branchOfficeId: number) {
		const properties = await this.propertiesSchema.find({
			branch_office: branchOfficeId,
			status: { $ne: PropertyEnumStatus.deleted },
		});
		return properties;
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
			const propertyCreated = await this.propertiesSchema.create({
				...createPropertyDto,
			});
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

	async uploadImageToCloudinary(
		uploadCloudinaryDto: UploadCloudinaryDto,
		propertyId: string,
		body: UploadCloudinaryDto
	) {
		const images = [];
		const response = [];
		const uuid = uuidv4();
		const { video, video360, imageType } = body;
		try {
			const property: any = await this.propertiesSchema.findOne({
				_id: propertyId,
			});
			if (video || video360) {
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
			}
			if (imageType === 'houseMap' || imageType === 'image') {
				const cloudinaryResponse = await this.cloudinary.uploadImage(
					uploadCloudinaryDto
				);
				const newImageUploaded = {
					url: cloudinaryResponse['url'],
					title: '',
					type: imageType
				}
				images.push(...property.images, newImageUploaded);
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
				return newImageUploaded;
			}
			/* const fileResponse = {
				id: uuid,
				type: imageType,
				originalname: uploadCloudinaryDto['originalname'],
				filename: cloudinaryResponse['url'],
			}; */

			/*response.push(cloudinaryResponse['url']);
			 return [
				...response,
				{
					video: video,
					video360: video360,
				},
			]; */
		} catch (error) {
			throw new NotImplementedException(
				'Error interno. No se pudo cargar la imagen. Intente nuevamente'
			);
		}
	}

	async deleteImageCloudinary(
		deleteCloudinaryDto: DeleteCloudinaryDto,
		propertyId: string
	) {
		const { fileUrl } = deleteCloudinaryDto;
		try {
			await this.cloudinary.deleteImage(fileUrl);
			const property: any = await this.propertiesSchema.findOne({
				_id: propertyId,
			});
			console.log(fileUrl)
			const filteredImages: any = property.images.filter((image) => {
				console.log(image.url)
				console.log(image.url === fileUrl)
				return (image.url !== fileUrl)
			});
			console.log(filteredImages.some((image) => image.url === fileUrl))
			console.log(filteredImages)
			await this.propertiesSchema.findOneAndUpdate(
				{
					_id: propertyId,
				},
				{
					$set: {
						images: filteredImages,
					},
				}
			);

			return filteredImages;
		} catch (err) {
			return err;
		}
	}

	async uploadMultimedia(
		files: UploadMultimediaDto,
		propertyId: string,
		body: UploadMultimediaDto
	) {
		const { video, video360 } = body;
		const images = [];
		const response = [];
		try {
			const property: any = await this.propertiesSchema.findOne({
				_id: propertyId,
			});

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

			// ------------------------------- Images
			if (files.image) {
				const { fieldname, filename, originalname } = files.image[0];
				const uuid = uuidv4();
				const fileResponse = {
					id: uuid,
					type: fieldname,
					originalname: `${originalname}`,
					filename: filename,
				};
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
				const { fieldname, filename, originalname } = files.houseMap[0];
				const uuid = uuidv4();
				const fileResponse = {
					id: uuid,
					type: fieldname,
					originalname: `${originalname}`,
					filename: filename,
				};
				images.push(fileResponse);
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

	async deleteFile(propertyId: string, imageId: uuidv4) {
		const property = await this.propertiesSchema.findOne({
			_id: propertyId,
		});
		if (!property) {
			throw new BadRequestException(
				'No se ha encontrado la propiedad especificada'
			);
		}
		let image: any = property.images.find((el: any) => el.id === imageId);
		let images = property.images.filter((el: any) => el.id !== imageId);
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
			const splitedImage = image.filename.split('./');
			fs.unlinkSync(`./uploads/properties/${splitedImage[1]}`);
			return {
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
}
