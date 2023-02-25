import { faker } from '@faker-js/faker/locale/es_MX';
import { PropertyEnumStatus } from 'src/config/enum-types';
import { commercePhotos, garagePhotos, housePhotos } from './propertiesImages.mockUp';

const houseSeeder = () => {
	const propertyStatus = [
		`${PropertyEnumStatus.pending}`,
		`${PropertyEnumStatus.paused}`,
		`${PropertyEnumStatus.published}`,
		`${PropertyEnumStatus.finished}`,
	];

	const real_estate = faker.datatype.number({
		min: 1,
		max: 5,
	});

	const branchOffice = faker.datatype.number({
		min: real_estate * 3 - 2,
		max: real_estate * 3,
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

	const totalSurface = Number(faker.datatype.number({
		min: 40,
		max: 100,
	}));

	return {
		title: 'Hermosa propiedad en CABA',
		description: faker.commerce.productDescription(),
		price: {
			total: Number(faker.commerce.price(80000, 150000, 0)),
			currency: operation_type === 1 ? 1 : 2,
		},
		status:
			propertyStatus[
			faker.datatype.number({
				min: 0,
				max: 3,
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
		real_estate: real_estate,
		branch_office: branchOffice,
		operation_type: operation_type,
		property_type: faker.datatype.number({
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
			ambience: faker.datatype.number({
				min: 1,
				max: 5,
			}),
			bedrooms: faker.datatype.number({
				min: 1,
				max: 5,
			}),
			bathrooms: faker.datatype.number({
				min: 1,
				max: 3,
			}),
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
			'49': faker.datatype.boolean(),
			'50': faker.datatype.boolean(),
			'51': faker.datatype.boolean(),
			'54': faker.datatype.boolean(),
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
			'52': faker.datatype.boolean(),
			'53': faker.datatype.boolean(),
		},
		created_at: new Date(),
		updated_at: new Date(),
		deleted_at: null,
	};
};

const commerceSeeder = () => {
	const propertyStatus = [
		`${PropertyEnumStatus.pending}`,
		`${PropertyEnumStatus.paused}`,
		`${PropertyEnumStatus.published}`,
		`${PropertyEnumStatus.finished}`,
	];

	const real_estate = faker.datatype.number({
		min: 1,
		max: 5,
	});

	const branchOffice = faker.datatype.number({
		min: real_estate * 3 - 2,
		max: real_estate * 3,
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

	const totalSurface = Number(faker.datatype.number({
		min: 40,
		max: 100,
	}));

	return {
		title: 'Local importante en CABA en zona concurrida',
		description: faker.commerce.productDescription(),
		price: {
			total: Number(operation_type === 1 ? faker.commerce.price(30000, 80000, 0) : faker.commerce.price(50000, 230000, 0)),
			currency: operation_type === 1 ? 1 : 2,
		},
		status:
			propertyStatus[
			faker.datatype.number({
				min: 0,
				max: 3,
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
		real_estate: real_estate,
		branch_office: branchOffice,
		operation_type: operation_type,
		property_type: faker.datatype.number({
			min: 5,
			max: 8,
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
			ambience: faker.datatype.number({
				min: 1,
				max: 2,
			}),
			bathrooms: faker.datatype.number({
				min: 1,
				max: 2,
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
			'49': faker.datatype.boolean(),
			'50': faker.datatype.boolean(),
			'51': faker.datatype.boolean(),
			'54': faker.datatype.boolean(),
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
			'52': faker.datatype.boolean(),
			'53': faker.datatype.boolean(),
		},
		created_at: new Date(),
		updated_at: new Date(),
		deleted_at: null,
	};
};

const garageSeeder = () => {
	const propertyStatus = [
		`${PropertyEnumStatus.pending}`,
		`${PropertyEnumStatus.paused}`,
		`${PropertyEnumStatus.published}`,
		`${PropertyEnumStatus.finished}`,
	];

	const real_estate = faker.datatype.number({
		min: 1,
		max: 5,
	});

	const branchOffice = faker.datatype.number({
		min: real_estate * 3 - 2,
		max: real_estate * 3,
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

	const totalSurface = Number(faker.datatype.number({
		min: 8,
		max: 18,
	}));

	return {
		title: 'Estacionamiento en garage privado 24hs',
		description: faker.commerce.productDescription(),
		price: {
			total: Number(operation_type === 1 ? faker.commerce.price(30000, 80000, 0) : faker.commerce.price(50000, 230000, 0)),
			currency: operation_type === 1 ? 1 : 2,
		},
		status:
			propertyStatus[
			faker.datatype.number({
				min: 0,
				max: 3,
			})
			],
		images: [
			garagePhotos[
			faker.datatype.number({
				min: 0,
				max: 2,
			})
			]
		],
		video: 'https://www.youtube.com/watch?v=LipQ7m8bQL4',
		video360: '',
		real_estate: real_estate,
		branch_office: branchOffice,
		operation_type: operation_type,
		property_type: faker.datatype.number({
			min: 5,
			max: 8,
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
			ambience: faker.datatype.number({
				min: 1,
				max: 2,
			}),
			bathrooms: faker.datatype.number({
				min: 1,
				max: 2,
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
			'49': faker.datatype.boolean(),
			'50': faker.datatype.boolean(),
			'51': faker.datatype.boolean(),
			'54': faker.datatype.boolean(),
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
			'52': faker.datatype.boolean(),
			'53': faker.datatype.boolean(),
		},
		created_at: new Date(),
		updated_at: new Date(),
		deleted_at: null,
	};
};

export const PropertiesMockUp = [];


Array.from({ length: 300 }).forEach(() => {
	PropertiesMockUp.push(houseSeeder(), commerceSeeder());
});

Array.from({ length: 100 }).forEach(() => {
	PropertiesMockUp.push(garageSeeder())
})