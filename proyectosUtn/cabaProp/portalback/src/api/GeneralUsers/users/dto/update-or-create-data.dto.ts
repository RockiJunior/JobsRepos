import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class BranchOfficeDto {
	@ApiProperty({
		description: 'Office address',
	})
	@IsString()
	@IsNotEmpty({
		message: 'Please Insert the branch office address',
	})
	domicilio: string;

	@ApiProperty({
		description: 'Office phone',
	})
	@IsString()
	@IsNotEmpty({
		message: 'Please Insert the branch office phone number',
	})
	telefono: string;
}

export class UpdateOrCreateDataDto {
	@ApiProperty({
		description: 'User email',
	})
	email: string;

	@ApiProperty({
		description: 'User name',
	})
	nombre: string;

	@ApiProperty({
		description: 'User lastname',
	})
	apellido: string;

	@ApiProperty({
		description: 'Real Estate Name',
	})
	nombreFantasia: string;

	@ApiProperty({
		description: 'Personal cellphone',
	})
	celularParticular: string;

	@ApiProperty({
		description: 'Personal fix Phone',
	})
	telefonoParticular: string;

	@ApiProperty({
		description: 'Comercial Phone',
	})
	telefonoComercial: string;

	@ApiProperty({
		description: 'Real address',
	})
	domicilioReal: string;

	@ApiProperty({
		description: 'Legal address',
	})
	domicilioLegal: string;

	@ApiProperty({
		description: 'User dni',
	})
	dni: string;

	@ApiProperty({
		description: 'User License',
	})
	matricula: any;

	@ApiProperty({
		description: 'Branch offices Array',
		isArray: true,
		example: [
			{
				domicilio: 'string',
				telefono: 'string',
			},
		],
	})
	@ValidateNested({
		each: true,
	})
	@Type(() => BranchOfficeDto)
	@IsNotEmpty({ each: true })
	sucursales: BranchOfficeDto[];
}
