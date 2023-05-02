import { faker } from '@faker-js/faker/locale/es_MX';
import {
	commercePhotos,
	garagePhotos,
	housePhotos,
} from './mockUpData/propertiesImages.mockUp';
import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { PropertyEnumStatus } from '../config/enum-types';
import * as fs from 'fs';
import fsExtra from 'fs-extra';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealEstate } from '../api/GeneralUsers/real-estate/entities/real-estate.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
	Property,
	PropertyDocument,
} from '../api/Properties/properties/schema/property.schema';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { BranchOffice } from 'src/api/GeneralUsers/branch-offices/entities/branch-office.entity';

@Injectable()
export class MockUpService {
	private readonly loggerConsole = new Logger(MockUpService.name);
	constructor(
		@InjectRepository(RealEstate)
		private readonly realEstateRepository: Repository<RealEstate>,
		@InjectRepository(BranchOffice)
		private readonly branchOfficeRepository: Repository<BranchOffice>,
		@InjectModel(Property.name)
		private propertiesSchema: Model<PropertyDocument>
	) {}

	async mockUpAdminUserExecuter(
		repository: any,
		data: any,
		realEstate: any,
		branchOffice: any
	) {
		try {
			const result = await data();
			for (const user of result) {
				const password = await hash(`${user.password}`, 10);
				const userCreated = await repository.create({
					...user,
					password,
				});
				await repository.save(userCreated);

				let resultRelation: any = await realEstate.create({
					name: user.realEstate.name,
					description: user.realEstate.description,
					website: user.realEstate.website,
					logo: user.realEstate.logo,
				});
				await realEstate.save(resultRelation);

				await realEstate.update(resultRelation.id, {
					user: userCreated,
				});

				const realEstateFinded = await realEstate.findOne({
					where: {
						id: resultRelation.id,
					},
				});

				user.realEstate.branchOffices.forEach(async (brOff: any) => {
					const resultRelation = await branchOffice.create({
						branch_office_name: brOff.branch_office_name,
						isCentral: brOff.isCentral,
						isActive: brOff.isActive,
						phoneNumber: brOff.phoneNumber,
						openingHours: brOff.openingHours,
						address: brOff.address,
						realEstate: realEstateFinded.id,
					});
					await branchOffice.save(resultRelation);
				});
			}
		} catch (err) {
			return err;
		}
	}

	async mockUpClientUserExecuter(repository: any, data: any) {
		try {
			const password = await hash(`${data.password}`, 10);
			const result = await repository.create({
				...data,
				password: password,
			});
			await repository.save(result);
		} catch (err) {
			return err;
		}
	}

	mockUpRoleExecuter = async (
		roleRepository: any,
		data: any,
		realEstateRepository: any,
		permissionsRepository: any,
		roleToPermissionRepository: any
	) => {
		try {
			const realEstateFinded: any = await realEstateRepository.findOne({
				relations: ['user'],
				where: {
					id: data.realEstateId,
				},
			});
			if (!realEstateFinded) {
				throw new NotFoundException(
					'No se pudo encontrar el administrador ingresado'
				);
			}
			if (realEstateFinded) {
				// creo el role y lo guardo...
				const role: any = roleRepository.create({
					name: data.name,
					realEstate: realEstateFinded.id,
				});
				await roleRepository.save(role);
				const createdRole: any = await roleRepository.findOne({
					relations: ['roleToPermission'],
					where: {
						id: role.id,
					},
				});
				// busco el role y si no lo encuentro arrojo un error
				if (!createdRole) {
					throw new BadRequestException(
						'No se pudo crear el role solicitado; Algo salió mal'
					);
				}
				let permissions = await permissionsRepository.find(); // find all
				permissions.map(async (perm: any) => {
					const roleToPermissionCreated: any =
						roleToPermissionRepository.create({
							permission: perm.id,
							role: createdRole.id,
						});
					await roleToPermissionRepository.save(roleToPermissionCreated);
				});
				return {
					message: 'Rol creado con éxito',
				};
			} else {
				throw new NotFoundException(
					'No se encontró la inmobiliaria con el id especificado'
				);
			}
		} catch (err) {
			return err;
		}
	};

	mockUpExecuter = async (repository: any, data: any) => {
		for (let item of data) {
			const result = await repository.create(item);
			await repository.save(result).catch((err: any) => console.error(err));
		}
	};

	// ----------------------------------------------------------------------------------- PROPERTIES DATA
	propertiesData = async () => {
		// Lógica hecha por manu
		const PropertiesMockUp = [];
		const realEstate: any = await this.realEstateRepository.find();

		const realEstateSorted = realEstate.sort((a: any, b: any) => a.id - b.id);
		let logoUrl = {};

		realEstateSorted.map((el: any) => (logoUrl[el.id] = el.logo));

		//  ------------------------------------------------------------------------------ property_type: 1
		const departmentSeeder = async () => {
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			// -------------- primero creo el numero de id de la inmobiliaria
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});
			// -------------- luego le asigno el id al objecto, y busco el logo que le corresponde a esa inmo

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 3,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const bedrooms: number = faker.datatype.number({
				min: 0,
				max: 4,
			});
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);
			return {
				title: 'Hermoso departamento en CABA',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(faker.commerce.price(80000, 150000, 0)),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					housePhotos[
						faker.datatype.number({
							min: 0,
							max: 4,
						})
					],
					housePhotos[
						faker.datatype.number({
							min: 5,
							max: 9,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 1,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: Number(bedrooms),
					bedrooms: Number(bedrooms),
					bathrooms: faker.datatype.number({
						min: 1,
						max: 3,
					}),
					privateBathRooms: faker.datatype.boolean(),
					toilettes: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': true,
					'2': false,
					'3': false,
					'4': false,
					'5': false,
					'6': true,
					'7': false,
					'8': false,
					'9': false,
					'10': false,
					'11': true,
					'12': false,
					'13': false,
					'14': true,
					'15': false,
					'16': false,
					'17': false,
					'18': false,
					'19': false,
					'20': false,
					'21': false,
					'22': false,
					'23': true,
					'24': false,
					'25': true,
					'26': false,
					'27': false,
					'28': true,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': false,
					'35': false,
					'36': false,
					'37': false,
					'38': false,
					'39': false,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': true,
					'50': true,
					'51': true,
					'52': true,
					'53': true,
					'54': true,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 2
		const houseSeeder = async () => {
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 3,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);

			const bedrooms: number = faker.datatype.number({
				min: 0,
				max: 4,
			});
			return {
				title: 'Gran propiedad en CABA ubicada en hermosa zona',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(faker.commerce.price(80000, 150000, 0)),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					housePhotos[
						faker.datatype.number({
							min: 0,
							max: 4,
						})
					],
					housePhotos[
						faker.datatype.number({
							min: 5,
							max: 9,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 2,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: Number(bedrooms) + 1,
					bedrooms: Number(bedrooms),
					bathrooms: faker.datatype.number({
						min: 1,
						max: 3,
					}),
					privateBathRooms: faker.datatype.boolean(),
					toilettes: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': true,
					'2': true,
					'3': true,
					'4': true,
					'5': true,
					'6': true,
					'7': true,
					'8': true,
					'9': true,
					'10': true,
					'11': true,
					'12': true,
					'13': true,
					'14': true,
					'15': true,
					'16': true,
					'17': true,
					'18': true,
					'19': true,
					'20': true,
					'21': true,
					'22': true,
					'23': true,
					'24': true,
					'25': true,
					'26': true,
					'27': true,
					'28': true,
					'29': true,
					'30': true,
					'31': true,
					'32': true,
					'33': true,
					'34': true,
					'35': true,
					'36': true,
					'37': true,
					'38': true,
					'39': true,
					'40': true,
					'41': true,
					'42': true,
					'43': true,
					'44': true,
					'45': true,
					'46': true,
					'47': true,
					'48': true,
					'49': false,
					'50': false,
					'51': false,
					'52': false,
					'53': false,
					'54': false,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 3
		const pentHouseSeeder = async () => {
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 3,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);

			const bedrooms: number = faker.datatype.number({
				min: 0,
				max: 4,
			});
			return {
				title: 'Hermoso PH en CABA',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(faker.commerce.price(80000, 150000, 0)),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					housePhotos[
						faker.datatype.number({
							min: 0,
							max: 4,
						})
					],
					housePhotos[
						faker.datatype.number({
							min: 5,
							max: 9,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 3,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: Number(bedrooms) + 1,
					bedrooms: Number(bedrooms),
					bathrooms: faker.datatype.number({
						min: 1,
						max: 3,
					}),
					privateBathRooms: faker.datatype.boolean(),
					toilettes: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': true,
					'2': true,
					'3': true,
					'4': true,
					'5': true,
					'6': true,
					'7': true,
					'8': true,
					'9': true,
					'10': true,
					'11': true,
					'12': true,
					'13': true,
					'14': true,
					'15': true,
					'16': true,
					'17': true,
					'18': true,
					'19': true,
					'20': true,
					'21': true,
					'22': true,
					'23': true,
					'24': true,
					'25': true,
					'26': false,
					'27': true,
					'28': true,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': false,
					'35': false,
					'36': false,
					'37': false,
					'38': false,
					'39': false,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': false,
					'50': false,
					'51': false,
					'52': false,
					'53': false,
					'54': false,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 4
		const garageSeeder = async () => {
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 8,
					max: 18,
				})
			);
			const bedrooms: number = faker.datatype.number({
				min: 0,
				max: 4,
			});
			return {
				title: 'Estacionamiento privado para vehículo único',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					garagePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 4,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: 0,
					bedrooms: 0,
					bathrooms: 0,
					privateBathRooms: faker.datatype.boolean(),
					toilettes: 0,
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: 0,
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': true,
					'2': false,
					'3': false,
					'4': false,
					'5': false,
					'6': false,
					'7': false,
					'8': false,
					'9': false,
					'10': false,
					'11': false,
					'12': false,
					'13': false,
					'14': true,
					'15': false,
					'16': false,
					'17': false,
					'18': false,
					'19': false,
					'20': false,
					'21': false,
					'22': false,
					'23': false,
					'24': false,
					'25': true,
					'26': false,
					'27': false,
					'28': false,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': false,
					'35': false,
					'36': false,
					'37': false,
					'38': false,
					'39': false,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': false,
					'50': false,
					'51': false,
					'52': false,
					'53': false,
					'54': false,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 5
		const consultingRoomSeeder = async () => {
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);

			const bedrooms: number = faker.datatype.number({
				min: 0,
				max: 4,
			});
			return {
				title: 'Consultorio en CABA en zona concurrida',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					commercePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
					commercePhotos[
						faker.datatype.number({
							min: 3,
							max: 5,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 5,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: Number(bedrooms),
					bedrooms: Number(bedrooms),
					bathrooms: faker.datatype.number({
						min: 1,
						max: 3,
					}),
					privateBathRooms: faker.datatype.boolean(),
					toilettes: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': true,
					'2': false,
					'3': false,
					'4': true,
					'5': false,
					'6': true,
					'7': false,
					'8': false,
					'9': false,
					'10': false,
					'11': true,
					'12': false,
					'13': false,
					'14': true,
					'15': false,
					'16': false,
					'17': true,
					'18': false,
					'19': false,
					'20': false,
					'21': false,
					'22': false,
					'23': true,
					'24': false,
					'25': true,
					'26': false,
					'27': false,
					'28': true,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': true,
					'35': false,
					'36': true,
					'37': true,
					'38': true,
					'39': true,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': false,
					'50': false,
					'51': false,
					'52': true,
					'53': true,
					'54': false,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 6
		const goodWillSeeder = async () => {
			// Fondo de comercio
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);

			const bedrooms: number = faker.datatype.number({
				min: 0,
				max: 4,
			});
			return {
				title: 'Fondo de comercio en CABA, zona concurrida',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					commercePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
					commercePhotos[
						faker.datatype.number({
							min: 3,
							max: 5,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 6,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: Number(bedrooms),
					bedrooms: Number(bedrooms),
					bathrooms: faker.datatype.number({
						min: 1,
						max: 3,
					}),
					privateBathRooms: faker.datatype.boolean(),
					toilettes: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': false,
					'2': false,
					'3': false,
					'4': false,
					'5': false,
					'6': false,
					'7': false,
					'8': false,
					'9': false,
					'10': false,
					'11': false,
					'12': false,
					'13': false,
					'14': true,
					'15': false,
					'16': false,
					'17': false,
					'18': false,
					'19': false,
					'20': false,
					'21': false,
					'22': false,
					'23': false,
					'24': false,
					'25': true,
					'26': false,
					'27': false,
					'28': false,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': false,
					'35': false,
					'36': false,
					'37': false,
					'38': false,
					'39': false,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': false,
					'50': false,
					'51': false,
					'52': false,
					'53': false,
					'54': false,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 7
		const commerceSeeder = async () => {
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);

			const bedrooms: number = faker.datatype.number({
				min: 0,
				max: 4,
			});
			return {
				title: 'Local importante en CABA en zona concurrida',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					commercePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
					commercePhotos[
						faker.datatype.number({
							min: 3,
							max: 5,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 7,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: Number(bedrooms),
					bedrooms: Number(bedrooms),
					bathrooms: faker.datatype.number({
						min: 1,
						max: 3,
					}),
					privateBathRooms: faker.datatype.boolean(),
					toilettes: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': true,
					'2': false,
					'3': false,
					'4': true,
					'5': false,
					'6': true,
					'7': false,
					'8': false,
					'9': false,
					'10': false,
					'11': true,
					'12': false,
					'13': false,
					'14': true,
					'15': false,
					'16': false,
					'17': true,
					'18': false,
					'19': false,
					'20': false,
					'21': false,
					'22': false,
					'23': true,
					'24': false,
					'25': true,
					'26': false,
					'27': false,
					'28': true,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': true,
					'35': false,
					'36': true,
					'37': true,
					'38': true,
					'39': true,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': false,
					'50': false,
					'51': false,
					'52': true,
					'53': true,
					'54': false,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 8
		const commercialOfficeSeeder = async () => {
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);
			const bedrooms: number = faker.datatype.number({
				min: 0,
				max: 2,
			});

			return {
				title: 'Local comercial en CABA en zona concurrida',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					commercePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
					commercePhotos[
						faker.datatype.number({
							min: 3,
							max: 5,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 8,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: Number(bedrooms),
					bedrooms: Number(bedrooms),
					bathrooms: faker.datatype.number({
						min: 1,
						max: 3,
					}),
					privateBathRooms: faker.datatype.boolean(),
					toilettes: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': true,
					'2': false,
					'3': false,
					'4': true,
					'5': false,
					'6': true,
					'7': false,
					'8': false,
					'9': false,
					'10': false,
					'11': true,
					'12': false,
					'13': false,
					'14': true,
					'15': false,
					'16': false,
					'17': true,
					'18': false,
					'19': false,
					'20': false,
					'21': false,
					'22': false,
					'23': true,
					'24': false,
					'25': true,
					'26': false,
					'27': false,
					'28': true,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': true,
					'35': false,
					'36': true,
					'37': true,
					'38': true,
					'39': true,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': false,
					'50': false,
					'51': false,
					'52': true,
					'53': true,
					'54': false,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 9
		const storeShedDeposit = async () => {
			// Bodega/Galpón/Depósito
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);
			// const bedrooms: number = faker.datatype.number({
			// 	min: 0,
			// 	max: 4,
			// });

			return {
				title: 'Galpon-Deposito-Bodega importante en CABA en zona concurrida',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					commercePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
					commercePhotos[
						faker.datatype.number({
							min: 3,
							max: 5,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 9,
				sub_property_type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: 0,
					bedrooms: 0,
					bathrooms: faker.datatype.number({
						min: 1,
						max: 2,
					}),
					privateBathRooms: false,
					toilettes: 0,
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': true,
					'2': false,
					'3': false,
					'4': false,
					'5': false,
					'6': true,
					'7': false,
					'8': false,
					'9': false,
					'10': false,
					'11': true,
					'12': false,
					'13': false,
					'14': true,
					'15': false,
					'16': false,
					'17': false,
					'18': false,
					'19': false,
					'20': false,
					'21': false,
					'22': false,
					'23': true,
					'24': false,
					'25': true,
					'26': false,
					'27': false,
					'28': true,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': false,
					'35': false,
					'36': false,
					'37': false,
					'38': false,
					'39': false,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': true,
					'50': true,
					'51': true,
					'52': true,
					'53': true,
					'54': true,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 10
		const terrain = async () => {
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);
			return {
				title: 'Terreno en CABA en zona concurrida',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					commercePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
					commercePhotos[
						faker.datatype.number({
							min: 3,
							max: 5,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 10,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: 0,
					bedrooms: 0,
					bathrooms: 0,
					toilettes: 0,
					garages: 0,
					floors: 0,
					apartments: 0,
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': false,
					'2': false,
					'3': false,
					'4': false,
					'5': false,
					'6': false,
					'7': false,
					'8': false,
					'9': false,
					'10': false,
					'11': false,
					'12': false,
					'13': false,
					'14': false,
					'15': false,
					'16': false,
					'17': false,
					'18': false,
					'19': false,
					'20': false,
					'21': false,
					'22': false,
					'23': false,
					'24': false,
					'25': false,
					'26': false,
					'27': false,
					'28': false,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': false,
					'35': false,
					'36': false,
					'37': false,
					'38': false,
					'39': false,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': false,
					'50': false,
					'51': false,
					'52': false,
					'53': false,
					'54': false,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 11
		const hotel = async () => {
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);

			const bedrooms: number = faker.datatype.number({
				min: 5,
				max: 40,
			});

			const privateBathRooms: boolean = faker.datatype.boolean();

			const bathRooms: number = privateBathRooms ? Number(bedrooms) + 1 : 2;

			return {
				title: 'Hotel en CABA en zona concurrida',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					commercePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
					commercePhotos[
						faker.datatype.number({
							min: 3,
							max: 5,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 11,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: Number(bedrooms),
					bedrooms: Number(bedrooms),
					bathrooms: faker.datatype.number({
						min: 1,
						max: 3,
					}),
					privateBathRooms: faker.datatype.boolean(),
					toilettes: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					garages: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 2,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': faker.datatype.boolean(),
					'2': faker.datatype.boolean(),
					'3': faker.datatype.boolean(),
					'4': faker.datatype.boolean(),
					'5': faker.datatype.boolean(),
					'6': faker.datatype.boolean(),
					'7': faker.datatype.boolean(),
					'8': faker.datatype.boolean(),
					'9': faker.datatype.boolean(),
					'10': faker.datatype.boolean(),
					'11': faker.datatype.boolean(),
					'12': faker.datatype.boolean(),
					'13': faker.datatype.boolean(),
					'14': faker.datatype.boolean(),
					'15': faker.datatype.boolean(),
					'16': faker.datatype.boolean(),
					'17': faker.datatype.boolean(),
					'18': faker.datatype.boolean(),
					'19': faker.datatype.boolean(),
					'20': faker.datatype.boolean(),
					'21': faker.datatype.boolean(),
					'22': faker.datatype.boolean(),
					'23': faker.datatype.boolean(),
					'24': faker.datatype.boolean(),
					'25': faker.datatype.boolean(),
					'26': faker.datatype.boolean(),
					'27': faker.datatype.boolean(),
					'28': faker.datatype.boolean(),
					'29': faker.datatype.boolean(),
					'30': faker.datatype.boolean(),
					'31': faker.datatype.boolean(),
					'32': faker.datatype.boolean(),
					'33': faker.datatype.boolean(),
					'34': faker.datatype.boolean(),
					'35': faker.datatype.boolean(),
					'36': faker.datatype.boolean(),
					'37': faker.datatype.boolean(),
					'38': faker.datatype.boolean(),
					'39': faker.datatype.boolean(),
					'40': faker.datatype.boolean(),
					'41': faker.datatype.boolean(),
					'42': faker.datatype.boolean(),
					'43': faker.datatype.boolean(),
					'44': faker.datatype.boolean(),
					'45': faker.datatype.boolean(),
					'46': faker.datatype.boolean(),
					'47': faker.datatype.boolean(),
					'48': faker.datatype.boolean(),
					'49': faker.datatype.boolean(),
					'50': faker.datatype.boolean(),
					'51': faker.datatype.boolean(),
					'52': faker.datatype.boolean(),
					'53': faker.datatype.boolean(),
					'54': faker.datatype.boolean(),
					'55': faker.datatype.boolean(),
					'56': faker.datatype.boolean(),
					'57': faker.datatype.boolean(),
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 12
		const building = async () => {
			// Edificio
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);

			const floors: number = faker.datatype.number({
				min: 2,
				max: 10,
			});
			return {
				title: 'Edificio en sector comercial de la zona',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					commercePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
					commercePhotos[
						faker.datatype.number({
							min: 3,
							max: 5,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 12,
				sub_property_type: 0,
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					ambience: 0,
					bedrooms: 0,
					bathrooms: 0,
					toilettes: 0,
					garages: Number(Math.floor(floors * 2)),
					apartments: Number(floors) * 4,
					floors: Number(floors),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': faker.datatype.boolean(),
					'2': faker.datatype.boolean(),
					'3': faker.datatype.boolean(),
					'4': faker.datatype.boolean(),
					'5': faker.datatype.boolean(),
					'6': faker.datatype.boolean(),
					'7': faker.datatype.boolean(),
					'8': faker.datatype.boolean(),
					'9': faker.datatype.boolean(),
					'10': faker.datatype.boolean(),
					'11': faker.datatype.boolean(),
					'12': faker.datatype.boolean(),
					'13': faker.datatype.boolean(),
					'14': faker.datatype.boolean(),
					'15': faker.datatype.boolean(),
					'16': faker.datatype.boolean(),
					'17': faker.datatype.boolean(),
					'18': faker.datatype.boolean(),
					'19': faker.datatype.boolean(),
					'20': faker.datatype.boolean(),
					'21': faker.datatype.boolean(),
					'22': faker.datatype.boolean(),
					'23': faker.datatype.boolean(),
					'24': faker.datatype.boolean(),
					'25': faker.datatype.boolean(),
					'26': faker.datatype.boolean(),
					'27': faker.datatype.boolean(),
					'28': faker.datatype.boolean(),
					'29': faker.datatype.boolean(),
					'30': faker.datatype.boolean(),
					'31': faker.datatype.boolean(),
					'32': faker.datatype.boolean(),
					'33': faker.datatype.boolean(),
					'34': faker.datatype.boolean(),
					'35': faker.datatype.boolean(),
					'36': faker.datatype.boolean(),
					'37': faker.datatype.boolean(),
					'38': faker.datatype.boolean(),
					'39': faker.datatype.boolean(),
					'40': faker.datatype.boolean(),
					'41': faker.datatype.boolean(),
					'42': faker.datatype.boolean(),
					'43': faker.datatype.boolean(),
					'44': faker.datatype.boolean(),
					'45': faker.datatype.boolean(),
					'46': faker.datatype.boolean(),
					'47': faker.datatype.boolean(),
					'48': faker.datatype.boolean(),
					'49': faker.datatype.boolean(),
					'50': faker.datatype.boolean(),
					'51': faker.datatype.boolean(),
					'52': faker.datatype.boolean(),
					'53': faker.datatype.boolean(),
					'54': faker.datatype.boolean(),
					'55': faker.datatype.boolean(),
					'56': faker.datatype.boolean(),
					'57': faker.datatype.boolean(),
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};
		//  ------------------------------------------------------------------------------ property_type: 13
		const allotmentVault = async () => {
			// Bóveda/Nicho/Parcela
			const propertyStatus = [
				`${PropertyEnumStatus.pending}`,
				`${PropertyEnumStatus.paused}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.published}`,
				`${PropertyEnumStatus.finished}`,
			];
			const real_estate = faker.datatype.number({
				min: realEstateSorted[0].id,
				max: realEstateSorted[realEstateSorted.length - 1].id,
			});

			const realEstateFinded = await this.realEstateRepository.findOne({
				where: {
					id: real_estate,
				},
				relations: ['branchOffice'],
			});

			const branchOfficesLenght = realEstateFinded.branchOffice.length;

			//me traigo un id de sucursal al azar
			const branchOfficeId =
				realEstateFinded.branchOffice[
					Math.floor(Math.random() * branchOfficesLenght)
				].id;

			const branchOffice = await this.branchOfficeRepository.findOne({
				where: {
					id: branchOfficeId,
				},
			});

			const operation_type = faker.datatype.number({
				min: 1,
				max: 2,
			});
			let propertyAntiquity = {
				type: faker.datatype.number({
					min: 1,
					max: 3,
				}),
				years: 1,
			};
			if (propertyAntiquity.type === 2) {
				propertyAntiquity.years = faker.datatype.number({
					min: 1,
					max: 50,
				});
			}
			const totalSurface = Number(
				faker.datatype.number({
					min: 40,
					max: 100,
				})
			);

			return {
				title: 'Excelente sector cercano a la entrada',
				description: faker.commerce.productDescription(),
				price: {
					total: Number(
						operation_type === 1
							? faker.commerce.price(30000, 80000, 0)
							: faker.commerce.price(50000, 230000, 0)
					),
					currency: faker.datatype.number({
						min: 1,
						max: 2,
					}),
				},
				status:
					propertyStatus[
						faker.datatype.number({
							min: 0,
							max: 5,
						})
					],
				images: [
					commercePhotos[
						faker.datatype.number({
							min: 0,
							max: 2,
						})
					],
					commercePhotos[
						faker.datatype.number({
							min: 3,
							max: 5,
						})
					],
				],
				video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
				video360: '',
				real_estate: realEstateFinded,
				branch_office: branchOffice,
				operation_type: operation_type,
				property_type: 13,
				sub_property_type: faker.datatype.number({
					min: 4,
					max: 6,
				}),
				location: {
					number: faker.datatype.number({
						min: 100,
						max: 8000,
					}),
					street: faker.address.street(),
					barrio: faker.datatype.number({
						min: 1,
						max: 48,
					}),
					lat: -34.5902857,
					lng: -58.41358,
					cp: 'C1425',
					cp_suffix: 'DKE',
					area_level_1: 'Buenos Aires',
					area_level_2: 'Comuna 14',
					locality: 'Buenos Aires',
				},
				surface: {
					totalSurface: totalSurface,
					coveredSurface: totalSurface,
				},
				antiquity: propertyAntiquity,
				characteristics: {
					bedrooms: 0,
					bathrooms: 0,
					toilettes: 0,
					garages: 0,
					apartments: 0,
					ambience: faker.datatype.number({
						min: 1,
						max: 4,
					}),
					floors: faker.datatype.number({
						min: 0,
						max: 1,
					}),
					covered: faker.datatype.boolean(),
					lift: faker.datatype.boolean(),
					underground: faker.datatype.boolean(),
					building: faker.datatype.boolean(),
				},
				extras: {
					'1': true,
					'2': false,
					'3': false,
					'4': false,
					'5': false,
					'6': true,
					'7': false,
					'8': false,
					'9': false,
					'10': false,
					'11': true,
					'12': false,
					'13': false,
					'14': false,
					'15': false,
					'16': false,
					'17': false,
					'18': false,
					'19': false,
					'20': false,
					'21': false,
					'22': false,
					'23': true,
					'24': false,
					'25': true,
					'26': false,
					'27': false,
					'28': false,
					'29': false,
					'30': false,
					'31': false,
					'32': false,
					'33': false,
					'34': false,
					'35': false,
					'36': false,
					'37': false,
					'38': false,
					'39': false,
					'40': false,
					'41': false,
					'42': false,
					'43': false,
					'44': false,
					'45': false,
					'46': false,
					'47': false,
					'48': false,
					'49': true,
					'50': true,
					'51': true,
					'52': true,
					'53': true,
					'54': false,
					'55': false,
					'56': false,
					'57': false,
				},
				created_at: new Date(),
				updated_at: new Date(),
				deleted_at: null,
			};
		};

		Array.from({ length: 1000 }).forEach(async () => {
			PropertiesMockUp.push(
				houseSeeder(),
				commerceSeeder(),
				departmentSeeder(),
				commercialOfficeSeeder(),
				pentHouseSeeder()
			);
		});

		Array.from({ length: 700 }).forEach(async () => {
			PropertiesMockUp.push(
				garageSeeder(),
				consultingRoomSeeder(),
				goodWillSeeder(),
				storeShedDeposit(),
				terrain(),
				hotel(),
				building(),
				allotmentVault()
			);
		});

		return Promise.all(PropertiesMockUp);
	};

	mockUpPropertiesExecuter = async (propertySchema: any) => {
		const data = await this.propertiesData();
		if (fs.existsSync(`./uploads/properties`)) {
			fsExtra.emptyDirSync(`./uploads/properties`);
		}
		fs.mkdir(`./uploads/properties`, { recursive: true }, (err) => {
			if (err) {
				return err;
			}
		});
		for (const item of data) {
			const propertyCreated = await propertySchema.create(item);
			const newName = propertyCreated._id;
			// preguntar si tambien las imagenes de las finalizadas se guardan
			if (item.status !== PropertyEnumStatus.deleted) {
				fs.mkdir(
					`./uploads/properties/${newName}`,
					{ recursive: true },
					(err) => {
						if (err) {
							return err;
						}
					}
				);
			}
		}
	};
}
