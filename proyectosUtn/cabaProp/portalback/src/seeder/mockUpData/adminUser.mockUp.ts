import { TypeOfUser, UserEnumStatus } from '../../config/enum-types';
import { faker } from '@faker-js/faker/locale/es_MX';
import axios from 'axios';

export const adminUserMockUp = async () => {
	const arr = [];

	for (let i = 0; i < 100; i++) {
		let lastName = faker.name.lastName(); 
		const realEstateLogo = await axios.get(
			'https://loremflickr.com/600/600/realestatelogo'
		);
		const branchOfficesQuantity = faker.datatype.number({
			min: 1,
			max: 3,
		});
		const branchOffices = [];
		for (let j = 1; j <= branchOfficesQuantity; j++) {
			branchOffices.push({
				branch_office_name: `Sucursal ${lastName} Nro ${i + 1}`,
				phoneNumber: faker.phone.number('11#######'), // numero movil
				openingHours: '8-12hs / 15-19hs', // => este dato NO VIENE
				isCentral: j === 1,
				isActive: true,
				address: `${faker.address.street()} ${faker.datatype.number({
					min: 100,
					max: 8000,
				})}`,
			});
		}

		const mock = {
			firstName: !i ? 'Aspirante' : faker.name.firstName(),
			lastName: !i ? 'Uno' : faker.name.lastName(),
			email: !i ? 'aspirante@uno.com' : `admin${i}@mail.com`,
			dni: `${faker.datatype.number({
				min: 10000000,
				max: 40000000,
			})}`,
			realAddress: `${faker.address.street()} ${faker.datatype.number({
				min: 100,
				max: 8000,
			})}`,
			legalAddress: `${faker.address.street()} ${faker.datatype.number({
				min: 100,
				max: 8000,
			})}`,
			phoneNumber: faker.phone.number('11#######'),
			typeOfUser: TypeOfUser.adminUser,
			status: UserEnumStatus.active,
			password: !i ? null : 'Cucicba123.',
			realEstate: {
				name: `Inmobiliaria ${lastName} ${i + 1}`,
				description:
					'Somos una inmobiliaria que ahora se acerca a vos de manera personal..somos personal-inmo',
				// website: faker.internet.url(), // no viene
				logo: realEstateLogo.request.res.responseUrl, // el logo es opcional
				branchOffices: !i
					? [
							{
								branch_office_name: `Sucursal 1 Inmo ${i + 1}`,
								phoneNumber: faker.phone.number('11#######'), // numero movil
								openingHours: '8-12hs / 15-19hs', // => este dato NO VIENE
								isCentral: true,
								isActive: true,
								address: `Domicilio Casa Central 123`,
							},
					  ]
					: branchOffices,
			},
		};

		arr.push(mock);
	}

	return arr;
};
