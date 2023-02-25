import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	MaxLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, IsString } from 'class-validator';

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
	@MaxLength(50)
	title: string;

	@ApiProperty({
		description: 'Property Description',
	})
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty({
		description: 'Id of Real Estate',
	})
	@IsOptional()
	@IsNumber()
	real_estate: number;

	@ApiProperty({
		description: 'Id of Branch Office',
	})
	@IsNumber()
	branch_office: number;

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
