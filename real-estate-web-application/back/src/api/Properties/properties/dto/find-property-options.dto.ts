import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from '@nestjs/class-validator';
import {
	CurrencyEnumNumbers,
	SurfaceEnumType,
} from '../../../../config/enum-types';
import { IsEnum } from 'class-validator';

class Price {
	@ApiProperty({
		description: 'USD or ARS',
		example: CurrencyEnumNumbers.USD,
	})
	@IsEnum(CurrencyEnumNumbers)
	currency: CurrencyEnumNumbers;

	@ApiProperty({
		description: 'minimal value of currency',
	})
	min: number;

	@ApiProperty({
		description: 'minimal value of currency',
	})
	max: number;
}

class Surface {
	@ApiProperty({
		description: 'totalSurface or coveredSurface',
		example: SurfaceEnumType.totalSurface,
	})
	@IsEnum(SurfaceEnumType)
	type: SurfaceEnumType;

	@ApiProperty({
		description: 'minimal value of totalSurface or coveredSurface',
	})
	min: number;

	@ApiProperty({
		description: 'minimal value of totalSurface or coveredSurface',
	})
	max: number;
}

export class FindPropertyOptionsDto {
	@ApiProperty({
		description: 'Operation type id',
	})
	@IsOptional()
	@IsNumber()
	operationType?: number;

	@ApiProperty({
		description: 'List of neighborhoods id',
		type: Number,
		isArray: true,
	})
	@IsOptional()
	barrios: [];

	@ApiProperty({
		description: 'List of property types id',
		type: Number,
		isArray: true,
	})
	@IsOptional()
	propertyTypes: [];

	@ApiProperty({
		description: 'Price in USD or ARS currency',
	})
	@IsOptional()
	price: Price;

	@ApiProperty({
		description: 'Property surface',
	})
	@IsOptional()
	surface: Surface;

	@ApiProperty({
		description: 'Ambiences quantity',
	})
	@IsNumber()
	@IsOptional()
	ambiences: number;

	@ApiProperty({
		description: 'Bedrooms quantity',
	})
	@IsNumber()
	@IsOptional()
	bedRooms: number;

	@ApiProperty({
		description: 'Bathrooms quantity',
	})
	@IsNumber()
	@IsOptional()
	bathRooms: number;

	@ApiProperty({
		description: 'Garages quantity',
	})
	@IsNumber()
	@IsOptional()
	garages: number;
}
