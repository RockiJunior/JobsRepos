import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	MaxLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString, ValidateNested } from 'class-validator';

export class SubBranchOffice {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	branch_office_name: string;

	@ApiProperty()
	@IsBoolean()
	isCentral: boolean;

	@ApiProperty()
	@IsBoolean()
	isActive: boolean;

	@ApiProperty()
	@IsString()
	phoneNumber: string;

	@ApiProperty()
	@IsString()
	openingHours: string;

	@ApiProperty()
	@IsString()
	address: string;

	@ApiProperty()
	@IsDate()
	created_at: Date;

	@ApiProperty()
	@IsDate()
	updated_at: Date;
}

export class SubRealEstate {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsString()
	logo: string;

	@ApiProperty()
	@IsDate()
	created_at: Date;

	@ApiProperty()
	@IsDate()
	updated_at: Date;
}

export class SubLocation {
	@IsNotEmpty({
		message: 'Please enter the name of the street location',
	})
	street: string;

	@IsNotEmpty({
		message: 'Please enter the number of the street location',
	})
	number: number;

	@ApiProperty({
		description: 'Number of Apartment',
	})
	@IsOptional()
	floor?: number;

	@ApiProperty({
		description: 'Letter Id of apartment',
	})
	@IsOptional()
	apartment?: string;

	@ApiProperty({
		description: 'Barrio',
	})
	@IsOptional()
	barrio?: number;
}

export class CreatePropertyDto {
	@ApiProperty({
		description: 'Publication title',
	})
	@IsString()
	@IsOptional()
	@MaxLength(100)
	title: string;

	@ApiProperty({
		description: 'Property Description',
	})
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty({
		description: 'Real Estate Object',
	})
	@ValidateNested({ each: true, message: 'Real Estate object is invalid' })
	real_estate: SubRealEstate;

	@ApiProperty({
		description: 'Branch Office Object',
	})
	@ValidateNested({ each: true, message: 'Branch Office object is invalid' })
	branch_office: SubBranchOffice;

	@ApiProperty({
		description: 'Type Operation',
	})
	@IsNumber()
	operation_type: number;

	@ApiProperty({
		description: 'Type of property',
	})
	@IsNumber()
	property_type: number;

	@ApiProperty({
		description: 'Location properties',
		type: () => SubLocation,
		required: true,
	})
	@IsNotEmpty({
		message: 'Please enter location properties',
	})
	location!: SubLocation;
}
